import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";

const ProfileEdit = () => {
  const navigate = useNavigate();

  const handleSave = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-4">
        <div className="flex items-center space-x-3">
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

      <div className="p-4">
        <ProfileEditForm onSave={handleSave} />
      </div>
    </div>
  );
};

export default ProfileEdit;