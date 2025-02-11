// import Link from "next/link";

// const Navbar: React.FC = () => {
//     return (
//         <div className='bg-[#a8ff00] fixed w-full'>
//             <ul className='flex h-24 items-center justify-evenly overflow-x-auto'>
//                 <li className='px-10'><Link href={'/'}>Home</Link></li>
//                 <li className='px-10'><Link href={'/flavor'}>Flavors</Link></li>
//                 <li className='px-10'><Link href={'/request'}>Request</Link></li>
//                 <li className='px-10'><Link href={'/account'}>Account</Link></li>
//             </ul>
//         </div>
//     );
// };

// export default Navbar;
"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
const Arrow = '/images/arrow.svg';
interface NavItem {
    text: string
    href: string
}
const Header = () => {
    const router = useRouter();
    const [selectedIndex, setSelectedIndex] = useState<number>(1);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [startX, setStartX] = useState<number>(1);
    const [dragOffset, setDragOffset] = useState<number>(0);
    const dragThreshold = 20;
    const sliderRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    const navItems: NavItem[] = [
        { text: "ACCOUNT", href: "/account" },
        { text: "HOME", href: "/" },
        { text: "FLAVORS", href: "/flavor" },
        { text: "REQUESTS", href: "/request" },
        // { text: "SETTINGS", href: "/settings" },
    ];

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.clientX - dragOffset);
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const currentX = e.clientX - startX;
        console.log("currentX", currentX);
        setDragOffset(currentX);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        if (Math.abs(dragOffset) > dragThreshold) {
            const direction = dragOffset > 0 ? -1 : 1;
            const newIndex = Math.max(0, Math.min(navItems.length - 1, selectedIndex + direction));
            setSelectedIndex(newIndex);
        }
        animateToCenter();
    };

    const animateToCenter = () => {
        animationRef.current = requestAnimationFrame(() => {
            setDragOffset((prev) => {
                const newOffset = prev * 0.85;
                if (Math.abs(newOffset) < 0.5) {
                    if (animationRef.current) {
                        cancelAnimationFrame(animationRef.current);
                    }
                    return 0;
                }
                animateToCenter();
                return newOffset;
            });
        });
    };

    const handleClick = (index: number) => {
        console.log("Clicked on:", navItems[index].href, "Dragging:", isDragging);
        if (!isDragging || Math.abs(dragOffset) < dragThreshold) {
            setSelectedIndex(index);
            router.push(navItems[index].href);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX - dragOffset);
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX - startX;
        console.log("currentX", currentX);
        setDragOffset(currentX);
    };

    const handleTouchEnd = () => {
        handleMouseUp();
    };

    const getPosition = (index: number): number => {
        const spacing = 22.5
        const startPosition = 5
        const basePositions = Array.from({ length: 5 }, (_, i) => startPosition + (spacing * i))
        const selectedOffset = (selectedIndex - 2) * -spacing
        const dragAdjustment = isDragging ? dragOffset * 0.1 : 0
        return basePositions[index] + selectedOffset + dragAdjustment
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);
    

    // Automatically update route when selectedIndex changes
    useEffect(() => {
        router.push(navItems[selectedIndex].href);
    }, [selectedIndex, router]);

    return (
        <>
            <div className="fixed w-full overflow-hidden z-50">
                <div className="mt-[-120px] ml-[-20%] w-[140%] h-[250px] relative overflow-hidden rounded-[200%] flex items-end justify-center bg-[#A8FF00]">
                    <div
                        ref={sliderRef}
                        className={`absolute bottom-1 w-full h-32 select-none ${isDragging ? "cursor-grabbing" : "cursor-pointer"}`}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <svg className="w-full h-full z-0" viewBox="0 0 500 100">
                            <defs>
                                <path
                                    id="reverseCurvePath"
                                    d="M 50,0 A 200,90 0 0,0 450,0"
                                    fill="transparent"
                                />
                            </defs>
                            {navItems.map((item, index) => (
                                <motion.text
                                    key={item.text}
                                    fontSize="14"
                                    fontWeight="500"
                                    initial={{ fill: index === selectedIndex ? "#000000" : "#BCB7B7" }}
                                    animate={{ fill: index === selectedIndex ? "#000000" : "#BCB7B7" }}
                                    whileHover={{ fill: "#000000" }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => handleClick(index)}
                                >
                                    <motion.textPath
                                        href="#reverseCurvePath"
                                        startOffset={`${getPosition(index)}%`}
                                        textAnchor="middle"
                                        animate={{ startOffset: `${getPosition(index)}%` }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    >
                                        {item.text}
                                    </motion.textPath>
                                </motion.text>
                            ))}
                        </svg>
                    </div>
                </div>
            </div>
            <div className="flex justify-center ">
                <img src="/assests/icons/navbar-arrow-icon.svg" alt="Arrow" className="fixed w-[32px] h-[26px] translate-y-[120px] z-50"/>
            </div>
        </>
    );
};
export default Header;