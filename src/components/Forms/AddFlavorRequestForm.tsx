"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createFlavorRequest } from "@/redux/flavorRequestSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { FaPlus } from "react-icons/fa";

const AddFlavorRequestForm = () => {

    // State to control flavor request form visibility
    const [isFormVisible, setIsFormVisible] = useState(false);

    // State to manage form input fields
    const [flavorName, setFlavorName] = useState("");
    const [description, setDescription] = useState("");
    const [referenceURL, setReferenceURL] = useState("");

    // State for displaying success/error messages
    const [message, setMessage] = useState("");

    // Redux dispatch function
    const dispatch = useDispatch<AppDispatch>();

    // Get the logged-in user details from Redux store
    const user = useSelector((state: RootState) => state?.appUser?.appUser);

    // Get the loading state from Redux store to show submission progress
    const loading = useSelector((state: RootState) => state.flavorRequests.loading);

    // Handles form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents page reload on form submission

        // Ensure that a user is signed in before allowing submission
        if (!user) {
            setMessage("You must be signed in to submit a flavor request.");
            return;
        }

        // Create an object with form data
        const flavorData = {
            flavorName,
            description,
            referenceURL,
            createdByUserId: user.uid,
            voteUserIds: [],
            votes: 0,
        };

        try {
            // Dispatch the Redux action to create a flavor request
            await dispatch(createFlavorRequest(flavorData)).unwrap();

            // Show success message
            setMessage("Flavor request submitted successfully!");

            // Reset form fields
            setFlavorName("");
            setDescription("");
            setReferenceURL("");

            // Hide the form after successful submission
            setIsFormVisible(false);
        } catch (error) {
            console.error("Error submitting flavor request:", error);
            setMessage("Failed to submit flavor request. Try again.");
        }
    };

    return (
        <div>
            <div className="flex items-center gap-8">
                <button>
                    <img
                        src="assests/icons/star-vote-icon.svg"
                        alt="vote-icon"
                        className="w-[63px] h-[63px]"
                    />
                </button>
                {/* Floating Plus Button to open/close the form */}
                <button
                    onClick={() => setIsFormVisible(!isFormVisible)}
    
                >
                    <img
                        src="/assests/icons/new-request-icon.svg"
                        alt="Request icon"
                        className="w-[63px] h-[63px]"
                    />
                </button>
            </div>

            {/* Flavor Request Form - Appears when isFormVisible is true */}
            {isFormVisible && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#071005] shadow-[4px_4px_10px_#2f3e0d] w-[331px] h-[450px] rounded-2xl  p-6 relative">

                        {/* Close Button to hide the form */}
                        <button
                            onClick={() => setIsFormVisible(false)}
                            className="absolute w-[16.05px] h-[16.05px] top-3 right-3 text-[#BCB7B7] font-bold"
                        >
                            ✕
                        </button>

                        <h2 className="text-[17.89px] text-white font-semibold mb-4 text-center">Request New Flavor</h2>

                        {/* Display success or error message */}
                        {message && <p className="text-green-600 text-center mb-4">{message}</p>}

                        {/* Form for submitting a new flavor request */}
                        <form onSubmit={handleSubmit} className="space-y-2">

                            {/* Input field for flavor name */}
                            <div>
                                <label className="block text-[#d9d9d9] text-[12px] font-medium mb-2">Flavor Name:</label>
                                <input
                                    type="text"
                                    value={flavorName}
                                    onChange={(e) => setFlavorName(e.target.value)}
                                    required
                                    className="w-[293px] h-[49px] px-4 py-2 rounded-2xl"
                                />
                            </div>

                            {/* Input field for description */}
                            <div>
                                <label className="block text-[#d9d9d9] text-[12px] font-medium mb-2">Description:</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows={4}
                                    className="w-[293px] h-[87px] px-4 py-2 rounded-2xl"
                                />
                            </div>

                            {/* Input field for reference URL */}
                            <div>
                                <label className="block text-[#d9d9d9] text-[12px] font-medium mb-2">Reference URL:</label>
                                <input
                                    type="url"
                                    value={referenceURL}
                                    onChange={(e) => setReferenceURL(e.target.value)}
                                    className="w-[293px] h-[49px] px-4 py-2 rounded-2xl"
                                />
                            </div>

                            {/* Submit button */}
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-2 w-[163px] h-[49px] py-3 bg-[#a8ff00] text-[#101901] rounded-full text-[16px] font-semibold"
                                >
                                    {loading ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddFlavorRequestForm;
