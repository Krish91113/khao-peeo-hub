import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters").optional(),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"owner" | "admin">("admin");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const validation = authSchema.safeParse({
        email,
        password,
        fullName: !isLogin ? fullName : undefined,
      });

      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        setLoading(false);
        return;
      }

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
          return;
        }

        if (data.user) {
          // Get user profile to determine role
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

          toast.success("Signed in successfully!");
          
          if (profile?.role === "owner") {
            navigate("/owner-dashboard");
          } else {
            navigate("/admin-dashboard");
          }
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please sign in instead.");
          } else {
            toast.error(error.message);
          }
          return;
        }

        if (data.user) {
          toast.success("Account created successfully!");
          
          if (role === "owner") {
            navigate("/owner-dashboard");
          } else {
            navigate("/admin-dashboard");
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
              <UtensilsCrossed className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-3xl font-bold">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-base">
              {isLogin
                ? "Sign in to manage your restaurant"
                : "Sign up to get started with KHAO PEEO"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {!isLogin && (
              <div className="space-y-3">
                <Label>Select Your Role</Label>
                <RadioGroup value={role} onValueChange={(value: "owner" | "admin") => setRole(value)}>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="owner" id="owner" />
                    <Label htmlFor="owner" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Owner</div>
                      <div className="text-xs text-muted-foreground">Full access to all features and admin management</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Admin</div>
                      <div className="text-xs text-muted-foreground">Manage tables, orders, and billing</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
