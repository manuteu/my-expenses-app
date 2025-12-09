import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { formatDateToMonthYear } from "@/shared/lib/date";

export interface ExpenseAnalyticsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  isLoading?: boolean;
  className?: string;
}

export default function ExpenseAnalyticsCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary",
  isLoading = false,
  className,
}: ExpenseAnalyticsCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {title}
            </p>
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-24 mt-2" />
                <Skeleton className="h-4 w-32 mt-2" />
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-foreground">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Em {formatDateToMonthYear(new Date())}
                </p>
              </>
            )}
          </div>
          {Icon && (
            <div className={cn(" rounded-lg bg-muted/50", iconColor)}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

