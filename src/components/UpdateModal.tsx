"use client";
import React, { useState, useEffect } from "react";
import { SlPicture } from "react-icons/sl";

// Define the props interface for the UpdateModal component
interface UpdateModalProps {
    isOpen: boolean; // Controls modal visibility
    onClose: () => void; // Function to close the modal
    onSubmit: (data: { name: string; image: File | null }) => void; // Function to handle form submission
    initialData: { name: string; photoURL: string }; // Initial data for pre-filling the form
}

// Functional component for updating user information
const UpdateModal = ({ isOpen, onClose, onSubmit, initialData }: UpdateModalProps) => {

    // State for managing name input
    const [name, setName] = useState(initialData.name);

    // State for managing profile image file
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData.photoURL);

    // Handles image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };


    // Handles form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, image }); // Pass the updated data to the parent component
        onClose(); // Close the modal after submission
    };

    return (
        <div
            className={`fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4 sm:p-6 ${isOpen ? "block" : "hidden"}`}
            onClick={onClose}
        >
            {/* Modal container */}
            <div
                className="bg-[#071005] p-6 rounded-lg shadow-lg w-[90%] max-w-sm sm:max-w-md md:max-w-lg relative"
                onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            >
                {/* Close button */}
                <button
                    className="absolute top-4 right-4 text-gray-600 text-lg sm:text-xl"
                    onClick={onClose}
                >
                    &times;
                </button>

                {/* Profile Image */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden sm:w-28 sm:h-28">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-400 text-3xl sm:text-4xl"><SlPicture /></span>
                        )}
                    </div>

                    {/* Upload Image Button */}
                    <label className="mt-3 text-[#a8ff00] cursor-pointer hover:underline text-sm sm:text-base">
                        Upload Image
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                </div>



                {/* Update Form */}
                <form onSubmit={handleSubmit} className="space-y-5 mt-4">

                    {/* Name Input Field */}
                    <div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Enter Your name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a8ff00] text-sm sm:text-base"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="text-center space-x-3 sm:space-x-4">
                        <button
                            className="bg-[#759e22] text-black font-semibold py-2 px-6 sm:px-8 rounded-full transition hover:bg-[#5c7d1b]"
                            onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-[#a8ff00] text-black font-semibold py-2 px-6 sm:px-8 rounded-full transition hover:bg-[#90e600]"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateModal;
