import React, { useState } from "react";
import { SlPicture } from "react-icons/sl";

// Define the props interface for the UserInfoForm component
interface UserInfoFormProps {
    onSubmit: (data: { name: string; image: File | null }) => void; // Function to handle form submission
}

// Functional component for collecting user information
const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit }) => {

    // State to manage user name input
    const [name, setName] = useState("");

    // State to manage uploaded image file
    const [image, setImage] = useState<File | null>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // Show preview
        }
    };

    // Handles form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate that the name field is not empty
        if (!name) {
            alert("Name and phone are required!");
            return;
        }

        // Pass the user input data to the parent component
        onSubmit({ name, image });
    };

    return (
        // <form
        //     onSubmit={handleSubmit}
        // >
        //     {/* Image Upload Input Field */}
        //     <div>
        //         <label>Upload Photo:</label>
        //         <input
        //             type="file"
        //             accept="image/*"
        //             onChange={(e) => setImage(e.target.files?.[0] || null)}
        //         />
        //     </div>
        //     {/* Name Input Field */}
        //     <div>
        //         <label>Name:</label>
        //         <input
        //             type="text"
        //             value={name}
        //             onChange={(e) => setName(e.target.value)}
        //             placeholder="Enter your name"
        //             required
        //         />
        //     </div>
        //     {/* Submit Button */}
        //     <button type="submit">Submit</button>
        // </form>
        <form
            onSubmit={handleSubmit}
            className="space-y-6 flex flex-col items-center w-full h-full p-6 bg-[#071005] shadow-[4px_4px_10px_#2f3e0d] rounded-lg max-w-sm mx-auto"
        >
            {/* Circular Image Upload */}
            <div className="relative w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden bg-white">
                {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-400 text-4xl">
                        <SlPicture />
                    </span>
                )}
            </div>
            <label
                htmlFor="file-upload"
                className="mt-2 text-[#a8ff00] cursor-pointer hover:underline"
            >
                Upload Picture
            </label>
            <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
            />

            {/* Name Input */}
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 borde rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a8ff00]"
                required
            />

            {/* Submit Button */}
            <button
                type="submit"
                // className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
                className="bg-[#a8ff00] text-black font-semibold py-2 px-8 rounded-full transition"
            >
                Submit
            </button>
        </form>
    );
};

export default UserInfoForm;
