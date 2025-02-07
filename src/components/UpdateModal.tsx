"use client";
import React, { useState, useEffect } from "react";

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; image: File | null }) => void;
    initialData: { name: string; photoURL: string };
}

const UpdateModal = ({ isOpen, onClose, onSubmit, initialData }: UpdateModalProps) => {
    const [name, setName] = useState(initialData.name);
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, image });
        onClose(); 
    };

    return (
        <div
            className={`fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 ${isOpen ? "block" : "hidden"}`}
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
                onClick={(e) => e.stopPropagation()} 
            >
                <button
                    className="absolute top-4 right-4 text-gray-600"
                    onClick={onClose}
                >
                    &times;
                </button>

                <h3 className="text-xl font-semibold mb-4 text-center">Update Information</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Photo URL:</label>
                        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                    </div>

                    <div className="text-center">
                        <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={onClose}>Cancel</button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
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
