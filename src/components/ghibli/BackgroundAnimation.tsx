
import React from "react";

export default function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#29647c]/5 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#CDF683]/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-[#29647c]/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      
      {/* CSS Styles for animations */}
      <style>
        {`
          @keyframes gradient-y {
            0% { background-position: 50% 0%; }
            50% { background-position: 50% 100%; }
            100% { background-position: 50% 0%; }
          }
          
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          
          @keyframes fade-in-right {
            0% { opacity: 0; transform: translateX(-10px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          
          .animate-blob {
            animation: blob 7s infinite ease-in-out;
          }
          
          .animate-gradient-y {
            animation: gradient-y 15s ease infinite;
            background-size: 100% 200%;
          }
          
          .animate-fade-in-right {
            animation: fade-in-right 0.3s ease-out forwards;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}
      </style>
    </div>
  );
}
