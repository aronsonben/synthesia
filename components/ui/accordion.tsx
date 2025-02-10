import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Track as TrackInterface } from "@/lib/interface";
import Track from "../synthesia/track";
import "./styles.css";

import { cn } from "@/lib/utils";

type AccordionProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
  trackTitle?: string;
  track: TrackInterface;
  onEditTrack: (track: TrackInterface) => Promise<void>;
};

const Accordion = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Root>, AccordionProps>(({ className, trackTitle, track, onEditTrack, ...props }, ref) => (
  <AccordionPrimitive.Root 
    ref={ref} {...props} 
    className={cn(
      "mw-full w-full mb-4 ",
      className,
      (props.disabled ? "opacity-50" : ""),
    )}
  >
    <AccordionPrimitive.Item value={String(track?.id)} className={cn("AccordionItem", className)}>
      <AccordionPrimitive.Header className={cn("w-full", className)}>
        <AccordionPrimitive.Trigger
          className={cn(
            "flex items-center justify-between gap-2 flex-1 rounded-lg h-4 w-full box-border bg-slate-200 dark:bg-slate-700 shadow-md p-6 leading-none text-lg",
            className,
            (!props.disabled ? "hover:bg-blue-50" : ""),
          )}
        >
          {trackTitle}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="AccordionContent">
        <Track track={track} onEditTrack={onEditTrack} />
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  </AccordionPrimitive.Root>
));

export default Accordion;
