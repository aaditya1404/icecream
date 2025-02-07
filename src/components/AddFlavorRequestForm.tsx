"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createFlavorRequest } from "@/redux/flavorRequestSlice";
import { RootState, AppDispatch } from "@/redux/store";

const AddFlavorRequestForm = () => {
    // Form State
    const [flavorName, setFlavorName] = useState("");
    const [description, setDescription] = useState("");
    const [referenceURL, setReferenceURL] = useState("");
    const [message, setMessage] = useState("");

    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state?.appUser?.appUser);
    const loading = useSelector((state: RootState) => state.flavorRequests.loading);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setMessage("You must be signed in to submit a flavor request.");
            return;
        }

        const flavorData = {
            flavorName,
            description,
            referenceURL,
            createdByUserId: user.uid,
            voteUserIds: [],
            votes: 0,
        };

        try {
            await dispatch(createFlavorRequest(flavorData)).unwrap();
            setMessage("Flavor request submitted successfully!");
            setFlavorName("");
            setDescription("");
            setReferenceURL("");
        } catch (error) {
            console.error("Error submitting flavor request:", error);
            setMessage("Failed to submit flavor request. Try again.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center">Request a New Flavor</h2>

            {message && <p className="text-green-600 text-center mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Flavor Name */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Flavor Name:</label>
                    <input
                        type="text"
                        value={flavorName}
                        onChange={(e) => setFlavorName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Reference URL */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Reference URL:</label>
                    <input
                        type="url"
                        value={referenceURL}
                        onChange={(e) => setReferenceURL(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition disabled:bg-gray-300"
                    >
                        {loading ? "Submitting..." : "Submit Request"}
                    </button>
                </div>
            </form>
        </div>

    );
};

export default AddFlavorRequestForm;
