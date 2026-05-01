import Lottie from "lottie-react";
import animationData from "../assets/loader.json";

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <div className="w-32 h-32">
        <Lottie animationData={animationData} loop={true} />
      </div>

      <p className="text-slate-400 mt-4 animate-pulse">
        Loading requests...
      </p>
    </div>
  );
}

export default Loader;