import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface TableManagementProps {
  onTableSelect: (table: any) => void;
  onResetTable?: (tableId: string) => void;
}

const TableManagement = ({ onTableSelect, onResetTable }: TableManagementProps) => {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resettingTable, setResettingTable] = useState<string | null>(null);

  useEffect(() => {
    fetchTables();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel("restaurant_tables_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "restaurant_tables",
        },
        () => {
          fetchTables();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTables = async () => {
    try {
      const { data, error } = await supabase
        .from("restaurant_tables")
        .select("*")
        .order("table_number");

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist') || error.message.includes('404')) {
          toast.error("Database tables not found! Please run the database setup script. See SETUP_DATABASE.md for instructions.");
          console.error("Table 'restaurant_tables' does not exist. Run setup_database.sql in Supabase SQL Editor.");
        } else {
          throw error;
        }
        return;
      }
      setTables(data || []);
    } catch (error: any) {
      console.error("Failed to load tables:", error);
      toast.error("Failed to load tables: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleResetTable = async (table: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent table selection
    setResettingTable(table.id);
    
    try {
      // First, mark the associated order as "served" if it exists
      if (table.current_order_id) {
        const { error: orderError } = await supabase
          .from("orders")
          .update({ status: "served" })
          .eq("id", table.current_order_id);

        if (orderError) {
          console.error("Failed to update order status:", orderError);
          // Continue with table reset even if order update fails
        }
      }

      // Reset table status
      const { error } = await supabase
        .from("restaurant_tables")
        .update({
          is_booked: false,
          current_order_id: null,
        })
        .eq("id", table.id);

      if (error) throw error;

      toast.success(`Table ${table.table_number} marked as served and reset successfully`);
      
      // Refresh tables list
      await fetchTables();
      
      // Call callback if provided
      if (onResetTable) {
        onResetTable(table.id);
      }
    } catch (error: any) {
      console.error("Failed to reset table:", error);
      toast.error("Failed to reset table: " + (error.message || "Unknown error"));
    } finally {
      setResettingTable(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tables...</div>;
  }

  if (tables.length === 0 && !loading) {
    return (
      <div className="text-center py-12 space-y-4">
        <h3 className="text-2xl font-bold">No Tables Found</h3>
        <p className="text-muted-foreground">
          Database tables not set up. Please run the database setup script.
        </p>
        <div className="bg-muted p-4 rounded-lg max-w-2xl mx-auto text-left">
          <p className="font-semibold mb-2">Quick Fix:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Go to Supabase Dashboard → SQL Editor</li>
            <li>Open <code className="bg-background px-1 rounded">setup_database.sql</code> file</li>
            <li>Copy entire content → Paste in SQL Editor → Run</li>
            <li>Refresh this page</li>
          </ol>
          <p className="text-xs text-muted-foreground mt-2">
            See <code className="bg-background px-1 rounded">SETUP_DATABASE.md</code> for detailed instructions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Restaurant Tables</h3>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <Card
            key={table.id}
            className={`transition-all hover:shadow-lg ${
              table.is_booked ? "border-primary" : "border-border"
            } ${!table.is_booked ? "cursor-pointer" : ""}`}
            onClick={() => !table.is_booked && onTableSelect(table)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Table {table.table_number}</CardTitle>
                <Badge variant={table.is_booked ? "default" : "secondary"}>
                  {table.is_booked ? "Booked" : "Available"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Users className="h-4 w-4" />
                <span>Capacity: {table.capacity}</span>
              </div>
              {table.is_booked && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                      disabled={resettingTable === table.id}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${resettingTable === table.id ? "animate-spin" : ""}`} />
                      {resettingTable === table.id ? "Marking as Served..." : "Mark as Served"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Mark Table {table.table_number} as Served?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This confirms that the food has been served and the customer has left. 
                        The table will be reset and made available for new orders.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResetTable(table, e);
                        }}
                      >
                        Mark as Served
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TableManagement;
