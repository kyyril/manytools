"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How does the token system work?",
      answer: "You start with 3 tokens after signing up. Each tool usage costs 1 token. You can earn 5 additional tokens by watching a rewarded ad. Guest users can try the tools twice without signing up."
    },
    {
      question: "Are the AI tools accurate?",
      answer: "Our AI tools utilize state-of-the-art language models to provide high-quality results. However, we recommend reviewing the output as AI technology is not perfect and may occasionally produce errors."
    },
    {
      question: "Do you store my text data?",
      answer: "We do not permanently store your text data. Your content is processed temporarily to generate results and then deleted from our systems. We prioritize your privacy and data security."
    },
    {
      question: "Can I use these tools for commercial purposes?",
      answer: "Yes, you can use the output from our tools for both personal and commercial purposes. However, we recommend verifying the generated content before professional use."
    },
    {
      question: "Which languages are supported?",
      answer: "Currently, we support English and Indonesian languages across all our tools. We plan to add more languages in the future based on user demand."
    },
    {
      question: "How can I provide feedback or report issues?",
      answer: "We value your feedback! You can contact us through the contact form on our website or email us directly at support@manytools.com with any suggestions or issues."
    }
  ];

  return (
    <section className="py-16 container max-w-4xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">
          Find answers to common questions about our AI tools and services.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQSection;