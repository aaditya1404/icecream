"use client";
import Card from '@/components/Card';
import { getIceCreams } from '@/data/db';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface IceCream {
    id: number;
    name: string;
    flavor: string;
    rating: number;
    image: string;
}

const Flavor: React.FC = () => {
    const [iceCreams, setIceCreams] = useState<IceCream[]>([]);

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
                    iceCreams.map((iceCream) => (
                        <Card key={iceCream.id} iceCream={iceCream} />
                    ))
                }
            </div>
            <button className="bg-red-400 rounded-full p-4">
                <FaSearch />
            </button>
        </div>
    );
};

export default Flavor;
