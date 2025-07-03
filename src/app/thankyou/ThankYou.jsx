import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ThankYou = () => {
  const navigate = useNavigate();
  const [stars, setStars] = React.useState([]);

  React.useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      const starCount = Math.floor(window.innerWidth / 50);
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          size: Math.random() * 3 + 1,
          duration: 5 + Math.random() * 10,
          delay: Math.random() * 5,
          opacity: Math.random() * 0.5 + 0.3
        });
      }
      setStars(newStars);
    };

    generateStars();
    const interval = setInterval(generateStars, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full p-4 relative overflow-hidden min-h-screen">
   
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 to-orange-50/20">
        
          <div className="absolute inset-0 bg-[length:30px_30px] bg-[linear-gradient(to_right,#fef3c7_1px,transparent_1px),linear-gradient(to_bottom,#fef3c7_1px,transparent_1px)] "
            style={{
              opacity: 0.7,
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))'
            }}
          ></div>
          
      
          {stars.map((star) => (
            <div 
              key={star.id}
              className="absolute rounded-full bg-amber-500 animate-float"
              style={{
                left: `${star.x}%`,
                top: `${star.y}px`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
                opacity: star.opacity,
                filter: 'blur(0.5px)',
                boxShadow: '0 0 4px #fff, 0 0 8px #fef3c7'  
              }}
            />
          ))}
        </div>
      </div>

   
      <div className="mb-6 flex justify-center">
        <img 
          src="https://southindiagarmentsassociation.com/assets/images/events/gform.jpg" 
          alt="Header" 
          className="w-full max-w-2xl rounded-lg shadow-lg border-2 border-amber-200"
        />
      </div>

   
      <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm border-amber-300 shadow-lg hover:shadow-amber-100/50 transition-shadow rounded-lg p-8 mb-6">
        <div className="text-center">
          <svg 
            className="mx-auto h-16 w-16 text-green-500 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Thank you!</h2>
          
          <div className="text-amber-700 mb-6 space-y-3">
            <p>Your details submitted successfully
          & we sent a copy of your detailsto your email id
           if any changes required please call
           <a href="tel:8867171060" className="font-semibold hover:underline ml-1">
      @ 8867171060
    </a></p>
          </div>
          
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-md hover:shadow-amber-200/50 transition-all"
          >
            Return to Home
          </Button>
        </div>
      </div>


      <div className="mt-8 text-center text-sm text-amber-800/70">
        <div className="text-xs text-amber-800/50">
          Copyright © {new Date().getFullYear()} | Siga Fair
        </div>
      </div>

   
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) translateX(20px);
            opacity: 0;
          }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

export default ThankYou;