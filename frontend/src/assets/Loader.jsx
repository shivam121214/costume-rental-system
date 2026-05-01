import Lottie from "lottie-react";
import loaderAnimation from "../assets/Dance_loader.json";

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <div className="w-28 h-28">
        <Lottie animationData={loaderAnimation} loop={true} />
      </div>

      <p className="text-slate-400 mt-4 animate-pulse">
        Loading requests...
      </p>
    </div>
  );
}

export default Loader;