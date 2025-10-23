import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Clock, TrendingUp, Shield } from "lucide-react";
import heroImage from "@/assets/hero-restaurant.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Navbar */}
      <nav className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              KHAO PEEO
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm">
              Smart Restaurant Management
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Eat. Drink.{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Manage. Repeat!
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Smart, efficient restaurant billing software designed for modern restaurants. 
              Manage tables, orders, and billing seamlessly.
            </p>
            <div className="flex gap-4">
              <Link to="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
            <img
              src={heroImage}
              alt="Restaurant Management"
              className="relative rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose KHAO PEEO?</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to run your restaurant efficiently
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Fast Operations</h3>
            <p className="text-muted-foreground">
              Process orders and generate bills in seconds. Speed up your service and delight customers.
            </p>
          </div>
          <div className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border">
            <div className="h-12 w-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Smart Analytics</h3>
            <p className="text-muted-foreground">
              Track sales, monitor performance, and make data-driven decisions for your restaurant.
            </p>
          </div>
          <div className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border">
            <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Secure & Reliable</h3>
            <p className="text-muted-foreground">
              Role-based access control ensures your data is safe and only accessible to authorized staff.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Restaurant?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of restaurants using KHAO PEEO to streamline operations
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <span className="font-bold">KHAO PEEO</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Khao Peeo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
