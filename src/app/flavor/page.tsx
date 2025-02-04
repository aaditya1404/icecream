"use client";
import Card from '@/components/Card';
import { getIceCreams } from '@/data/db';
import { useEffect, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface Review {
    user: string;
    profilePhoto: string;
    review: string;
    rating: number;
}

interface IceCream {
    id: number;
    name: string;
    flavor: string;
    rating: number;
    image: string;
    reviews: Review[];
}

const Flavor: React.FC = () => {

    const [iceCreams, setIceCreams] = useState<IceCream[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedIceCream, setSelectedIceCream] = useState<IceCream | null>(null);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState<boolean>(false);

    const [userName, setUserName] = useState<string>("");
    const [imageURL, setImageURL] = useState<string>("");
    const [rating, setRating] = useState<number>(5);
    const [reviewText, setReviewText] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const data = await getIceCreams();
            setIceCreams(data);
        };
        fetchData();
    }, []);

    const handleAddReview = () => {
        if (!selectedIceCream) return;

        const newReview: Review = {
            user: userName,
            profilePhoto: imageURL || "https://via.placeholder.com/50",
            review: reviewText,
            rating: rating,
        };

        const updatedIceCreams = iceCreams.map((ice) =>
            ice.id === selectedIceCream.id
                ? { ...ice, reviews: [...ice.reviews, newReview] }
                : ice
        );

        setIceCreams(updatedIceCreams);
        setSelectedIceCream({ ...selectedIceCream, reviews: [...selectedIceCream.reviews, newReview] });

        setUserName("");
        setImageURL("");
        setRating(5);
        setReviewText("");
        setIsReviewFormOpen(false);
    };

    console.log(selectedIceCream?.reviews);

    return (
        <div className='min-h-screen p-6'>
            <div className='flex space-x-4 overflow-x-auto scrollbar-hide p-4'>
                {
                    iceCreams.filter((ice) => ice.name.toLowerCase().includes(searchQuery)).map((iceCream) => {
                        return (
                            <div className='cursor-pointer' onClick={() => setSelectedIceCream(iceCream)}>
                                <Card key={iceCream.id} iceCream={iceCream} />
                            </div>
                        )
                    })
                }
            </div>

            <button className="bg-red-400 rounded-full p-4" onClick={() => setIsSearchOpen(true)}>
                <FaSearch />
            </button>

            {
                isSearchOpen && (
                    <div className="fixed top-0 left-0 w-full h-[20vh] bg-white shadow-lg p-4 flex flex-col">
                        <button onClick={() => setIsSearchOpen(false)} className="text-red-500 text-xl">
                            <FaTimes />
                        </button>
                        <input
                            type="text"
                            placeholder="Search for an ice cream..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                    </div>
                )
            }

            {
                selectedIceCream && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-3/4 max-w-md">
                            <button onClick={() => setSelectedIceCream(null)} className="text-red-500 text-xl absolute top-4 right-4">
                                <FaTimes />
                            </button>
                            <h2 className="text-xl font-bold mt-4">{selectedIceCream.name}</h2>
                            <p className="text-gray-700">Flavor: {selectedIceCream.flavor}</p>
                            <h3 className="text-lg font-semibold mt-4">Reviews:</h3>
                            <div>
                                {
                                    selectedIceCream?.reviews.length && (
                                        selectedIceCream?.reviews.map((review, index) => (
                                            <div key={index} className="flex items-center space-x-4 mt-2 border-b pb-2">
                                                <div>
                                                    <p className="font-semibold">{review.user}</p>
                                                    <p className="text-sm">{review.review}</p>
                                                    <p className="text-yellow-500">⭐ {review.rating}/5</p>
                                                </div>
                                            </div>
                                        ))
                                    )
                                }
                            </div>
                            <button onClick={() => setIsReviewFormOpen(true)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                                Add Review
                            </button>
                        </div>
                    </div>
                )
            }

            {
                isReviewFormOpen && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-3/4 max-w-md">
                            <h2 className="text-lg font-bold">Add a Review</h2>
                            <input type="text" placeholder="Name" value={userName} onChange={(e) => setUserName(e.target.value)} className="border p-2 w-full mt-2" />
                            <input type="text" placeholder="Image URL" value={imageURL} onChange={(e) => setImageURL(e.target.value)} className="border p-2 w-full mt-2" />
                            <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border p-2 w-full mt-2" />
                            <textarea placeholder="Review" value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="border p-2 w-full mt-2"></textarea>
                            <button onClick={handleAddReview} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Submit</button>
                        </div>
                    </div>
                )
            }

        </div>
    );
};

export default Flavor;
