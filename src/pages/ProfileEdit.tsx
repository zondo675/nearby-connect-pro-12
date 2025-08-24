import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Image as ImageIcon } from "lucide-react";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Prefill from localStorage if available, else use sensible defaults
  const stored = (() => {
    try {
      const s = localStorage.getItem("servicehub_user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  })();

  const [name, setName] = useState(stored?.name ?? "John Doe");
  const [email, setEmail] = useState(stored?.email ?? "john@example.com");
  const [phone, setPhone] = useState(stored?.phone ?? "+1 (555) 123-4567");
  const [location, setLocation] = useState(stored?.location ?? "New York, NY");
  const [avatar, setAvatar] = useState(
    stored?.avatar ??
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  );

  useEffect(() => {
    document.title = "Edit Profile | ServiceHub";

    const desc = "Edit your ServiceHub profile details including name, email, phone, and location.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
  }, []);

  const handleCancel = () => navigate(-1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { name, email, phone, location, avatar };
    try {
      localStorage.setItem("servicehub_user", JSON.stringify(updated));
    } catch {}
    toast({ title: "Profile updated", description: "Your changes have been saved." });
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-gradient-primary text-white p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Edit Profile</h1>
        </div>
      </header>

      <main className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" /> Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" /> Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" /> Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 000 1111"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" /> Location
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="avatar" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" /> Avatar URL
                </Label>
                <Input
                  id="avatar"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                />
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={avatar}
                    alt="User avatar preview for ServiceHub profile"
                    className="w-16 h-16 rounded-full object-cover border"
                    loading="lazy"
                  />
                  <p className="text-sm text-muted-foreground">Preview</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfileEdit;
