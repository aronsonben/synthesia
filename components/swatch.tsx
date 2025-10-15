import { cva, type VariantProps } from "class-variance-authority";
import { useState } from "react";

import { cn } from "@/lib/utils";

const swatchVariants = cva(
  "w-6 h-6 cursor-pointer transition-transform hover:scale-110",
  {
    variants: {
      size: {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-12 h-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

type SwatchProps = {
  swatch: string[],
  size?: "sm" | "md" | "lg",
  highlightLast?: boolean
};

export default function Swatch(props: SwatchProps) {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const handleSwatchClick = (index: number) => {
    if (activeTooltip === index) {
      setActiveTooltip(null);
    } else {
      setActiveTooltip(index);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
        {props.swatch.map((color, index) => (
          <div key={index} className="relative">
            <div
              className={cn(swatchVariants({ size: props.size || "md" }))}
              style={{ 
                backgroundColor: color,
                border: (index == props.swatch.length-1 && props.highlightLast) ? "3px solid gold" : "1px solid black"
              }}
              onClick={() => handleSwatchClick(index)}
            />
            {activeTooltip === index && (
              <div className="absolute z-10 px-2 py-1 text-xs font-mono text-white bg-gray-900 rounded shadow-lg -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                {color}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900" />
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
