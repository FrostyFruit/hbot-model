
import { useEffect, useState } from "react";
import { useProspect } from "@/hooks/use-prospect";

const Hero = () => {
  const [firstName, setFirstName] = useState("there");
  const [businessName, setBusinessName] = useState("");
  const { data: prospect, isLoading, error } = useProspect();
  
  useEffect(() => {
    console.log("Hero component - Prospect data:", prospect);
    
    // Set business name from prospect if available
    if (prospect?.business_name) {
      setBusinessName(prospect.business_name);
      console.log("Setting business name from prospect:", prospect.business_name);
    }
  }, [prospect]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Get name parameter (personal name)
    const nameParam = params.get("name");
    if (nameParam) {
      setFirstName(nameParam);
    }
    
    // Get business name parameter (override prospect data if provided in URL)
    const businessParam = params.get("business");
    if (businessParam) {
      setBusinessName(businessParam);
    }
  }, []);

  // Determine what business name to display
  const displayBusinessName = businessName ? businessName : "Hyperbaric HQ";
  

  return (
    <div className="relative flex flex-col items-center text-white bg-[#140f0e]">
      <div className="absolute inset-0 -z-10 bg-[#140F0E]"></div>

      <div className="container px-4 md:px-6 flex flex-col items-center animate-fade-in pt-8 md:pt-16 pb-8 md:pb-16 bg-[#140f0e]">
        <div className="text-center space-y-4 md:space-y-6 max-w-4xl mx-auto">
          <p className="text-base md:text-xl text-white font-normal mb-2 md:mb-4">
            {displayBusinessName}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight font-medium px-2">
            Hi {firstName}{businessName ? `, welcome to ${displayBusinessName}` : ", welcome to Hyperbaric HQ"}
          </h1>
          <p className="text-sm md:text-lg text-white/90 mt-4">
            {introText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
