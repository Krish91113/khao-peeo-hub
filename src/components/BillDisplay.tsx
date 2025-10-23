import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface BillDisplayProps {
  bill: any;
  onClose: () => void;
}

const BillDisplay = ({ bill, onClose }: BillDisplayProps) => {
  const handlePrint = () => {
    window.print();
    toast.success("Bill ready to print");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Bill */}
      <Card className="print:shadow-none">
        <CardHeader className="text-center border-b">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">KHAO PEEO</CardTitle>
            <p className="text-sm text-muted-foreground">Restaurant Management System</p>
            <p className="text-xs text-muted-foreground">
              Date: {formatDate(bill.created_at)}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Table Info */}
          <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Table Number</p>
              <p className="text-2xl font-bold">Table {bill.table.table_number}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Bill No</p>
              <p className="text-lg font-mono">{bill.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Order Items</h3>
            <div className="space-y-2">
              {bill.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{parseFloat(bill.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%):</span>
              <span>₹{parseFloat(bill.tax).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>Total Amount:</span>
              <span className="text-primary">₹{parseFloat(bill.total_amount).toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Thank you for dining with us!</p>
            <p>Visit again soon</p>
          </div>
        </CardContent>
      </Card>

      {/* Kitchen Ticket */}
      <Card className="print:shadow-none">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <CardTitle className="text-center">KITCHEN TICKET</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="text-center space-y-2">
            <p className="text-3xl font-bold">Table {bill.table.table_number}</p>
            <p className="text-sm text-muted-foreground">{formatDate(bill.created_at)}</p>
          </div>
          <Separator />
          <div className="space-y-3">
            {bill.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-bold text-lg">{item.name}</span>
                <span className="text-2xl font-bold text-primary">× {item.quantity}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 print:hidden">
        <Button onClick={handlePrint} className="flex-1" variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button onClick={onClose} className="flex-1">
          <CheckCircle className="h-4 w-4 mr-2" />
          Done
        </Button>
      </div>
    </div>
  );
};

export default BillDisplay;
