import { useEffect, useState } from "react";
import Lottie from "lottie-react";

function Loader() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/loader.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  if (!animationData) return null;

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