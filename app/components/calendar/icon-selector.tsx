import React from "react";
import * as LucideIcons from "lucide-react";
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
  "Car",
  "House",
  "Settings",
  "Umbrella",
  "Wind",
  "Mountain",
];

export function IconSelector({ value, onChange, onBlur }: IconSelectorProps) {
  // Render icon dynamically
  const renderIcon = (iconName: string) => {
    // Type assertion to any to avoid TypeScript errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const iconModule = LucideIcons as any;

    // Check if the icon exists in the Lucide library
    if (iconModule[iconName]) {
      const IconComponent = iconModule[iconName];
      return <IconComponent className="size-4" />;
    }

    return null;
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

        <PopoverContent className="min-w-lg" side="top" align="start">
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
