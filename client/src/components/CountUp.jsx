import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const CountUp = ({ value, label, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <div ref={ref}>
      <p className="font-display text-4xl md:text-5xl font-semibold text-brass">
        {display}
        {suffix}
      </p>
      <p className="text-white/60 text-sm mt-2 tracking-wide">{label}</p>
    </div>
  );
};

export default CountUp;
