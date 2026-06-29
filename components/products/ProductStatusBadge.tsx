import { Badge } from "@/components/badge";

interface ProductStatusBadgeProps {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}

export function ProductStatusBadge({
  active,
  activeLabel,
  inactiveLabel,
}: ProductStatusBadgeProps) {
  return (
    <Badge variant={active ? "active" : "inactive"}>
      {active ? activeLabel : inactiveLabel}
    </Badge>
  );
}
