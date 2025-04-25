import { Card, CardContent } from '@/components/ui/card';
import { Code2, Rocket, Database } from 'lucide-react';
import PageLayout from '../components/PageLayout';

export default function AboutPage() {
  return (
    <PageLayout
      heading="About BRAT Generator"
      subheading="Creating the future of digital expression"
    >
      <div className="mx-auto max-w-3xl">
        <Card className="border-primary/20">
          <CardContent className="prose prose-lg dark:prose-invert mt-6">
            <div className="mb-8 text-center">
              <p className="leading-relaxed">
                BRAT Generator is an innovative online tool dedicated to providing users with a simple yet powerful creative experience.
                Our goal is to make it easy for everyone to create unique BRAT content.
              </p>
            </div>
            
            <div className="relative mb-12">
              <div className="absolute -left-4 top-0 h-12 w-1 bg-primary"></div>
              <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
              <p className="leading-relaxed">
                We strive to make creation simpler and more enjoyable through technological innovation.
                BRAT Generator is not just a tool, but a creative community where users can share inspiration,
                learn from each other, and engage in meaningful interactions.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 h-12 w-1 bg-primary"></div>
              <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
              <p className="mb-6">
                BRAT Generator is built with cutting-edge web technologies:
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-secondary/50">
                  <Code2 className="h-5 w-5 text-primary" />
                  <span>Next.js 13+ Framework</span>
                </div>
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-secondary/50">
                  <Rocket className="h-5 w-5 text-primary" />
                  <span>React Server Components</span>
                </div>
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-secondary/50">
                  <Database className="h-5 w-5 text-primary" />
                  <span>InstantDB Real-time DB</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
} 