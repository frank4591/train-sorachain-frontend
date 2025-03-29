
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { BlurredCard } from "@/components/ui/blurred-card";
import { ChevronRight, Github, BrainCircuit, Cpu, Server, Database, Sparkles } from "lucide-react";
import MarqueeBanner from "@/components/MarqueeBanner";

export default function Index() {
  const { isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  return <div className="min-h-screen">
      <MarqueeBanner 
        text="Try our newest product of our ecosystem, Generate Ghibli art" 
        buttonText="Generate Art" 
        buttonLink="/ghibli-art" 
      />
      
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40" style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, hsl(var(--primary)/0.3), transparent 70%)`
      }} />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Decentralized AI Training Platform
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Train AI models with <br className="hidden md:block" />
            <span className="text-gradient">SoraChain AI</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">A privacy preserving Machine Learning Engine for training AI models built on Collaborative Model Update(CMU) framework  </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" className="rounded-full">
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/ghibli-art">
              <Button variant="outline" size="lg" className="rounded-full">
                <Sparkles className="mr-1 h-4 w-4 text-blue-400" />
                Generate Ghibli Art
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Train AI models with our decentralized platform. Stake credits, perform tasks, and earn rewards.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BlurredCard className="h-full p-6">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-6">
                <BrainCircuit className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-3">Register & Choose Role</h3>
              <p className="text-muted-foreground">
                Sign up and select your role in the ecosystem: Client, Delegator, Validator, or Aggregator.
              </p>
            </BlurredCard>
            
            <BlurredCard className="h-full p-6">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-6">
                <Server className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-3">Stake Credits</h3>
              <p className="text-muted-foreground">
                Stake your credits on training tasks that match your role and contribute to the network.
              </p>
            </BlurredCard>
            
            <BlurredCard className="h-full p-6">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-6">
                <Cpu className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-3">Train & Earn</h3>
              <p className="text-muted-foreground">
                Participate in training using your authentication key and earn credits upon completion.
              </p>
            </BlurredCard>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Training?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our decentralized AI training platform and start contributing to state-of-the-art models.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg">
                {isAuthenticated ? "Go to Dashboard" : "Register Now"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/ghibli-art">
              <Button variant="outline" size="lg">
                <Sparkles className="mr-1 h-4 w-4 text-blue-400" />
                Try Ghibli Art Generator
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-xl font-bold">SoraChain</span>
              <p className="text-sm text-muted-foreground mt-1">
                Decentralized AI training platform
              </p>
            </div>
            
            <div className="flex space-x-8">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SoraChain. All rights reserved.
          </div>
        </div>
      </footer>
    </div>;
}
