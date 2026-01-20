import { ReactNode } from "react";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  showDivider?: boolean;
  children?: ReactNode;
}

export function SectionHeader({
  badge,
  title,
  description,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
  showDivider = true,
  children,
}: SectionHeaderProps) {
  return (
    <div className={`text-center mb-12 md:mb-16 lg:mb-20 ${className}`}>
      {badge && (
        <div className="inline-block mb-4">
          <span className="text-sm md:text-base font-semibold text-primary uppercase tracking-wider">
            {badge}
          </span>
        </div>
      )}
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight ${titleClassName}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 ${descriptionClassName}`}
        >
          {description}
        </p>
      )}
      {showDivider && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="w-16 h-1 bg-linear-to-r from-transparent to-primary rounded-full"></div>
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <div className="w-16 h-1 bg-linear-to-l from-transparent to-primary rounded-full"></div>
        </div>
      )}
      {children}
    </div>
  );
}

