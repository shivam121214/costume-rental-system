import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

function Themes() {
  const navigate = useNavigate();

  const themes = [
    {
      name: "Christmas",
      emoji: "🎄",
      color: "bg-[#ef476f]",
      description: "Festive holiday costumes"
    },
    {
      name: "Halloween",
      emoji: "🎃",
      color: "bg-[#ffd166]",
      description: "Spooky and scary costumes"
    },
    {
      name: "Birthday",
      emoji: "🎂",
      color: "bg-[#06d6a0]",
      description: "Fun party costumes"
    },
    {
      name: "Wedding",
      emoji: "💒",
      color: "bg-[#bde0fe]",
      description: "Elegant celebration wear"
    },
    {
      name: "Superhero",
      emoji: "🦸",
      color: "bg-[#8338ec]",
      description: "Powerful hero costumes"
    },
    {
      name: "Princess",
      emoji: "👑",
      color: "bg-[#ff006e]",
      description: "Royal and elegant gowns"
    },
    {
      name: "Animal",
      emoji: "🦁",
      color: "bg-[#fb5607]",
      description: "Cute animal costumes"
    },
    {
      name: "Funny",
      emoji: "🤣",
      color: "bg-[#ffbe0b]",
      description: "Hilarious and quirky"
    },
    {
      name: "Scary",
      emoji: "👻",
      color: "bg-[#3a0ca3]",
      description: "Creepy and frightening"
    },
    {
      name: "Seasonal",
      emoji: "🌍",
      color: "bg-[#06ffa5]",
      description: "Season-based costumes"
    }
  ];

  const handleThemeClick = (themeName) => {
    navigate(`/products?theme=${themeName}`);
  };

  return (
    <div className="min-h-screen bg-[#fdf8e6] text-black pt-20 pb-20 relative overflow-hidden">
      {/* Background Radial Blurs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-[#ffd166]/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-[#ef476f]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-[#bde0fe]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 
            className="text-5xl md:text-6xl font-black text-black mb-4" 
            style={{ fontFamily: "'Chewy', cursive" }}
          >
            🎭 Pick Your Theme
          </h1>
          <p className="text-xl text-gray-700 font-bold max-w-2xl">
            Choose a theme and explore our amazing collection of costumes perfectly suited for your style!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {themes.map((theme, index) => (
            <motion.div
              key={theme.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.08,
                type: "spring",
                stiffness: 100
              }}
              onClick={() => handleThemeClick(theme.name)}
              className="group cursor-pointer"
            >
              {/* Shadow Background */}
              <div className={`absolute inset-0 ${theme.color} border-4 border-black rounded-3xl transform translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3`}></div>

              {/* Main Card */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="relative h-full bg-white border-4 border-black rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all group-hover:-translate-y-1 group-hover:-translate-x-1 shadow-[6px_6px_0_0_rgba(0,0,0,1)]"
              >
                {/* Emoji */}
                <div className={`${theme.color} p-6 rounded-2xl border-3 border-black mb-4 transform group-hover:scale-110 transition-transform`}>
                  <span className="text-6xl">{theme.emoji}</span>
                </div>

                {/* Theme Name */}
                <h2 
                  className="text-3xl font-black text-black mb-2" 
                  style={{ fontFamily: "'Chewy', cursive" }}
                >
                  {theme.name}
                </h2>

                {/* Description */}
                <p className="text-sm font-bold text-gray-600 mb-4">
                  {theme.description}
                </p>

                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${theme.color} text-black border-3 border-black rounded-full px-6 py-2 font-black uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
                >
                  Explore
                </motion.div>

                {/* Decorative Dots */}
                <div className="flex gap-1 justify-center mt-4">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <p className="text-lg font-bold text-gray-700 mb-6">
            Can't decide? <span className="text-[#ff5c8d]">Browse all costumes</span> to see everything we have!
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Themes;
