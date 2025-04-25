import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import PageLayout from '../components/PageLayout';

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is BRAT Generator?',
      answer:
        'BRAT Generator is an innovative online tool that allows users to create and share unique BRAT content. It offers rich presets and real-time preview functionality.',
    },
    {
      question: 'How do I save my creations?',
      answer:
        'Simply log in to your account and click the save button to store your creation. All saved works can be found in the "My Creations" tab.',
    },
    {
      question: 'Can I edit my saved works?',
      answer:
        'Yes, you can edit your saved works at any time. Find the work you want to edit in "My Creations" and click the edit button to make changes.',
    },
    {
      question: 'How can I share my creations?',
      answer:
        'Each creation has a unique share link. You can copy the link and share it with others, allowing them to view your creation and even create new versions based on your work.',
    },
    {
      question: 'Why do I need to log in?',
      answer:
        'Logging in allows you to save your works, participate in community voting, track your creation history, and access more personalized features. We use a secure email verification code for login.',
    },
  ];

  return (
    <PageLayout
      heading="Frequently Asked Questions"
      subheading="Find answers to common questions about BRAT Generator"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex justify-center">
          <HelpCircle className="h-12 w-12 text-primary animate-glow" />
        </div>
        <Card className="border-primary/20">
          <CardContent className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-b border-primary/20 last:border-0"
                >
                  <AccordionTrigger className="hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
} 