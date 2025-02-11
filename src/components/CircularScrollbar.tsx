"use client";
import React, { useEffect, useRef } from "react";

interface CircularScrollbarProps {
  scrollWidth: number;
  scrollPosition: number;
  onScrollChange: (value: number) => void;
}

const CircularScrollbar: React.FC<CircularScrollbarProps> = ({
  scrollWidth,
  scrollPosition,
  onScrollChange,
}) => {
  const thumbRef = useRef<HTMLDivElement>(null);

  // Update the thumb position along a flipped parabolic curve.
  // Curve equations: x = 200 * t, y = -50 * (2*t - 1)² + 100, where t ∈ [0,1]
  // t = 0   → (0, 50), t = 0.5 → (100, 100), t = 1 → (200, 50)
  useEffect(() => {
    if (thumbRef.current) {
      const t = scrollPosition / scrollWidth;
      const x = 200 * t;
      const y = -50 * Math.pow(2 * t - 1, 2) + 100;
      thumbRef.current.style.left = `${x}px`;
      thumbRef.current.style.top = `${y}px`;
    }
  }, [scrollPosition, scrollWidth]);

  // Handle drag events by mapping the horizontal position to the normalized t value.
  const handleDrag = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    const clientX =
      "touches" in event ? event.touches[0].clientX : event.clientX;

    const containerRect =
      thumbRef.current?.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    const relativeX = clientX - containerRect.left;
    let t = relativeX / 200;
    t = Math.max(0, Math.min(1, t));
    onScrollChange(t * scrollWidth);
  };

  // Remove event listeners when dragging ends.
  const onMouseUp = () => {
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const onTouchEnd = () => {
    document.removeEventListener("touchmove", handleDrag);
    document.removeEventListener("touchend", onTouchEnd);
  };

  // Add event listeners to start dragging.
  const onMouseDown = (e: React.MouseEvent) => {
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    document.addEventListener("touchmove", handleDrag);
    document.addEventListener("touchend", onTouchEnd);
  };

  return (
    <div className="circular-scrollbar">
      <svg className="scroll-path" viewBox="0 0 200 100">
        {/* Draw the flipped parabolic curve */}
        <path
          d="M 0 50 Q 100 150 200 50"
          stroke="#ccc"
          strokeWidth="5"
          fill="none"
        />
      </svg>
      <div
        ref={thumbRef}
        className="scroll-thumb"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      />
    </div>
  );
};

export default CircularScrollbar;