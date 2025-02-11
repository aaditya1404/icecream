"use client";
import { useState, useEffect } from "react";

// Define the props interface for the ReviewForm component
interface ReviewFormProps {
    onSubmit: (text: string) => void; // Function to handle form submission
    onClose: () => void; // Function to handle closing the form
    initialText: string; // Initial text for pre-filling the form (used in editing)
}

// Functional component for submitting or updating a review
const ReviewForm = ({ onSubmit, onClose, initialText }: ReviewFormProps) => {

    // State to manage review text input
    const [text, setText] = useState(initialText);

    // Handles form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() === "") { // Validate that the review text is not empty
            alert("Review text cannot be empty.");
            return;
        }
        onSubmit(text); // Call the provided onSubmit function with the review text
        setText(""); // Clear the input field after submission
    };

    // Updates the text state when the initialText prop changes (for editing reviews)
    useEffect(() => {
        setText(initialText);
    }, [initialText]);

    return (
        // <div className="p-4 bg-white rounded-lg shadow-lg">

        //     {/* Form Title */}
        //     <h3 className="text-lg font-semibold mb-2">Add/Update Review</h3>

        //     {/* Review Form */}
        //     <form onSubmit={handleSubmit}>
        //         {/* Textarea for review input */}
        //         <textarea
        //             value={text}
        //             onChange={(e) => setText(e.target.value)}
        //             placeholder="Write your review"
        //             className="w-full p-2 border border-gray-300 rounded mb-4"
        //             rows={4}
        //         />

        //         {/* Submit Button */}
        //         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        //             Submit Review
        //         </button>
        //         <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
        //             Cancel
        //         </button>
        //     </form>
        // </div>
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Popup Container */}
            <div
                className="bg-[#071005]  rounded-2xl shadow-lg p-6 w-[331px] h-[469px] max-w-md relative animate-fade-in"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                {/* Close Button */}
                <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <div className="flex flex-col h-[100%] justify-center">

                    {/* Form Title */}
                    <h3 className="text-[17.89px] text-white font-semibold mb-4 text-center">Review</h3>

                    {/* Review Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Textarea for review input */}
                        <label htmlFor="" className="text-[12px] text-[#D9D9D9] flex">Leave a Review</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Write your review..."
                            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows={4}
                        />

                        {/* Buttons */}
                        <div className="flex justify-center ">
                            <button
                                type="submit"
                                className="bg-[#A8FF00] w-[167px] h-[49px] rounded-full px-4 py-2"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewForm;
