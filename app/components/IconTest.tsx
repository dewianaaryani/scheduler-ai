import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react"; // Import all icons for type checking

interface DynamicIconProps {
  icon: keyof typeof LucideIcons; // Ensures the icon name is a valid Lucide icon
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow passing other props
}

const DynamicLucideIcon: React.FC<DynamicIconProps> = ({ icon, ...rest }) => {
  const [IconComponent, setIconComponent] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const importIcon = async () => {
      try {
        const importedIcon = LucideIcons[icon];
        if (importedIcon && typeof importedIcon === 'function') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setIconComponent(() => importedIcon as React.ComponentType<any>);
          setError(null);
        } else {
          setError(new Error(`Icon "${icon}" not found in lucide-react.`));
          setIconComponent(null);
        }
      } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = err as any;
        setError(error);
        setIconComponent(null);
      }
    };

    importIcon();
  }, [icon]);

  if (error) {
    console.error("Error rendering icon:", error);
    return <div>Error loading icon: {icon}</div>; // Or a default error icon
  }

  return IconComponent ? <IconComponent {...rest} /> : null;
};

export default DynamicLucideIcon;
