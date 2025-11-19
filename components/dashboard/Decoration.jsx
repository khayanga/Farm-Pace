import React from "react";

const Decoration = () => {
  return (
    <>
      {/* Soft muted gradient background */}
      <div className="absolute bg-linear-to-br from-green-400 to-green-800 inset-0 -z-10 rounded-xl"></div>

      {/* Soft ambient light circles */}
      <div className="absolute inset-0 overflow-hidden -z-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full mix-blend-overlay"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full mix-blend-overlay"></div>

        {/* Low-contrast rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/3 rounded-full"></div>

        {/* Soft floating blobs */}
        <div className="absolute top-1/3 left-10 w-20 h-20 bg-white/5 rounded-full animate-float"></div>

        <div
          className="absolute top-1/4 right-10 w-32 h-32 bg-white/5 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>

        <div
          className="absolute bottom-10 left-1/4 w-16 h-16 bg-white/5 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </>
  );
};

export default Decoration;
