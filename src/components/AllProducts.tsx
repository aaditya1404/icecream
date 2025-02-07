"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/productsSlice";
import { RootState, AppDispatch } from "@/redux/store";
import ProductCard from "./ProductCard";
import ProductModal from "@/components/ProductModal";

const AllProducts = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, loading, error } = useSelector((state: RootState) => state.products);

    const [selectedProduct, setSelectedProduct] = useState(null); // State for the selected product
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const openModal = (product: any) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    return (
        <div className="max-w-screen-xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6">All Products</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} onClick={() => openModal(product)}>
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                photoURL={product.photoURL}
                            />
                        </div>
                    ))}
                </div>
            )}
            <ProductModal
                isOpen={isModalOpen}
                onClose={closeModal}
                product={selectedProduct}
            />
        </div>
    );
};

export default AllProducts;
