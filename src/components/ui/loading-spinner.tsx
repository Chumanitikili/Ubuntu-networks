import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner = ({ fullScreen = false, size = "md" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn(
      "flex items-center justify-center",
      fullScreen && "fixed inset-0 bg-background/80 backdrop-blur-sm"
    )}>
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-primary",
          "border-t-transparent",
          sizeClasses[size]
        )}
      />
    </div>
  );
};
