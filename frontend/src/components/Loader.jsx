// function Loader() {
//   return (
//     <div className="flex flex-col items-center mt-16">
//       <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
//       <p className="mt-3 text-slate-500">Loading requests...</p>
//     </div>
//   );
// }

// export default Loader;

function Loader() {
  return (
    <div className="flex flex-col items-center mt-16">
      <img
        src="/loader.gif"
        alt="loading"
        className="w-20 h-20"
      />
      <p className="mt-3 text-slate-500">Loading requests...</p>
    </div>
  );
}

export default Loader;