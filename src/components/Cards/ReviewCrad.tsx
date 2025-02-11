"use client";
import { auth } from "@/firebase/clientApp";
import { FaPencilAlt } from "react-icons/fa";

// Define the props interface for ReviewCard
interface ReviewCardProps {
    review: {
        reviewId: string; // Unique identifier for the review
        authorUserId: string; // ID of the user who wrote the review
        text: string; // The actual review content
    };

    // Object mapping user IDs to their details
    userDetails: { [key: string]: { name: string; photoURL: string } };

    // Function to handle editing the review
    onEdit: (review: any) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, userDetails, onEdit }) => {
    return (
        <li className="border-b-2 p-4 relative max-w-[331px]">
            <div className="flex items-start space-x-3 flex-nowrap">
                {/* User Profile Image */}
                <div className="bg-gradient-to-b from-[#A8FF00] to-[#659900] p-[1px] rounded-full flex items-center justify-center flex-none">
                    <img
                        src={userDetails[review.authorUserId]?.photoURL}
                        alt="Profile"
                        className="w-[40px] h-[40px] rounded-full"
                    />
                </div>

                {/* User Name and Review */}
                <div className="flex-1">
                    <p className="text-[12px] text-[#2F3E0D] font-medium">
                        {userDetails[review.authorUserId]?.name || ""}
                    </p>
                    <p className="text-[#35392D] mt-1 text-[12px] break-words whitespace-pre-wrap w-full">
                        {review.text}
                    </p>
                </div>
            </div>

            {/* Edit Button (Visible only to the review's author) */}
            {auth.currentUser?.uid === review.authorUserId && (
                <button
                    className="absolute bottom-2 right-2 text-gray-500 hover:text-blue-500 transition"
                    onClick={() => onEdit(review)} // Trigger edit function on click
                >
                    <FaPencilAlt className="w-5 h-5" />
                </button>
            )}
        </li>
    );
};

export default ReviewCard;
