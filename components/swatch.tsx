import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const swatchVariants = cva(
  "w-6 h-6",
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
  return (
    <div className="flex flex-wrap items-center gap-1">
        {props.swatch.map((color, index) => (
          <div
            key={index}
            className={cn(swatchVariants({ size: props.size || "md" }))}
            style={{ 
              backgroundColor: color,
              border: (index == props.swatch.length-1 && props.highlightLast) ? "3px solid gold" : "1px solid black"
            }}
          ></div>
        ))}
    </div>
  );
}
