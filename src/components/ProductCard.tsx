"use client";

interface ProductCardProps {
    id: string;
    name: string;
    photoURL: string;
}

const ProductCard = ({ id, name, photoURL }: ProductCardProps) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 hover:shadow-xl transform hover:scale-105 transition duration-300">
            {photoURL ? (
                <img src={photoURL} alt={name} className="w-full h-48 object-cover rounded-t-lg" />
            ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-600 rounded-t-lg">
                    No Image Available
                </div>
            )}
            <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            </div>
        </div>
    );
};

export default ProductCard;

