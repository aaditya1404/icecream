// "use client";
// import { useEffect, useRef, RefObject } from "react";

// interface ParabolicCardViewProps {
//   containerRef: RefObject<HTMLDivElement | null>; // Allow null in type
//   onScrollPositionChange: (position: number) => void;
// }

// const ParabolicCardView: React.FC<ParabolicCardViewProps> = ({
//   containerRef,
//   onScrollPositionChange,
// }) => {
//   const touchStartX = useRef<number | null>(null);
//   const touchStartScrollLeft = useRef<number>(0);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     const handleScroll = () => {
//       const cards = container.querySelectorAll<HTMLDivElement>(
//         ".card:not(.dummy-card)"
//       );
//       const containerRect = container.getBoundingClientRect();
//       const containerCenter = containerRect.width / 2;

//       cards.forEach((card) => {
//         const cardRect = card.getBoundingClientRect();
//         const cardCenter = cardRect.left + cardRect.width / 2;
//         const distanceFromCenter = cardCenter - containerCenter;

//         const a = 0.002;
//         const parabolicOffset = a * Math.pow(distanceFromCenter, 2);

//         card.style.top = `${150 - parabolicOffset}px`;
//       });

//       onScrollPositionChange(container.scrollLeft);
//     };

//     const handleScrollEnd = () => {
//       const containerRect = container.getBoundingClientRect();
//       const containerCenter = containerRect.width / 2;
//       const cards = Array.from(
//         container.querySelectorAll<HTMLDivElement>(".card:not(.dummy-card)")
//       );

//       if (cards.length === 0) return;

//       const closestCard = cards.reduce((prev, curr) => {
//         const prevCenter =
//           prev.getBoundingClientRect().left + prev.offsetWidth / 2;
//         const currCenter =
//           curr.getBoundingClientRect().left + curr.offsetWidth / 2;
//         return Math.abs(currCenter - containerCenter) <
//           Math.abs(prevCenter - containerCenter)
//           ? curr
//           : prev;
//       }, cards[0]);

//       const closestCardRect = closestCard.getBoundingClientRect();
//       const scrollOffset =
//         closestCardRect.left + closestCardRect.width / 2 - containerCenter;

//       container.scrollTo({
//         left: container.scrollLeft + scrollOffset,
//         behavior: "smooth",
//       });
//     };

//     let scrollTimeout: NodeJS.Timeout;

//     const onScroll = () => {
//       handleScroll();
//       clearTimeout(scrollTimeout);
//       scrollTimeout = setTimeout(handleScrollEnd, 150);
//     };

//     const onTouchStart = (e: TouchEvent) => {
//       touchStartX.current = e.touches[0].clientX;
//       touchStartScrollLeft.current = container.scrollLeft;
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       if (touchStartX.current === null) return;
//       const touchDeltaX = e.touches[0].clientX - touchStartX.current;
//       container.scrollLeft = touchStartScrollLeft.current - touchDeltaX;
//     };

//     const onTouchEnd = () => {
//       handleScrollEnd();
//       touchStartX.current = null;
//     };

//     container.addEventListener("scroll", onScroll);
//     container.addEventListener("touchstart", onTouchStart);
//     container.addEventListener("touchmove", onTouchMove);
//     container.addEventListener("touchend", onTouchEnd);

//     handleScroll();
//     setTimeout(handleScrollEnd, 100);

//     return () => {
//       container.removeEventListener("scroll", onScroll);
//       container.removeEventListener("touchstart", onTouchStart);
//       container.removeEventListener("touchmove", onTouchMove);
//       container.removeEventListener("touchend", onTouchEnd);
//     };
//   }, [containerRef]);

//   return null;
// };

// export default ParabolicCardView;

import { useEffect, useRef, RefObject } from "react";

interface ParabolicCardViewProps {
  containerRef: RefObject<HTMLDivElement | null>;
  onScrollPositionChange: (position: number) => void;
}

const ParabolicCardView: React.FC<ParabolicCardViewProps> = ({ containerRef, onScrollPositionChange }) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cards = container.querySelectorAll<HTMLDivElement>(".parabolic-card");
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.width / 2;

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distanceFromCenter = cardCenter - containerCenter;

        const a = 0.002;
        const parabolicOffset = a * Math.pow(distanceFromCenter, 2);

        card.style.transform = `translateY(${-parabolicOffset}px)`;
      });

      onScrollPositionChange(container.scrollLeft);
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef]);

  return null;
};

export default ParabolicCardView;
