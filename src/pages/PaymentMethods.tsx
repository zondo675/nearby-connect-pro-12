import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Plus, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [paymentMethods] = useState([
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "5555",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ]);

  const getCardIcon = (type: string) => {
    return <CreditCard className="h-6 w-6" />;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-4">
        <div className="flex items-center justify-between">
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
            <h1 className="text-xl font-semibold">Payment Methods</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Add New Payment Method */}
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="font-semibold mb-1">Add Payment Method</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add a credit or debit card for easy payments
            </p>
            <Button>Add Card</Button>
          </CardContent>
        </Card>

        {/* Payment Methods List */}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-card rounded-lg flex items-center justify-center">
                    {getCardIcon(method.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold flex items-center space-x-2">
                          <span>{method.type}</span>
                          {method.isDefault && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          •••• •••• •••• {method.last4}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Info */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CreditCard className="h-4 w-4 text-secondary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Secure Payments</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your payment information is encrypted and secure. We never store your card details on our servers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMethods;