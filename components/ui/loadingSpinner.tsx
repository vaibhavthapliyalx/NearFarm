import { classMerge } from "@/lib/utilityfunctions";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface IProps {
  display: boolean;
  message?: string;
  className?: string;
}

export default function LoadingSpinner({display, message, className}: IProps) {
  const [displaySpinner, setDisplaySpinner] = useState(display);

  // Update the displaySpinner state variable when the display prop changes.
  useEffect(() => {
    setDisplaySpinner(display);
  }, [display]);

  return (
    displaySpinner ? (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
        <div className={`flex flex-col justify-center items-center ${className}`}>
          <Loader2
            className={classMerge('my-28 h-16 w-16 text-primary/60 animate-spin mb-5', className)}
          />
          {message && 
            <p className=" text-white text-center text-lg sm:text-xl md:text-2xl lg:text-3xl dark:text-gray-300">
              {message}
            </p>}
        </div>
      </div>
    ) : null
  );
}