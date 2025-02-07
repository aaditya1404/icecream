"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "@/redux/reviewsSlice";
import { RootState, AppDispatch } from "@/redux/store";
import ReviewForm from "@/components/ReviewForm";
import { addReview, updateReview } from "@/firebase/firestore"; 
import { auth } from "@/firebase/clientApp";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        id: string;
        name: string;
        photoURL: string;
        description: string;
        price: number;
        productCategory: string;
        isAvailable: boolean;
    } | null;
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {

    const [error, setError] = useState<string | null>(null); 
    const { reviews, loading } = useSelector((state: RootState) => state.reviews); 
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const [reviewToUpdate, setReviewToUpdate] = useState<any | null>(null); 
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (product) {
            dispatch(fetchReviews(product.id)); 
        }
    }, [product, dispatch]); 


    const handleAddReview = async (text: string, isGood: boolean) => {
        if (!product || !auth.currentUser) return;

        const reviewData = {
            text,
            productId: product.id,
            authorUserId: auth.currentUser.uid,
            isGood,
        };

        try {
            const newReview = await addReview(reviewData); // Get reviewId from Firestore
            dispatch(fetchReviews(product.id)); // Re-fetch reviews
            setIsReviewFormOpen(false);
        } catch (error) {
            setError("Failed to add review.");
        }
    };

    const handleUpdateReview = async (text: string, isGood: boolean) => {
        if (!reviewToUpdate?.reviewId) {
            console.error("Review ID is missing. Cannot update.");
            setError("Review ID is missing. Cannot update.");
            return;
        }

        try {
            await updateReview(reviewToUpdate.reviewId, { text, isGood }); 
            dispatch(fetchReviews(product?.id || ""));
            setIsReviewFormOpen(false);
            setReviewToUpdate(null);
        } catch (error) {
            console.error("Error updating review:", error);
            setError("Failed to update review.");
        }
    };



    const handleEditReview = (review: any) => {
        console.log("Editing review = ", review);

        setReviewToUpdate(review); 
        setIsReviewFormOpen(true); 
    };

    if (!isOpen || !product) return null; 

    return (
        <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()} 
            >
                <button
                    className="absolute top-2 right-2 text-gray-600 text-xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                {product?.photoURL && product?.photoURL !== "" ? (
                    <img src={product.photoURL} alt={product.name} className="w-full h-40 object-cover rounded-t-lg" />
                ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-gray-200 text-gray-600 rounded-t-lg">
                        No Image Available
                    </div>
                )}
                <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <p><strong>Category:</strong> {product.productCategory}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <p className={`mt-2 font-medium ${product.isAvailable ? "text-green-500" : "text-red-500"}`}>
                    {product.isAvailable ? "Available" : "Out of Stock"}
                </p>

                {/* Display Reviews */}
                <div className="mt-3">
                    <h4 className="text-lg font-semibold">Reviews</h4>
                    {loading ? (
                        <p>Loading reviews...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : reviews.length === 0 ? (
                        <p>No reviews yet.</p>
                    ) : (
                        <ul className="h-40 overflow-y-auto border p-2">
                            {reviews.map((review) => (
                                <li key={review.reviewId} className="border-b pb-2 mb-2">
                                    <p className="font-semibold">{review.authorUserId}</p>
                                    <p>{review.text}</p>
                                    <p className={`mt-1 text-sm ${review.isGood ? "text-green-500" : "text-red-500"}`}>
                                        {review.isGood ? "Good Review" : "Negative Review"}
                                    </p>
                                    <button
                                        className="text-blue-500 mt-2"
                                        onClick={() => handleEditReview(review)}
                                    >
                                        Update Review
                                    </button>
                                </li>
                            ))}
                        </ul>

                    )}
                </div>

                {/* Add Review Button */}
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    onClick={() => setIsReviewFormOpen(true)}
                >
                    Add Review
                </button>

                {/* Review Form Modal */}
                {isReviewFormOpen && (
                    <ReviewForm
                        onSubmit={reviewToUpdate ? handleUpdateReview : handleAddReview} // Use the appropriate handler
                        onClose={() => setIsReviewFormOpen(false)} // Close the form when canceling
                        initialText={reviewToUpdate?.text || ""} // Pre-fill text if editing
                        initialIsGood={reviewToUpdate?.isGood || false} // Pre-fill isGood if editing
                    />
                )}
            </div>
        </div>
    );
};

export default ProductModal;




