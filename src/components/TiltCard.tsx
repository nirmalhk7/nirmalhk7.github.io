import React, { useRef } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { createRafThrottled } from "@/util/rafThrottle";

interface TiltCardProps extends Omit<React.ComponentPropsWithoutRef<typeof m.div>, "ref" | "onClick" | "onKeyDown"> {
  children: React.ReactNode;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = "",
  onClick,
  onKeyDown,
  role,
  tabIndex,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const updateTilt = React.useMemo(
    () => createRafThrottled((xPercentage: number, yPercentage: number) => {
      x.set(xPercentage);
      y.set(yPercentage);
    }),
    [x, y]
  );

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  React.useEffect(() => {
    const resetRect = () => {
      rectRef.current = null;
    };

    window.addEventListener("resize", resetRect);
    return () => {
      window.removeEventListener("resize", resetRect);
    };
  }, []);

  React.useEffect(() => updateTilt.cancel, [updateTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;

    const rect = rectRef.current ?? ref.current.getBoundingClientRect();
    rectRef.current = rect;

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    updateTilt(xPct, yPct);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    updateTilt.cancel();
    x.set(0);
    y.set(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    } else if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <m.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={role || (onClick ? "button" : undefined)}
      tabIndex={tabIndex !== undefined ? tabIndex : (onClick ? 0 : undefined)}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
      {...props}
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="h-full w-full"
      >
        {children}
      </div>
    </m.div>
  );
};
