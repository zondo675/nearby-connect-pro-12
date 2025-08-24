import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Check, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "tr", name: "Turkish", native: "Türkçe" },
  { code: "pl", name: "Polish", native: "Polski" },
];

const LanguageSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.native.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContinue = () => {
    const selectedLang = languages.find(lang => lang.code === selectedLanguage);
    
    // Update user preferences
    const user = JSON.parse(localStorage.getItem("servicehub_user") || "{}");
    user.language = selectedLanguage;
    localStorage.setItem("servicehub_user", JSON.stringify(user));
    
    toast({
      title: "Language saved",
      description: `Set to ${selectedLang?.native}`,
    });
    
    navigate("/location-permission");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-8">
          <h1 className="text-2xl font-bold">Choose Your Language</h1>
          <p className="text-muted-foreground">
            Select your preferred language for the app
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search languages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Language List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredLanguages.map((language) => (
            <Card
              key={language.code}
              className={`cursor-pointer transition-all hover:shadow-soft ${
                selectedLanguage === language.code 
                  ? "ring-2 ring-primary bg-primary/5" 
                  : "hover:bg-muted/50"
              }`}
              onClick={() => setSelectedLanguage(language.code)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex flex-col">
                  <span className="font-medium">{language.native}</span>
                  <span className="text-sm text-muted-foreground">{language.name}</span>
                </div>
                {selectedLanguage === language.code && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="pt-4">
          <Button 
            className="w-full" 
            onClick={handleContinue}
            size="lg"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <div className="w-2 h-2 bg-primary rounded-full" />
          <div className="w-2 h-2 bg-muted rounded-full" />
          <div className="w-2 h-2 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;