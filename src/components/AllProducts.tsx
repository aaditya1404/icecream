"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/productsSlice";
import { RootState, AppDispatch } from "@/redux/store";
import ProductCard from "./Cards/ProductCard";
import ProductModal from "@/components/ProductModal";
import ParabolicCardView from "./ParabolicCardView";
import CircularScrollbar from "./CircularScrollbar";

const AllProducts = () => {

    // Parabolic scroll states
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollWidth, setScrollWidth] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const cardWidth = 220; // Card width plus margin

    // Redux dispatch function to trigger actions
    const dispatch = useDispatch<AppDispatch>();

    // Extracting products, loading state, and error message from the Redux store
    const { products, loading, error } = useSelector((state: RootState) => state.products);

    // State to store the currently selected product for modal display
    const [selectedProduct, setSelectedProduct] = useState(null);

    // State to manage the visibility of the modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // useEffect hook to fetch products when the component mounts
    useEffect(() => {
        dispatch(fetchProducts()); // Dispatch Redux action to fetch product data from the backend or API
    }, [dispatch]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const updateScrollMetrics = () => {
            setScrollWidth(container.scrollWidth - container.clientWidth + cardWidth);
        };

        updateScrollMetrics();
        window.addEventListener("resize", updateScrollMetrics);
        return () => window.removeEventListener("resize", updateScrollMetrics);
    }, [products]);

    // Open modal and set selected product
    const openModal = (product: any) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Close modal and reset selected product
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleSliderChange = (position: number) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = position;
        }
    };

    return (
        // <div className="">
        <div className="main-container">

            <div className="scroll-container-product flex items-center" ref={scrollContainerRef}>
                {/* Dummy Start Card */}
                <div className="parabolic-card opacity-0 pointer-events-none w-[220px]"></div>

                {products.length === 0 ? (
                    <p></p>
                ) : (
                    // <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div className="flex flex-row space-x-8">
                        {/* Dummy Start Card */}
                        <div className="parabolic-card opacity-0 pointer-events-none w-[15vw]"></div>
                        {products.map((product) => (
                            <div key={product.id} className="parabolic-card" onClick={() => openModal(product)}>
                                <ProductCard
                                    id={product.id}
                                    name={product.name}
                                    photoURL={product.photoURL}
                                    rating={product.rating}
                                />
                            </div>
                        ))}
                         {/* Dummy Start Card */}
                         <div className="parabolic-card opacity-0 pointer-events-none w-[70px]"></div>
                    </div>
                )}
            </div>

            <ParabolicCardView containerRef={scrollContainerRef} onScrollPositionChange={setScrollPosition} />
            <CircularScrollbar scrollWidth={scrollWidth} scrollPosition={scrollPosition} onScrollChange={handleSliderChange} />

            <div>
                <p className="text-[10px] text-[#bcb7b7] font-medium text-center ">Tap to open</p>
            </div>

            <div className="flex items-center justify-center translate-y-7 ">
                <button>
                    <img src="/assests/icons/filter-button.svg" alt="filterbutton" className="w-[69px] h-[69px]" />
                </button>
                {/* <button className="translate-y-5"> */}
                <button className="">
                    <img src="/assests/icons/search.svg" alt="searchicon" className="w-[69px] h-[69px]" />
                </button>
            </div>

            {/* Modal for product details */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={closeModal}
                product={selectedProduct}
            />
        </div>
    );
};

export default AllProducts;
