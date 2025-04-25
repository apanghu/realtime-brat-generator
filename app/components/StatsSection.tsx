'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { UsersIcon, HeartIcon, SparklesIcon } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      title: 'Active Users',
      value: '1,000+',
      icon: UsersIcon,
      description: 'Creative minds using BRAT Generator',
    },
    {
      title: 'BRATs Created',
      value: '5,000+',
      icon: SparklesIcon,
      description: 'Unique BRATs generated and shared',
    },
    {
      title: 'Total Likes',
      value: '10,000+',
      icon: HeartIcon,
      description: 'Appreciation from the community',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary/90 via-primary to-primary/90 
          bg-clip-text text-transparent animate-gradient text-center mb-8">
        Platform Statistics
      </h2>

      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="p-6 text-center transition-all duration-200 hover:shadow-lg hover:border-primary/50 backdrop-blur-sm bg-background/80">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold gradient-text mb-2">{stat.value}</h3>
                <p className="text-lg font-semibold mb-2">{stat.title}</p>
                <p className="text-muted-foreground text-sm">{stat.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 