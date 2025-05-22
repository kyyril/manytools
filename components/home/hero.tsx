"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Hero = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <section className="py-12 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--background-start-rgb),0.2),transparent)] -z-10" />
      
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Boost Your Productivity with AI-Powered Tools
            </h1>
            <p className="text-xl text-muted-foreground max-w-[42rem] mx-auto">
              Access premium AI writing tools for paraphrasing, summarizing, grammar checking, and more - all in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/tools/paraphrase">
              <Button 
                size="lg" 
                className="group relative overflow-hidden rounded-full px-8 transition-all duration-300"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Try Tools Now <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${hovered ? 'translate-x-1' : ''}`} />
                </span>
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 group-hover:opacity-90"></span>
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-full px-8">
              <Zap className="mr-2 h-4 w-4" /> Get More Tokens
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-primary">6+</h3>
              <p className="text-muted-foreground">AI Tools</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-primary">100%</h3>
              <p className="text-muted-foreground">Free to Start</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-primary">2</h3>
              <p className="text-muted-foreground">Languages</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-primary">24/7</h3>
              <p className="text-muted-foreground">Availability</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;