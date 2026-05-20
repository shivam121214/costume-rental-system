function Loader() {
  return (
    <div className="flex flex-col items-center mt-16">
      <img
        src="/loader.gif"
        alt="loading"
        className="w-50 h-50"
      />
      <p className="mt-3 text-slate-500">Loading requests...</p>
    </div>
  );
}

export default Loader;