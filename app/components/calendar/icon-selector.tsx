import React from "react";
import * as Icons from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define the type for the component props
interface IconSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
}

const icons = [
  "Wine",
  "Beer",
  "Coffee",
  "Dumbbell",
  "Pizza",
  "Music",
  "BookOpen",
  "TvMinimalPlay",
  "Activity",
  "Palette",
  "Camera",
  "Heart",
  "Globe",
  "ShoppingCart",
  "Phone",
  "Laptop",
  "Tv",
  "Award",
  "Gamepad",
  "Bookmark",
  "Bell",
  "Cloud",
  "Sun",
  "Moon",
  "MapPin",
  "User",
  "HeartHandshake",
  "Briefcase",
  "Calendar",
  "Clock",
  "ShoppingBag",
  "CameraOff",
  "Clipboard",
  "FileText",
  "Mail",
  "MessageSquare",
  "Search",
  "Speaker",
  "Smartphone",
  "Airplay",
  "CloudRain",
  "Code",
  "File",
  "Printer",
  "Trash2",
  "Star",
  "TentTree",
  "Car",
  "Home",
  "Settings",
  "Umbrella",
  "TreePine",
  "Wind",
  "Mountain",
];

export function IconSelector({
  value,
  onChange,
  onBlur,
  name,
}: IconSelectorProps) {
  // Helper function to render the icon based on name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Wine":
        return <Icons.Wine className="size-4" />;
      case "Beer":
        return <Icons.Beer className="size-4" />;
      case "Coffee":
        return <Icons.Coffee className="size-4" />;
      case "Dumbbell":
        return <Icons.Dumbbell className="size-4" />;
      case "Pizza":
        return <Icons.Pizza className="size-4" />;
      case "Music":
        return <Icons.Music className="size-4" />;
      case "BookOpen":
        return <Icons.BookOpen className="size-4" />;
      case "TvMinimalPlay":
        return <Icons.TvMinimalPlay className="size-4" />;
      case "Activity":
        return <Icons.Activity className="size-4" />;
      case "Palette":
        return <Icons.Palette className="size-4" />;
      case "Camera":
        return <Icons.Camera className="size-4" />;
      case "Heart":
        return <Icons.Heart className="size-4" />;
      case "Globe":
        return <Icons.Globe className="size-4" />;
      case "ShoppingCart":
        return <Icons.ShoppingCart className="size-4" />;
      case "Phone":
        return <Icons.Phone className="size-4" />;
      case "Laptop":
        return <Icons.Laptop className="size-4" />;
      case "Tv":
        return <Icons.Tv className="size-4" />;
      case "Award":
        return <Icons.Award className="size-4" />;
      case "Gamepad":
        return <Icons.Gamepad className="size-4" />;
      case "Bookmark":
        return <Icons.Bookmark className="size-4" />;
      case "Bell":
        return <Icons.Bell className="size-4" />;
      case "Cloud":
        return <Icons.Cloud className="size-4" />;
      case "Sun":
        return <Icons.Sun className="size-4" />;
      case "Moon":
        return <Icons.Moon className="size-4" />;
      case "MapPin":
        return <Icons.MapPin className="size-4" />;
      case "User":
        return <Icons.User className="size-4" />;
      case "HeartHandshake":
        return <Icons.HeartHandshake className="size-4" />;
      case "Briefcase":
        return <Icons.Briefcase className="size-4" />;
      case "Calendar":
        return <Icons.Calendar className="size-4" />;
      case "Clock":
        return <Icons.Clock className="size-4" />;
      case "ShoppingBag":
        return <Icons.ShoppingBag className="size-4" />;
      case "CameraOff":
        return <Icons.CameraOff className="size-4" />;
      case "Clipboard":
        return <Icons.Clipboard className="size-4" />;
      case "FileText":
        return <Icons.FileText className="size-4" />;
      case "Mail":
        return <Icons.Mail className="size-4" />;
      case "MessageSquare":
        return <Icons.MessageSquare className="size-4" />;
      case "Search":
        return <Icons.Search className="size-4" />;
      case "Speaker":
        return <Icons.Speaker className="size-4" />;
      case "Smartphone":
        return <Icons.Smartphone className="size-4" />;
      case "Airplay":
        return <Icons.Airplay className="size-4" />;
      case "CloudRain":
        return <Icons.CloudRain className="size-4" />;
      case "Code":
        return <Icons.Code className="size-4" />;
      case "File":
        return <Icons.File className="size-4" />;
      case "Printer":
        return <Icons.Printer className="size-4" />;
      case "Trash2":
        return <Icons.Trash2 className="size-4" />;
      case "Star":
        return <Icons.Star className="size-4" />;
      case "TentTree":
        return <Icons.TentTree className="size-4" />;
      case "Car":
        return <Icons.Car className="size-4" />;
      case "Home":
        return <Icons.Home className="size-4" />;
      case "Settings":
        return <Icons.Settings className="size-4" />;
      case "Umbrella":
        return <Icons.Umbrella className="size-4" />;
      case "TreePine":
        return <Icons.TreePine className="size-4" />;
      case "Wind":
        return <Icons.Wind className="size-4" />;
      case "Mountain":
        return <Icons.Mountain className="size-4" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger className="w-full border p-3 rounded-lg">
          <div className="flex items-center gap-2">
            {value ? (
              <div className="text-primary">{renderIcon(value)}</div>
            ) : (
              <span className="text-sm text-slate-500">Select an icon</span>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent>
          <div className="gap-2 flex flex-wrap">
            {icons.map((item) => {
              const isSelected = item === value;

              return (
                <div
                  key={item}
                  className={`p-2 shadow rounded border text-primary hover:bg-primary-foreground ${
                    isSelected ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => {
                    onChange(item);
                  }}
                  onBlur={onBlur}
                >
                  {renderIcon(item)}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
