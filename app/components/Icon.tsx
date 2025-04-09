import React from "react";
import { CircleAlert, icons } from "lucide-react";
type IconName = keyof typeof icons;

const iconsWithTailwindColors: { name: IconName; color: string }[] = [
  { name: "Wine", color: "text-red-800" },
  { name: "Beer", color: "text-yellow-400" },
  { name: "Coffee", color: "text-amber-900" },
  { name: "Dumbbell", color: "text-gray-600" },
  { name: "Pizza", color: "text-orange-400" },
  { name: "Music", color: "text-purple-700" },
  { name: "BookOpen", color: "text-blue-600" },
  { name: "Activity", color: "text-rose-500" },
  { name: "Palette", color: "text-pink-500" },
  { name: "Camera", color: "text-indigo-500" },
  { name: "Heart", color: "text-red-500" },
  { name: "Globe", color: "text-teal-600" },
  { name: "ShoppingCart", color: "text-yellow-500" },
  { name: "Phone", color: "text-sky-600" },
  { name: "Laptop", color: "text-gray-500" },
  { name: "Tv", color: "text-gray-800" },
  { name: "Award", color: "text-yellow-300" },
  { name: "Gamepad", color: "text-purple-600" },
  { name: "Bookmark", color: "text-yellow-600" },
  { name: "Bell", color: "text-yellow-400" },
  { name: "Cloud", color: "text-blue-300" },
  { name: "Sun", color: "text-yellow-300" },
  { name: "Moon", color: "text-gray-900" },
  { name: "MapPin", color: "text-orange-500" },
  { name: "User", color: "text-blue-500" },
  { name: "HeartHandshake", color: "text-rose-400" },
  { name: "Briefcase", color: "text-gray-900" },
  { name: "Calendar", color: "text-green-500" },
  { name: "Clock", color: "text-orange-400" },
  { name: "ShoppingBag", color: "text-cyan-500" },
  { name: "CameraOff", color: "text-gray-400" },
  { name: "Clipboard", color: "text-gray-300" },
  { name: "FileText", color: "text-blue-400" },
  { name: "Mail", color: "text-red-400" },
  { name: "MessageSquare", color: "text-gray-500" },
  { name: "Search", color: "text-indigo-600" },
  { name: "Speaker", color: "text-gray-800" },
  { name: "Smartphone", color: "text-blue-700" },
  { name: "Airplay", color: "text-emerald-500" },
  { name: "CloudRain", color: "text-blue-300" },
  { name: "Code", color: "text-emerald-600" },
  { name: "File", color: "text-blue-300" },
  { name: "Printer", color: "text-gray-600" },
  { name: "Trash2", color: "text-red-600" },
  { name: "Star", color: "text-yellow-400" },
  { name: "Car", color: "text-red-700" },
  { name: "Settings", color: "text-gray-700" },
  { name: "Umbrella", color: "text-purple-500" },
  { name: "Wind", color: "text-sky-500" },
  { name: "Mountain", color: "text-gray-500" },
  { name: "House", color: "text-primary" },
];

interface IconBoxProps {
  iconName: IconName;
  className?: string;
}

export function Icon({ iconName, className }: IconBoxProps) {
  const icon = iconsWithTailwindColors.find((i) => i.name === iconName);
  const LucideIcon = icons[iconName];

  if (!icon || !LucideIcon) return <CircleAlert className="text-red-500" />;

  return <LucideIcon className={`${icon.color} ${className ?? ""}`} />;
}
