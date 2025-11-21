import React from "react";

const Decoration = () => {
  return (
    <>
      {/* Blue-dominant gradient with green accent */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-linear-to-br from-cyan-900 via-cyan-800 to-emerald-600"></div>

      {/* Ambient circles */}
      <div className="absolute inset-0 overflow-hidden -z-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/10 rounded-full mix-blend-overlay"></div>

        {/* Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/20 rounded-full"></div>

        {/* Floating blobs */}
        <div className="absolute top-1/3 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>

        <div
          className="absolute top-1/4 right-10 w-32 h-32 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />

        <div
          className="absolute bottom-10 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </>
  );
};

export default Decoration;
