import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  UtensilsCrossed, 
  Clock, 
  TrendingUp, 
  Shield, 
  Check,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Users,
  BarChart3,
  Smartphone,
  Headphones,
  Zap,
  Receipt
} from "lucide-react";
import { useState } from "react";
import heroImage from "@/assets/hero-restaurant.jpg";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              KHAO PEEO
            </h1>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Pricing
            </a>
            <a href="#about" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              About Us
            </a>
            <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Contact
            </a>
          </div>
          
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="text-gray-700">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                Start Free Trial
              </Button>
            </Link>
          </div>

          <button 
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#features" className="text-gray-700 hover:text-orange-600 py-2">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-orange-600 py-2">Pricing</a>
              <a href="#about" className="text-gray-700 hover:text-orange-600 py-2">About Us</a>
              <a href="#contact" className="text-gray-700 hover:text-orange-600 py-2">Contact</a>
              <Link to="/auth">
                <Button variant="ghost" className="w-full">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-orange-100 rounded-full text-orange-700 font-semibold text-sm">
              #1 Restaurant Management Software
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-gray-900">
              Complete Restaurant Management Solution
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              From table reservations to billing, inventory to analytics - manage your entire restaurant operation from one powerful platform. Trusted by 5000+ restaurants worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/auth">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8">
                  Start 14-Day Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 border-gray-300">
                Schedule Demo
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-red-600/30 rounded-3xl blur-3xl" />
            <img
              src={heroImage}
              alt="Restaurant Management Dashboard"
              className="relative rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">5000+</div>
              <div className="text-gray-600">Active Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">2M+</div>
              <div className="text-gray-600">Orders Processed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Powerful Features for Modern Restaurants</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to streamline operations, increase revenue, and deliver exceptional dining experiences
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="h-14 w-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <Clock className="h-7 w-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Quick Order Processing</h3>
            <p className="text-gray-600 leading-relaxed">
              Take orders in seconds with our intuitive interface. Reduce wait times and improve table turnover rates significantly.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Real-time Analytics</h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor sales, track bestsellers, and analyze customer preferences with comprehensive reporting dashboards.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="h-14 w-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Shield className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Secure & Compliant</h3>
            <p className="text-gray-600 leading-relaxed">
              Bank-grade security with role-based access control. Stay compliant with all tax and regulatory requirements.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Users className="h-7 w-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Table Management</h3>
            <p className="text-gray-600 leading-relaxed">
              Visual table layout with live status updates. Manage reservations and optimize seating arrangements effortlessly.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="h-14 w-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="h-7 w-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Inventory Control</h3>
            <p className="text-gray-600 leading-relaxed">
              Track stock levels in real-time, set automatic reorder points, and reduce food wastage with smart inventory management.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="h-14 w-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
              <Smartphone className="h-7 w-7 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Mobile Compatible</h3>
            <p className="text-gray-600 leading-relaxed">
              Access from any device - desktop, tablet, or mobile. Manage your restaurant from anywhere, anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your restaurant. All plans include 14-day free trial.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Starter</h3>
              <p className="text-gray-600 mb-6">Perfect for small restaurants</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">₹2,999</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Up to 10 tables</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Basic billing & invoicing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Menu management</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Daily reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Email support</span>
                </li>
              </ul>
              <Link to="/auth" className="block">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-2xl p-8 relative transform lg:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Professional</h3>
              <p className="text-orange-100 mb-6">For growing restaurants</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">₹5,999</span>
                <span className="text-orange-100">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Up to 30 tables</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Advanced billing & KOT</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Inventory management</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Staff management</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Analytics dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-white">Priority support</span>
                </li>
              </ul>
              <Link to="/auth" className="block">
                <Button className="w-full bg-white hover:bg-gray-100 text-orange-600">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Enterprise</h3>
              <p className="text-gray-600 mb-6">For restaurant chains</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">₹12,999</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited tables</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Multi-location support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Custom integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">API access</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">24/7 phone support</span>
                </li>
              </ul>
              <Link to="/auth" className="block">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Why Restaurant Owners Choose Us</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Lightning Fast</h3>
            <p className="text-gray-600">Process orders in under 30 seconds</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">GST Compliant</h3>
            <p className="text-gray-600">Auto-generate GST invoices</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Expert Support</h3>
            <p className="text-gray-600">24/7 customer assistance</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Cloud Based</h3>
            <p className="text-gray-600">Access from anywhere</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
            Join 5000+ restaurants already using KHAO PEEO to streamline operations, increase revenue, and delight customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8">
                Start 14-Day Free Trial
              </Button>
            </Link>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8">
              Schedule Demo
            </Button>
          </div>
          <p className="text-orange-100 mt-6 text-sm">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <UtensilsCrossed className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">KHAO PEEO</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Complete restaurant management solution trusted by thousands of restaurants across India.
              </p>
              <div className="flex gap-4">
                <a href="#" className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="hover:text-orange-500 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-orange-500 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Updates</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#about" className="hover:text-orange-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Press Kit</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Partners</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">123 Restaurant Street, Mumbai, Maharashtra 400001</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  <a href="tel:+919876543210" className="text-sm hover:text-orange-500">+91 98765 43210</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  <a href="mailto:support@khaopeeo.com" className="text-sm hover:text-orange-500">support@khaopeeo.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 KHAO PEEO. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-orange-500 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;