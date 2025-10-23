import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, Receipt, Printer } from "lucide-react";
import { toast } from "sonner";
import BillDisplay from "./BillDisplay";

interface OrderEntryProps {
  table: any;
  onComplete: () => void;
}

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

const MENU_ITEMS = [
  { name: "Paneer Handi", price: 280 },
  { name: "Butter Chicken", price: 320 },
  { name: "Dal Makhani", price: 220 },
  { name: "Naan", price: 40 },
  { name: "Biryani", price: 350 },
  { name: "Tandoori Roti", price: 30 },
  { name: "Raita", price: 80 },
  { name: "Gulab Jamun", price: 100 },
];

const OrderEntry = ({ table, onComplete }: OrderEntryProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const addToCart = () => {
    if (!selectedItem) {
      toast.error("Please select an item");
      return;
    }

    const menuItem = MENU_ITEMS.find((item) => item.name === selectedItem);
    if (!menuItem) return;

    const existingItem = cart.find((item) => item.name === selectedItem);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.name === selectedItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...menuItem, quantity }]);
    }

    toast.success("Item added to cart");
    setSelectedItem("");
    setQuantity(1);
  };

  const updateQuantity = (itemName: string, delta: number) => {
    setCart(
      cart
        .map((item) =>
          item.name === itemName
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (itemName: string) => {
    setCart(cart.filter((item) => item.name !== itemName));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const generateBill = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { subtotal, tax, total } = calculateTotal();

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          table_id: table.id,
          total_amount: total,
          created_by: user?.id,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Create bill
      const { data: bill, error: billError } = await supabase
        .from("bills")
        .insert({
          order_id: order.id,
          table_id: table.id,
          subtotal,
          tax,
          total_amount: total,
          payment_status: "pending",
        })
        .select()
        .single();

      if (billError) throw billError;

      // Update table status
      await supabase
        .from("restaurant_tables")
        .update({
          is_booked: true,
          current_order_id: order.id,
        })
        .eq("id", table.id);

      setBillData({ ...bill, items: cart, table });
      setShowBill(true);
      toast.success("Bill generated successfully!");
    } catch (error: any) {
      toast.error("Failed to generate bill");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (showBill && billData) {
    return <BillDisplay bill={billData} onClose={() => {
      setShowBill(false);
      onComplete();
    }} />;
  }

  const { subtotal, tax, total } = calculateTotal();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Menu Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Add Items - Table {table.table_number}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Item</Label>
            <select
              className="w-full p-2 border rounded-lg"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              <option value="">Choose an item...</option>
              {MENU_ITEMS.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} - ₹{item.price}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>
          <Button onClick={addToCart} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardContent>
      </Card>

      {/* Cart */}
      <Card>
        <CardHeader>
          <CardTitle>Current Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Cart is empty</p>
          ) : (
            <>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.name, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.name, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromCart(item.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (5%):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={generateBill}
                className="w-full"
                disabled={loading}
              >
                <Receipt className="h-4 w-4 mr-2" />
                {loading ? "Generating..." : "Generate Bill & Ticket"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderEntry;
