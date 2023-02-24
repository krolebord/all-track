import { useNavigation } from "@remix-run/react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export const GlobalProgressIndicator = () => {
  const { state: navigationState } = useNavigation();
  const navigating = navigationState !== 'idle';

  const ref = useRef<HTMLDivElement>(null);
  const [animationComplete, setAnimationComplete] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    if(navigating) setAnimationComplete(false);

    Promise.allSettled(
      ref.current.getAnimations().map(({ finished }) => finished)
    ).then(() => {
      if (navigating) return;
      setAnimationComplete(true);
    });
  }, [navigating]);

  return (
    <div
      role="progressbar"
      aria-hidden={!navigating}
      aria-valuetext={navigating ? "Loading" : undefined}
      className="absolute inset-x-0 top-0 z-50 h-1 animate-pulse"
    >
      <div
        ref={ref}
        className={clsx(
          'h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all ease-in-out',
          {
            'w-0 transition-none': navigationState === 'idle' && animationComplete,
            'w-4/12 duration-500': navigationState === 'submitting',
            'w-10/12 duration-500': navigationState === 'loading',
            'w-full opacity-0 duration-300': navigationState === 'idle' && !animationComplete
          }
        )}
      >

      </div>
    </div>
  );
};
