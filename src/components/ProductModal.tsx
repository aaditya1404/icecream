"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "@/redux/reviewsSlice";
import { RootState, AppDispatch } from "@/redux/store";
import ReviewForm from "@/components/Forms/ReviewForm";
import { addReview, updateReview, getUserById } from "@/firebase/firestore";
import { auth } from "@/firebase/clientApp";
import LottieLoader from "./LottieLoader";
import ReviewCard from "./Cards/ReviewCrad";

// Define the props interface for ProductModal
interface ProductModalProps {
    isOpen: boolean; // Controls modal visibility
    onClose: () => void; // Function to close the modal
    product: {
        id: string;
        name: string;
        photoURL: string;
        description: string;
        price: number;
        productCategory: string;
        isAvailable: boolean;
    } | null; // Product details or null
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {

    // State for error handling
    const [error, setError] = useState<string | null>(null);

    // Extract reviews and loading status from Redux store
    const { reviews, loading } = useSelector((state: RootState) => state.reviews);

    // State to manage review form visibility
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

    // State to track the review being edited
    const [reviewToUpdate, setReviewToUpdate] = useState<any | null>(null);

    // State to store user details (name & profile picture)
    const [userDetails, setUserDetails] = useState<{ [key: string]: { name: string; photoURL: string } }>({});

    // State to control update modal visibility
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const dispatch = useDispatch<AppDispatch>();

    // Fetch reviews when a product is selected
    useEffect(() => {
        if (product) {
            dispatch(fetchReviews(product.id));
        }
    }, [product, dispatch]);

    // Fetch user details for reviews
    useEffect(() => {
        const fetchUserDetails = async () => {
            const userMap: { [key: string]: { name: string; photoURL: string } } = {};
            for (const review of reviews) {
                if (!userDetails[review.authorUserId]) { // Fetch only if not already fetched
                    const userData = await getUserById(review.authorUserId);
                    if (userData) {
                        userMap[review.authorUserId] = {
                            name: userData.name || "",
                            photoURL: userData.photoURL || "", // Fallback profile picture
                        };
                    }
                }
            }
            setUserDetails((prev) => ({ ...prev, ...userMap }));
        };

        if (reviews.length > 0) {
            fetchUserDetails();
        }
    }, [reviews]);

    // Handle adding a new review
    const handleAddReview = async (text: string) => {
        if (!product || !auth.currentUser) return;

        const reviewData = {
            text,
            productId: product.id,
            authorUserId: auth.currentUser.uid,
            isGood: true,
        };

        try {
            await addReview(reviewData); // Store review in Firestore
            dispatch(fetchReviews(product.id)); // Refresh reviews list
            setIsReviewFormOpen(false); // Close form after submission
        } catch (error) {
            setError("Failed to add review.");
        }
    };

    // Handle updating an existing review
    const handleUpdateReview = async (text: string) => {
        if (!reviewToUpdate?.reviewId) {
            setError("Review ID is missing. Cannot update.");
            return;
        }

        try {
            await updateReview(reviewToUpdate.reviewId, { text });
            dispatch(fetchReviews(product?.id || "")); // Refresh reviews
            setIsReviewFormOpen(false);
            setReviewToUpdate(null);
        } catch (error) {
            console.error("Error updating review:", error);
            setError("Failed to update review.");
        }
    };

    // Open review update form with selected review data
    const handleEditReview = (review: any) => {
        setReviewToUpdate(review);
        setIsReviewFormOpen(true);
        setIsUpdateModalOpen(true);
    };

    // If modal is not open or product is null, do not render
    if (!isOpen || !product) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-[#071005] rounded-[20px] shadow-lg w-[331px] h-[469px]  relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <div className="sticky top-0 w-full flex justify-end p-4">
                    <button
                        className="text-[#BCB7B7] text-[16.05px]"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>

                <div className="pb-4 z-10 flex flex-col items-center">
                    {/* Product Name */}
                    <h3 className="text-[17.89px] font-semibold mb-2 text-center text-white">
                        {product.name}
                    </h3>

                    {/* Circular Container */}
                    <div className="w-[120px] h-[120px] border-[3px] border-[#A8FF00] rounded-full flex items-center justify-center relative overflow-hidden">
                        <svg
                            width="91.19"
                            height="188.96"
                            viewBox="0 0 117 241"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="relative translate-y-10"
                        >
                            {/* Define mask */}
                            <mask id="mask0_285_344" maskUnits="userSpaceOnUse" x="0" y="0" width="117" height="241">
                                <path d="M104.735 35.4983C103.45 15.5353 86.8845 0 66.8833 0H49.1342C29.133 0 12.5671 15.5353 11.2821 35.4983L0.0600131 210.14C-0.996029 226.54 12.02 240.421 28.4586 240.421H87.5716C104.01 240.421 117.026 226.54 115.97 210.14L104.748 35.4983H104.735Z" fill="white" />
                            </mask>
                            <g mask="url(#mask0_285_344)">
                                <path d="M141.977 -37.8901H-25.9592V282.091H141.977V-37.8901Z" fill="#FCE173" />
                            </g>

                            {/* Image with applied mask */}
                            <image
                                href={product?.photoURL}
                                width="200"
                                height="500"
                                x="0"
                                y="-30"
                                preserveAspectRatio="xMidYMid slice"
                                className="w-full h-full object-cover"
                                mask="url(#mask0_285_344)"
                            />
                        </svg>
                    </div>
                </div>

                <div className="bg-white overflow-y-auto w-[331px] h-[250px] rounded-2xl p-6">
                    <p className="text-[12px] font-medium text-[#2F3E0D]">Description</p>
                    <p className="text-[12px] text-[#35392D] mb-4">{product.description}</p>
                    {/* Reviews Section */}
                    <div className="mt-3">
                        <h4 className="text-[12px] font-medium text-[#171814]">Reviews</h4>
                        {loading ? (
                            <LottieLoader />
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : reviews.length === 0 ? (
                            <p>No reviews yet.</p>
                        ) : (
                            <ul className=" mt-2">
                                {reviews.map((review) => (
                                    <ReviewCard
                                        key={review.reviewId}
                                        review={review}
                                        userDetails={userDetails}
                                        onEdit={handleEditReview}
                                    />
                                ))}
                            </ul>

                        )}
                    </div>
                </div>

                {/* Add Review Button */}
                <button
                    className="bg-[#A8FF00] text-[#101901] font-medium text-[16px] px-4 py-2 rounded-full mt-4 w-[167px] h-[49px]"
                    onClick={() => setIsReviewFormOpen(true)}
                >
                    Add Review
                </button>

                {/* Update Review Modal */}
                {isUpdateModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                            <h3 className="text-lg font-semibold mb-4">Update Review</h3>
                            <ReviewForm
                                onSubmit={handleUpdateReview} // Update review function
                                onClose={() => setIsUpdateModalOpen(false)} // Close modal
                                initialText={reviewToUpdate?.text || ""} // Prefill review text
                            />
                        </div>
                    </div>
                )}

                {/* Review Form Modal (for adding new reviews) */}
                {isReviewFormOpen && (
                    <ReviewForm
                        onSubmit={handleAddReview} // Add new review
                        onClose={() => setIsReviewFormOpen(false)} // Close the form when canceling
                        initialText={reviewToUpdate?.text || ""} // Pre-fill text if editing
                    />
                )}
            </div>
        </div>
    );
};

export default ProductModal;




