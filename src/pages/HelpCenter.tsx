import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const HelpCenter = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I book a service?",
      answer: "To book a service, browse our categories, select a provider, choose your preferred time slot, and confirm your booking. You'll receive a confirmation message with all the details."
    },
    {
      question: "How do I cancel a booking?",
      answer: "You can cancel a booking up to 24 hours before the scheduled time through your bookings page. Go to 'My Bookings', select the booking you want to cancel, and tap 'Cancel Booking'."
    },
    {
      question: "How do payments work?",
      answer: "Payments are processed securely through our platform. You can add credit/debit cards or use digital wallets. Payment is charged after the service is completed."
    },
    {
      question: "What if I'm not satisfied with a service?",
      answer: "We have a satisfaction guarantee. If you're not happy with a service, contact our support team within 24 hours and we'll work to resolve the issue or provide a refund."
    },
    {
      question: "How do I become a service provider?",
      answer: "To become a provider, enable 'Provider Mode' in your profile, complete the verification process, add your services and pricing, and start accepting bookings from customers."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => navigate("/profile")}
            aria-label="Go back to profile"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Help Center</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            className="pl-10"
          />
        </div>

        {/* Contact Options */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3">
            <Button variant="outline" className="justify-start h-auto p-4">
              <MessageCircle className="mr-3 h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Live Chat</div>
                <div className="text-sm text-muted-foreground">Get instant help</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <Mail className="mr-3 h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Email Support</div>
                <div className="text-sm text-muted-foreground">support@servicehub.com</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <Phone className="mr-3 h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Phone Support</div>
                <div className="text-sm text-muted-foreground">1-800-SERVICE</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Frequently Asked Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Frequently Asked Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Getting Started Guide
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Terms of Service
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Privacy Policy
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Community Guidelines
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;