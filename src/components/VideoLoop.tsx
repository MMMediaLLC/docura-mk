import React from 'react';
import { cn } from '../lib/utils'; // Assuming you have a utils file for tailwind-merge/clsx or remove this line if not

interface VideoLoopProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  overlay?: boolean; // Adds a dark overlay for text readability
  className?: string; // Container className
  videoClassName?: string; // Video element className
}

export function VideoLoop({ 
  src, 
  overlay = true, 
  className, 
  videoClassName,
  ...props 
}: VideoLoopProps) {
  return (
    <div className={cn("relative overflow-hidden w-full h-full", className)}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={cn("absolute inset-0 w-full h-full object-cover", videoClassName)}
        {...props}
      >
        <source src={src} type="video/mp4" />
        Vaš pregledač ne podržava video tag.
      </video>
      
      {overlay && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />
      )}
    </div>
  );
}
