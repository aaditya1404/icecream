"use client";

import FlavorIceCream from "../Icons/FlavorIceCream";
import IceCream from "../Icons/IceCream";
import StarIcon from "../Icons/StarIcon";

// Define the props interface for the ProductCard component
interface ProductCardProps {
    id: string; // Unique product identifier
    name: string; // Product name
    photoURL: string; // URL for the product image
    rating: string; // Product rating
}

const ProductCard = ({ id, name, photoURL, rating }: ProductCardProps) => {
    return (
        <div className="flex flex-col  w-[196px] h-[312px] fill-[#0d0a0a] bg-[#071005] rounded-2xl bg-opacity-50 ">

            {/* Display product name */}
            <div className="fixed text-center flex items-center justify-center rounded-2xl w-[196px] h-[100px]">
                <h3 className="text-[17.89px] text-white font-semibold ">{name}</h3>
            </div>

            <div >
                <div className="w-full h-48 relative rounded-t-lg flex items-center justify-center z-50 translate-y-[94px]">
                    {photoURL ? (
                        <svg
                            width="91.19"
                            height="188.96"
                            viewBox="0 0 117 241"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="relative"
                        >
                            {/* Define mask */}
                            <mask id="mask0_285_344" maskUnits="userSpaceOnUse" x="0" y="0" width="117" height="241">
                                <path d="M104.735 35.4983C103.45 15.5353 86.8845 0 66.8833 0H49.1342C29.133 0 12.5671 15.5353 11.2821 35.4983L0.0600131 210.14C-0.996029 226.54 12.02 240.421 28.4586 240.421H87.5716C104.01 240.421 117.026 226.54 115.97 210.14L104.748 35.4983H104.735Z" fill="white" />
                            </mask>
                            <g mask="url(#mask0_285_344)">
                                <path d="M141.977 -37.8901H-25.9592V282.091H141.977V-37.8901Z" fill="#FCE173" />
                            </g>

                            {/* Image with applied mask */}
                            <image
                                href={photoURL}
                                width="200"
                                height="500"
                                preserveAspectRatio="xMidYMid slice"
                                className="w-full h-full object-cover"
                                mask="url(#mask0_285_344)"
                            />
                        </svg>
                    ) : (
                        <div className="text-gray-600">No Image Available</div>
                    )}
                </div>

                <div>
                    <img
                        src="/assests/stick.svg"
                        alt="ice-cream-stick"
                        className="w-[20.11px] h-[29.65px] mx-auto translate-y-[90px]"
                    />
                </div>

                <div className="relative w-[45.36px] h-[43.48px] translate-x-32 translate-y-[55px]">
                    {/* Star SVG */}
                    <StarIcon
                        className="w-full h-full"
                    />

                    {/* Rating Overlay */}
                    <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-black">
                        {rating}
                    </p>
                </div>
            </div>

            {/* Display product rating */}
            {/* <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">Rating : {rating}</h3>
            </div> */}
        </div>
    );
};

export default ProductCard;

