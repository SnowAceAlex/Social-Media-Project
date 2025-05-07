// components/PostImagesCarousel.jsx
import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const PostImagesCarousel = ({ images }) => {
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    if (!images || images.length === 0) return null;
    
    return (
        <div className="w-full relative flex items-center justify-center overflow-hidden rounded-lg">
            {/* Slide wrapper */}
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                    transform: `translateX(-${currentImgIndex * 100}%)`,
                    width: `${images.length * 100}%`,
                }}
            >
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Post image ${index + 1}`}
                        className="w-full object-cover flex-shrink-0"
                    />
                ))}
            </div>

            {/* Indicators */}
            <div className="absolute bottom-2 w-full flex justify-center gap-2">
                {images.length > 1 &&
                    images.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentImgIndex(index)}
                            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-200 ${
                                index === currentImgIndex ? "bg-white scale-110" : "bg-gray-400/50"
                            }`}
                        />
                    ))}
            </div>

            {/* Prev / Next buttons */}
            {images.length > 1 && currentImgIndex > 0 && (
                <button
                    onClick={() => setCurrentImgIndex((prev) => prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-dark-button/50 cursor-pointer text-white rounded-full hover:bg-opacity-70"
                    title="Previous"
                >
                    <HiChevronLeft size={24} />
                </button>
            )}
            {images.length > 1 && currentImgIndex < images.length - 1 && (
                <button
                    onClick={() => setCurrentImgIndex((prev) => prev + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-dark-button/50 cursor-pointer text-white rounded-full hover:bg-opacity-70"
                    title="Next"
                >
                    <HiChevronRight size={24} />
                </button>
            )}
        </div>
    );
};

export default PostImagesCarousel;
