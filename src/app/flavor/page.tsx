"use client";
import Card from '@/components/Card';
import { getIceCreams } from '@/data/db';
import { useEffect, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface IceCream {
    id: number;
    name: string;
    flavor: string;
    rating: number;
    image: string;
}

const Flavor: React.FC = () => {

    const [iceCreams, setIceCreams] = useState<IceCream[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredIceCreams, setFilteredIceCreams] = useState<IceCream[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getIceCreams();
            setIceCreams(data);
        };
        fetchData();
    }, []);

    return (
        <div className='min-h-screen p-6'>
            <div className='flex space-x-4 overflow-x-auto scrollbar-hide p-4'>
                {
                    iceCreams.filter((ice) => ice.name.toLowerCase().includes(searchQuery)).map((iceCream) => (
                        <Card key={iceCream.id} iceCream={iceCream} />
                    ))
                }
            </div>

            {/* Search button */}
            <button className="bg-red-400 rounded-full p-4" onClick={() => setIsSearchOpen(true)}>
                <FaSearch />
            </button>
            {
                isSearchOpen && (
                    <div className="fixed top-0 left-0 w-full h-[20vh] bg-white shadow-lg p-4 flex flex-col">
                        {/* Close Button */}
                        <button onClick={() => setIsSearchOpen(false)} className="text-red-500 text-xl">
                            <FaTimes />
                        </button>

                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search for an ice cream..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                    </div>
                )}

        </div>
    );
};

export default Flavor;
