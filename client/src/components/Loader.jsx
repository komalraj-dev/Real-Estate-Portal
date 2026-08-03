const Loader = ({ full = true }) => (
  <div className={full ? "min-h-[60vh] flex items-center justify-center" : "py-10 flex items-center justify-center"}>
    <div className="w-10 h-10 border-2 border-stone-line border-t-brass rounded-full animate-spin" />
  </div>
);

export default Loader;
