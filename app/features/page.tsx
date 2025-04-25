import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Palette, Users, Save } from 'lucide-react';
import PageLayout from '../components/PageLayout';

export default function FeaturesPage() {
  const features = [
    {
      title: 'Real-time Generation',
      description: 'Create personalized BRAT content instantly using cutting-edge technology',
      icon: Sparkles,
    },
    {
      title: 'Rich Presets',
      description: 'Choose from a variety of color presets to make your BRATs more vibrant',
      icon: Palette,
    },
    {
      title: 'Community Interaction',
      description: 'Share your creations and vote on other users\' works',
      icon: Users,
    },
    {
      title: 'Save Your Work',
      description: 'Save your creations for easy editing and sharing later',
      icon: Save,
    },
  ];

  return (
    <PageLayout
      heading="Features"
      subheading="Discover what makes BRAT Generator special"
    >
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group relative overflow-hidden border-primary/20 transition-all hover:border-primary/50">
                <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 transform rounded-full bg-primary/10 blur-2xl filter group-hover:bg-primary/20" />
                <CardHeader>
                  <div className="mb-2 flex items-center space-x-2">
                    <Icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
} 