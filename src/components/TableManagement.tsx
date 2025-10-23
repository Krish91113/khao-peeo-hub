import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus } from "lucide-react";
import { toast } from "sonner";

interface TableManagementProps {
  onTableSelect: (table: any) => void;
}

const TableManagement = ({ onTableSelect }: TableManagementProps) => {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

      if (error) throw error;
      setTables(data || []);
    } catch (error: any) {
      toast.error("Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tables...</div>;
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
            className={`cursor-pointer transition-all hover:shadow-lg ${
              table.is_booked ? "border-primary" : "border-border"
            }`}
            onClick={() => onTableSelect(table)}
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
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Capacity: {table.capacity}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TableManagement;
