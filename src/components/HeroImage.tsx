
import { useEffect, useRef } from "react";

// Define the props type to include onClick
interface HeroImageProps {
  onClick?: () => void; // Make onClick optional
}

const HeroImage: React.FC<HeroImageProps> = ({ onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Add "floating" animation effect with slight random movements
    const animate = () => {
      const floatingElements = container.querySelectorAll('.floating');
      
      floatingElements.forEach((el) => {
        const element = el as HTMLElement;
        const randomX = (Math.random() - 0.5) * 10; // Random movement in X direction
        const randomY = (Math.random() - 0.5) * 10; // Random movement in Y direction
        const randomDelay = Math.random() * 2; // Random delay
        const randomDuration = 3 + Math.random() * 3; // Random duration between 3-6s
        
        element.style.transition = `transform ${randomDuration}s ease-in-out ${randomDelay}s`;
        element.style.transform = `translate(${randomX}px, ${randomY}px)`;
        
        setTimeout(() => {
          element.style.transform = '';
        }, randomDuration * 1000 + randomDelay * 1000);
      });
      
      // Continue the animation
      setTimeout(animate, 6000);
    };
    
    // Start the animation
    animate();
    
  }, []);

  return (
    // Add the onClick handler to this div
    <div 
      className="relative w-full h-[400px] md:h-[500px] cursor-pointer" // Added cursor-pointer for visual feedback
      ref={containerRef} 
      //  onClick={onClick} // Attach the onClick handler here
    >
      {/* Main character */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <img 
          src="https://i.pravatar.cc/300?img=25" 
          alt="Student" 
          className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white shadow-lg object-cover floating" 
        />
      </div>
      
      {/* Educational elements */}
      <div className="absolute top-[20%] left-[15%] floating">
        <div className="bg-empowerPurple-light p-3 md:p-4 rounded-lg shadow-md">
          <img src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4bb.png" alt="Laptop" className="w-8 h-8 md:w-10 md:h-10" />
        </div>
      </div>
      
      <div className="absolute top-[30%] right-[15%] floating">
        <div className="bg-empowerBlue-light p-3 md:p-4 rounded-lg shadow-md">
          <img src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4d6.png" alt="Book" className="w-8 h-8 md:w-10 md:h-10" />
        </div>
      </div>
      
      <div className="absolute bottom-[20%] left-[25%] floating">
        <div className="bg-blue-100 p-3 md:p-4 rounded-lg shadow-md">
          <img src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f9d1-200d-1f4bc.png" alt="Teacher" className="w-8 h-8 md:w-10 md:h-10" />
        </div>
      </div>
      
      <div className="absolute bottom-[30%] right-[20%] floating">
        <div className="bg-purple-100 p-3 md:p-4 rounded-lg shadow-md">
          <img src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f393.png" alt="Graduation" className="w-8 h-8 md:w-10 md:h-10" />
        </div>
      </div>
      
      {/* Abstract shapes */}
      <div className="absolute top-[45%] left-[5%] floating">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-empowerPurple to-empowerPurple-light opacity-40" />
      </div>
      
      <div className="absolute bottom-[10%] right-[10%] floating">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-empowerBlue to-empowerBlue-light opacity-30" />
      </div>
      
      <div className="absolute top-[10%] right-[30%] floating">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-yellow-200 opacity-60" />
      </div>
      
      {/* Connect lines (optional) - these would look better with SVG paths but using divs for simplicity */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none"> {/* Added pointer-events-none */} 
        <div className="absolute top-[30%] left-[25%] w-[50%] h-[1px] bg-gray-200 transform rotate-[25deg]" />
        <div className="absolute top-[40%] left-[20%] w-[60%] h-[1px] bg-gray-200 transform -rotate-[15deg]" />
        <div className="absolute top-[60%] left-[30%] w-[40%] h-[1px] bg-gray-200 transform rotate-[5deg]" />
      </div>
    </div>
  );
};

export default HeroImage;
