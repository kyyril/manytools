"use client";

import { motion } from 'framer-motion';
import { CheckCircle, Zap, Lock, Globe, Clock, Trophy } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Token System',
    description: 'Start with free tokens and earn more by watching ads or subscribing.'
  },
  {
    icon: CheckCircle,
    title: 'High-Quality Results',
    description: 'State-of-the-art AI models ensure accurate and reliable outputs.'
  },
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Automate repetitive writing tasks and focus on what matters most.'
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Your data is securely processed and never stored without permission.'
  },
  {
    icon: Globe,
    title: 'Multilingual Support',
    description: 'Full support for both English and Indonesian languages.'
  },
  {
    icon: Trophy,
    title: 'Free to Start',
    description: 'Begin with free tokens and only pay for what you need.'
  }
];

const FeaturesSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose ManyTools</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform provides the most comprehensive set of AI writing tools with a fair token system.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"
            >
              <div className="flex flex-col items-start">
                <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3 mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;