"use client";
import { useState, useEffect } from "react";

interface ReviewFormProps {
    onSubmit: (text: string, isGood: boolean) => void;
    onClose: () => void;
    initialText: string; 
    initialIsGood: boolean; 
}

const ReviewForm = ({ onSubmit, onClose, initialText, initialIsGood }: ReviewFormProps) => {
    const [text, setText] = useState(initialText); 
    const [isGood, setIsGood] = useState(initialIsGood);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() === "") {
            alert("Review text cannot be empty.");
            return;
        }
        onSubmit(text, isGood); 
        setText(""); 
        setIsGood(false); 
    };

    useEffect(() => {
        setText(initialText); 
        setIsGood(initialIsGood); 
    }, [initialText, initialIsGood]);

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Add/Update Review</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your review"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    rows={4}
                />
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        checked={isGood}
                        onChange={() => setIsGood(!isGood)}
                        className="mr-2"
                    />
                    <label className="text-sm">Is this a good review?</label>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                    Submit Review
                </button>
                <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
