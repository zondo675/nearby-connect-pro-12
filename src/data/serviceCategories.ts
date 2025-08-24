// Enhanced Service Categories with Subcategories
import { 
  Wrench, 
  GraduationCap, 
  Car, 
  Sparkles, 
  Hammer, 
  Scissors, 
  Camera, 
  Utensils,
  Heart,
  PaintBucket,
  Zap,
  Stethoscope,
  Baby,
  Laptop,
  Music,
  Users,
  Truck,
  Shield,
  TreePine,
  Calculator,
  FileText,
  Globe,
  Settings,
  Smartphone
} from "lucide-react";

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  averagePrice: string;
  icon: any;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  subcategories: SubCategory[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "home-services",
    name: "Home Services",
    description: "Professional home maintenance and repair",
    icon: Wrench,
    color: "bg-blue-100 text-blue-700",
    gradient: "bg-gradient-to-br from-blue-50 to-blue-100",
    subcategories: [
      {
        id: "plumbing",
        name: "Plumbing",
        description: "Pipe repairs, leak fixes, installations",
        averagePrice: "$45-65/hr",
        icon: Wrench
      },
      {
        id: "electrical",
        name: "Electrical",
        description: "Wiring, outlets, lighting installations",
        averagePrice: "$50-75/hr",
        icon: Zap
      },
      {
        id: "handyman",
        name: "Handyman",
        description: "General repairs and maintenance",
        averagePrice: "$35-55/hr",
        icon: Hammer
      },
      {
        id: "painting",
        name: "Painting",
        description: "Interior and exterior painting",
        averagePrice: "$30-50/hr",
        icon: PaintBucket
      },
      {
        id: "cleaning",
        name: "House Cleaning",
        description: "Deep cleaning, regular maintenance",
        averagePrice: "$25-40/hr",
        icon: Sparkles
      }
    ]
  },
  {
    id: "education-tutoring",
    name: "Education & Tutoring",
    description: "Academic support and skill development",
    icon: GraduationCap,
    color: "bg-purple-100 text-purple-700",
    gradient: "bg-gradient-to-br from-purple-50 to-purple-100",
    subcategories: [
      {
        id: "academic-tutoring",
        name: "Academic Tutoring",
        description: "Math, Science, English, History",
        averagePrice: "$25-60/hr",
        icon: GraduationCap
      },
      {
        id: "test-prep",
        name: "Test Preparation",
        description: "SAT, ACT, GRE, GMAT prep",
        averagePrice: "$40-80/hr",
        icon: FileText
      },
      {
        id: "language-learning",
        name: "Language Learning",
        description: "Foreign language instruction",
        averagePrice: "$30-50/hr",
        icon: Globe
      },
      {
        id: "music-lessons",
        name: "Music Lessons",
        description: "Piano, guitar, violin, vocals",
        averagePrice: "$35-70/hr",
        icon: Music
      },
      {
        id: "computer-skills",
        name: "Computer Skills",
        description: "Basic computer, MS Office, coding",
        averagePrice: "$30-65/hr",
        icon: Laptop
      }
    ]
  },
  {
    id: "health-wellness",
    name: "Health & Wellness",
    description: "Personal health and fitness services",
    icon: Heart,
    color: "bg-green-100 text-green-700",
    gradient: "bg-gradient-to-br from-green-50 to-green-100",
    subcategories: [
      {
        id: "personal-training",
        name: "Personal Training",
        description: "Fitness coaching and workout plans",
        averagePrice: "$40-80/hr",
        icon: Heart
      },
      {
        id: "nutrition-coaching",
        name: "Nutrition Coaching",
        description: "Diet planning and nutrition advice",
        averagePrice: "$35-65/hr",
        icon: Calculator
      },
      {
        id: "massage-therapy",
        name: "Massage Therapy",
        description: "Therapeutic and relaxation massage",
        averagePrice: "$60-120/hr",
        icon: Stethoscope
      },
      {
        id: "childcare",
        name: "Childcare",
        description: "Babysitting and nanny services",
        averagePrice: "$15-25/hr",
        icon: Baby
      }
    ]
  },
  {
    id: "beauty-personal-care",
    name: "Beauty & Personal Care",
    description: "Professional beauty and grooming services",
    icon: Scissors,
    color: "bg-pink-100 text-pink-700",
    gradient: "bg-gradient-to-br from-pink-50 to-pink-100",
    subcategories: [
      {
        id: "hair-styling",
        name: "Hair Styling",
        description: "Cuts, colors, styling, treatments",
        averagePrice: "$35-85/service",
        icon: Scissors
      },
      {
        id: "makeup-artist",
        name: "Makeup Artist",
        description: "Special events, bridal, photography",
        averagePrice: "$75-200/service",
        icon: PaintBucket
      },
      {
        id: "nail-services",
        name: "Nail Services",
        description: "Manicure, pedicure, nail art",
        averagePrice: "$25-60/service",
        icon: Sparkles
      }
    ]
  },
  {
    id: "transportation",
    name: "Transportation",
    description: "Ride and delivery services",
    icon: Car,
    color: "bg-orange-100 text-orange-700",
    gradient: "bg-gradient-to-br from-orange-50 to-orange-100",
    subcategories: [
      {
        id: "ride-sharing",
        name: "Ride Sharing",
        description: "Personal transportation services",
        averagePrice: "$12-25/trip",
        icon: Car
      },
      {
        id: "delivery-services",
        name: "Delivery Services",
        description: "Food, grocery, package delivery",
        averagePrice: "$8-20/delivery",
        icon: Truck
      },
      {
        id: "moving-services",
        name: "Moving Services",
        description: "Local and long-distance moving",
        averagePrice: "$80-150/hr",
        icon: Truck
      }
    ]
  },
  {
    id: "events-photography",
    name: "Events & Photography",
    description: "Professional event and media services",
    icon: Camera,
    color: "bg-indigo-100 text-indigo-700",
    gradient: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    subcategories: [
      {
        id: "photography",
        name: "Photography",
        description: "Portrait, event, product photography",
        averagePrice: "$100-300/session",
        icon: Camera
      },
      {
        id: "event-planning",
        name: "Event Planning",
        description: "Wedding, party, corporate events",
        averagePrice: "$50-150/hr",
        icon: Users
      },
      {
        id: "catering",
        name: "Catering",
        description: "Food service for events",
        averagePrice: "$15-50/person",
        icon: Utensils
      }
    ]
  },
  {
    id: "technology",
    name: "Technology",
    description: "Tech support and digital services",
    icon: Laptop,
    color: "bg-cyan-100 text-cyan-700",
    gradient: "bg-gradient-to-br from-cyan-50 to-cyan-100",
    subcategories: [
      {
        id: "computer-repair",
        name: "Computer Repair",
        description: "Hardware and software troubleshooting",
        averagePrice: "$50-100/hr",
        icon: Laptop
      },
      {
        id: "phone-repair",
        name: "Phone Repair",
        description: "Screen, battery, component repairs",
        averagePrice: "$40-150/repair",
        icon: Smartphone
      },
      {
        id: "tech-setup",
        name: "Tech Setup",
        description: "Device setup and network installation",
        averagePrice: "$45-80/hr",
        icon: Settings
      }
    ]
  },
  {
    id: "security-safety",
    name: "Security & Safety",
    description: "Protection and safety services",
    icon: Shield,
    color: "bg-slate-100 text-slate-700",
    gradient: "bg-gradient-to-br from-slate-50 to-slate-100",
    subcategories: [
      {
        id: "security-guard",
        name: "Security Guard",
        description: "Personal and property protection",
        averagePrice: "$20-35/hr",
        icon: Shield
      },
      {
        id: "locksmith",
        name: "Locksmith",
        description: "Lock installation and emergency service",
        averagePrice: "$75-200/service",
        icon: Settings
      }
    ]
  },
  {
    id: "outdoor-services",
    name: "Outdoor Services",
    description: "Landscaping and outdoor maintenance",
    icon: TreePine,
    color: "bg-emerald-100 text-emerald-700",
    gradient: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    subcategories: [
      {
        id: "landscaping",
        name: "Landscaping",
        description: "Garden design and maintenance",
        averagePrice: "$35-65/hr",
        icon: TreePine
      },
      {
        id: "lawn-care",
        name: "Lawn Care",
        description: "Mowing, trimming, seasonal cleanup",
        averagePrice: "$30-50/hr",
        icon: Sparkles
      }
    ]
  }
];

export const getAllSubcategories = () => {
  return serviceCategories.flatMap(category => 
    category.subcategories.map(sub => ({
      ...sub,
      categoryId: category.id,
      categoryName: category.name
    }))
  );
};

export const getCategoryById = (id: string) => {
  return serviceCategories.find(category => category.id === id);
};

export const getSubcategoryById = (categoryId: string, subcategoryId: string) => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};