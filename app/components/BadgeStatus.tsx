import React from "react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, formatStatus } from "@/app/lib/utils";

// Component to display the status badge, with an optional className
interface StatusBadgeComponentProps {
  status: string;
  className?: string; // Optional className prop
}

const BadgeStatus: React.FC<StatusBadgeComponentProps> = ({
  status,
  className = "",
}) => {
  return (
    <Badge className={`${StatusBadge(status)} ${className}`}>
      {formatStatus(status)}
    </Badge>
  );
};

export default BadgeStatus;
