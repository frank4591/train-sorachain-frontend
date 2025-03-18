
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { BlurredCard } from "@/components/ui/blurred-card";
import { ChevronRight, Github, BrainCircuit, Cpu, Server, Database, Network, Shield } from "lucide-react";

export default function Index() {
  const { isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  };
  
  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 10 }
    }
  };
  
  const parallaxY = scrollY * 0.4;
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden"
      >
        <div 
          className="absolute inset-0 -z-10 opacity-40"
          style={{ 
            backgroundImage: `radial-gradient(circle at 50% 50%, hsl(var(--primary)/0.3), transparent 70%)`,
            transform: `translateY(${parallaxY * 0.3}px)` 
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-3"
          >
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Decentralized AI Training Platform
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Train AI models with <br className="hidden md:block" />
            <span className="text-gradient">Sora Chain</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            A decentralized platform for training AI models using GitHub repositories.
            Stake credits, participate in training tasks, and earn rewards.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" className="rounded-full">
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="rounded-full">
                <Github className="mr-1 h-4 w-4" />
                View on GitHub
              </Button>
            </a>
          </motion.div>
        </motion.div>
        
        {/* Animated Blockchain AI Network Diagram */}
        <motion.div
          className="mt-16 relative"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="relative h-[400px] w-[600px] max-w-full">
            {/* Base Blockchain Layer */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-16 bg-primary/10 backdrop-blur-sm rounded-lg flex items-center justify-center z-10"
              variants={itemVariants}
            >
              <Database className="h-6 w-6 text-primary mr-2" />
              <span className="font-semibold text-primary">Blockchain Layer</span>
            </motion.div>
            
            {/* AI Layer */}
            <motion.div 
              className="absolute bottom-32 left-0 right-0 h-16 bg-blue-500/10 backdrop-blur-sm rounded-lg flex items-center justify-center z-10"
              variants={itemVariants}
            >
              <BrainCircuit className="h-6 w-6 text-blue-500 mr-2" />
              <span className="font-semibold text-blue-500">AI Layer</span>
            </motion.div>
            
            {/* Connection Line from Blockchain to AI Layer */}
            <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 600 400">
              <motion.line 
                x1="300" y1="384" x2="300" y2="288" 
                stroke="hsl(var(--primary))" 
                strokeWidth="2" 
                strokeDasharray="5,5"
                variants={lineVariants}
              />
            </svg>
            
            {/* Nodes */}
            <motion.div 
              className="absolute left-[25%] top-[35%] h-16 w-16 flex items-center justify-center"
              variants={nodeVariants}
              transition={{ delay: 1 }}
            >
              <div className="absolute inset-0 rounded-full bg-green-100 animate-pulse"></div>
              <Server className="h-8 w-8 text-green-600 z-10 relative" />
              <span className="absolute -bottom-8 text-xs font-medium whitespace-nowrap">Trainer Node</span>
            </motion.div>
            
            <motion.div 
              className="absolute left-[50%] top-[30%] h-16 w-16 flex items-center justify-center"
              variants={nodeVariants}
              transition={{ delay: 1.2 }}
            >
              <div className="absolute inset-0 rounded-full bg-purple-100 animate-pulse"></div>
              <Cpu className="h-8 w-8 text-purple-600 z-10 relative" />
              <span className="absolute -bottom-8 text-xs font-medium whitespace-nowrap">Aggregator Node</span>
            </motion.div>
            
            <motion.div 
              className="absolute left-[75%] top-[35%] h-16 w-16 flex items-center justify-center"
              variants={nodeVariants}
              transition={{ delay: 1.4 }}
            >
              <div className="absolute inset-0 rounded-full bg-amber-100 animate-pulse"></div>
              <Shield className="h-8 w-8 text-amber-600 z-10 relative" />
              <span className="absolute -bottom-8 text-xs font-medium whitespace-nowrap">Validator Node</span>
            </motion.div>
            
            {/* Connection Lines between nodes */}
            <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 600 400">
              <motion.line 
                x1="150" y1="180" x2="300" y2="150" 
                stroke="#9333ea" 
                strokeWidth="2" 
                strokeDasharray="5,5"
                variants={lineVariants}
                transition={{ delay: 1.6 }}
              />
              <motion.line 
                x1="300" y1="150" x2="450" y2="180" 
                stroke="#9333ea" 
                strokeWidth="2" 
                strokeDasharray="5,5"
                variants={lineVariants}
                transition={{ delay: 1.8 }}
              />
              <motion.line 
                x1="150" y1="180" x2="450" y2="180" 
                stroke="#9333ea" 
                strokeWidth="2" 
                strokeDasharray="5,5"
                variants={lineVariants}
                transition={{ delay: 2 }}
              />
            </svg>
            
            {/* Animated Data Flow */}
            <motion.div
              className="absolute left-[20%] top-[40%] h-3 w-3 rounded-full bg-primary"
              animate={{
                x: [0, 140, 280],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                delay: 3
              }}
            />
            
            <motion.div
              className="absolute left-[50%] top-[35%] h-3 w-3 rounded-full bg-blue-500"
              animate={{
                x: [0, 120],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                delay: 3.5
              }}
            />
            
            <motion.div
              className="absolute left-[70%] top-[40%] h-3 w-3 rounded-full bg-amber-500"
              animate={{
                x: [-120, 0],
                opacity: [0, 1, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                delay: 4
              }}
            />
          </div>
        </motion.div>
        
        <motion.div
          className="absolute bottom-10 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronRight className="h-6 w-6 rotate-90" />
          </motion.div>
        </motion.div>
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
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants}>
              <BlurredCard className="h-full p-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-6">
                  <BrainCircuit className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Register & Choose Role</h3>
                <p className="text-muted-foreground">
                  Sign up and select your role in the ecosystem: Client, Delegator, Validator, or Aggregator.
                </p>
              </BlurredCard>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <BlurredCard className="h-full p-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-6">
                  <Server className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Stake Credits</h3>
                <p className="text-muted-foreground">
                  Stake your credits on training tasks that match your role and contribute to the network.
                </p>
              </BlurredCard>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <BlurredCard className="h-full p-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-6">
                  <Cpu className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Train & Earn</h3>
                <p className="text-muted-foreground">
                  Participate in training using your authentication key and earn credits upon completion.
                </p>
              </BlurredCard>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Training?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our decentralized AI training platform and start contributing to state-of-the-art models.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/register"}>
            <Button size="lg">
              {isAuthenticated ? "Go to Dashboard" : "Register Now"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
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
    </div>
  );
}
