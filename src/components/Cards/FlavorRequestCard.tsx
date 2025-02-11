"use client";
import { FaStar } from "react-icons/fa6";
import { GiRoundStar } from "react-icons/gi";
import StarIcon from "../Icons/StarIcon";
import IceCream from "../Icons/IceCream";

// Define the interface for component props
interface FlavorRequestCardProps {
    flavor: {
        id: string;
        flavorName: string;
        description: string;
        votes: number;
        referenceURL?: string; // Optional reference URL
    };
    requestedBy?: { name: string; photoURL: string }; // User who requested the flavor (optional)
    onVote: (id: string) => void; // Function to handle voting
}

// Functional component for displaying a single flavor request
const FlavorRequestCard: React.FC<FlavorRequestCardProps> = ({ flavor, requestedBy, onVote }) => {
    return (
        <div className="flex flex-col items-center w-[196px] h-[312px] fill-[#0d0a0a] bg-[#071005] rounded-3xl bg-opacity-50">
            <div className="flex flex-col items-center">
                {/* Flavor Name */}
                <div className="text-white font-semibold text-[17.89px] translate-y-10">
                    {flavor.flavorName}
                </div>

                <div className="relative w-[116.03px] h-[240.42px] translate-y-14">
                    {/* Use IceCream Component Instead of <img> */}
                    <IceCream className="w-full h-full" />

                    {/* User Avatar Overlay */}
                    <div className="absolute top-1/2 left-1/2 w-[77px] h-[77px] -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <img
                            src={requestedBy?.photoURL || "/default-avatar.png"}
                            alt={requestedBy?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Requested by and votes */}
            <div className="relative rounded-full p-[1px] bg-gradient-to-r from-[#2f3e0d] to-[#a8ff00] translate-y-5 z-50">
                <div className="flex items-center justify-evenly w-[173px] h-[57px] bg-gradient-to-l from-[#2f3e0d] to-[#121904] rounded-full">
                    <div className="flex flex-col items-flex-start">
                        <p className="text-[7px] font-semibold text-[#bcb7b7] translate-y-1">Requested By</p>
                        <p className="text-[12px] text-white font-semibold">{requestedBy?.name}</p>
                    </div>
                    <div className="relative w-[45.36px] h-[43.48px] flex items-center justify-center">
                        <StarIcon />
                        <p className="absolute text-[15px] font-bold text-black">
                            {flavor.votes}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stick */}
            {/* <div className="w-9 h-24 rounded-b-full bg-[#bcb7b7] bg-opacity-20">
            </div> */}
            <img src="/assests/black-stick.svg" alt="black stick" className="w-[25.45px] h-[83.97px] -translate-y-6 z-20"/>

        </div>
    );
};

export default FlavorRequestCard;
