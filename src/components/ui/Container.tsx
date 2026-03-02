// src/components/ui/Container.tsx
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  isFluid?: boolean;
}

export default function Container({ children, className, isFluid = false }: ContainerProps) {
  return (
    <div 
      className={cn(
        "container-x", 
        isFluid && "max-w-full",
        className
      )}
    >
      {children}
    </div>
  );
}