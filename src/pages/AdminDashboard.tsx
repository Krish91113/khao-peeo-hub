import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, LogOut, Plus } from "lucide-react";
import { toast } from "sonner";
import TableManagement from "@/components/TableManagement";
import OrderEntry from "@/components/OrderEntry";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [showOrderEntry, setShowOrderEntry] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    setProfile(profileData);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleTableSelect = (table: any) => {
    setSelectedTable(table);
    setShowOrderEntry(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">KHAO PEEO</h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{profile?.full_name || "Admin"}</p>
              <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-2">Restaurant Management (POS)</h2>
          <p className="text-muted-foreground">Stage 1: POS for manual order entry - Manage tables, orders, and billing</p>
        </div>

        {!showOrderEntry ? (
          <div className="animate-fade-in">
            <TableManagement 
              onTableSelect={handleTableSelect}
              onResetTable={(tableId) => {
                // Refresh tables when a table is reset
                if (selectedTable?.id === tableId) {
                  setSelectedTable(null);
                }
              }}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <Button
              variant="outline"
              className="mb-4 hover:bg-muted transition-all duration-300"
              onClick={() => {
                setShowOrderEntry(false);
                setSelectedTable(null);
              }}
            >
              ← Back to Tables
            </Button>
            <OrderEntry table={selectedTable} onComplete={() => setShowOrderEntry(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
