import React from 'react';

function PastelBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      
      {/* Base Grid / Dotted Pattern (Upper Left) */}
      <div 
        className="absolute top-0 left-0 w-[40vw] h-[50vh] opacity-30" 
        style={{
          backgroundImage: 'radial-gradient(#818cf8 2px, transparent 2px)',
          backgroundSize: '28px 28px'
        }}
      />
      
      {/* Base Grid / Dotted Pattern (Upper Right) */}
      <div 
        className="absolute top-0 right-0 w-[40vw] h-[50vh] opacity-30" 
        style={{
          backgroundImage: 'radial-gradient(#a78bfa 2px, transparent 2px)',
          backgroundSize: '28px 28px'
        }}
      />
      
      {/* Base Grid / Dotted Pattern (Bottom Left) */}
      <div 
        className="absolute bottom-0 left-0 w-[40vw] h-[50vh] opacity-30" 
        style={{
          backgroundImage: 'radial-gradient(#6366f1 2px, transparent 2px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* Base Grid / Dotted Pattern (Bottom Right) */}
      <div 
        className="absolute bottom-0 right-0 w-[40vw] h-[50vh] opacity-30" 
        style={{
          backgroundImage: 'radial-gradient(#8b5cf6 2px, transparent 2px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* TOP LEFT: Large soft pastel blue circular gradient */}
      <div className="absolute -top-[10%] -left-[5%] w-[70vw] h-[70vw] lg:w-[60vw] lg:h-[60vw] rounded-full bg-blue-300/40 blur-[120px]" />

      {/* TOP RIGHT: Large soft lavender/purple blurred shape */}
      <div className="absolute -top-[5%] -right-[5%] w-[60vw] h-[60vw] lg:w-[50vw] lg:h-[50vw] rounded-full bg-purple-300/40 blur-[100px]" />

      {/* BOTTOM LEFT: Very subtle pink/lavender shape */}
      <div className="absolute -bottom-[15%] -left-[10%] w-[60vw] h-[60vw] lg:w-[50vw] lg:h-[50vw] rounded-full bg-pink-300/35 blur-[120px]" />

      {/* BOTTOM RIGHT: Very subtle blue/purple shape */}
      <div className="absolute -bottom-[5%] -right-[5%] w-[70vw] h-[70vw] lg:w-[60vw] lg:h-[60vw] rounded-full bg-indigo-300/35 blur-[120px]" />

      {/* MIDDLE: Very subtle radial blue/indigo glow */}
      <div className="absolute top-[20%] left-[30%] w-[50vw] h-[50vw] rounded-full bg-blue-200/30 blur-[120px]" />

    </div>
  );
}

export default PastelBackground;
