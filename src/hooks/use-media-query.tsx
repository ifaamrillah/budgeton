import { useEffect, useState } from "react";

export const useMediaQuery = () => {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop" | null>(
    null
  );

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      if (window.matchMedia("(max-width: 640px)").matches) {
        setDevice("mobile");
      } else if (
        window.matchMedia("(min-width: 641px) and (max-width: 1000px)").matches
      ) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
    };

    checkDevice(); // Initial check
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return {
    device,
    width: dimensions?.width ?? 0,
    height: dimensions?.height ?? 0,
    isMobile: device === "mobile",
    isTablet: device === "tablet",
    isDesktop: device === "desktop",
    setDimensions,
  };
};
