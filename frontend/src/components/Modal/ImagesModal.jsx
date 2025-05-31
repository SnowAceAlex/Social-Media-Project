import React, { useState } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

function ImagesModal({ images, onClose, initialIndex = 0}) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const prevImage = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const nextImage = () => {
        if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full z-[99] bg-black/80 flex items-center justify-center">
            {/* Close button */}
            <IoCloseOutline
                size={45}
                onClick={onClose}
                title="Close"
                className="absolute right-6 top-4 z-20 p-1 text-white cursor-pointer"
            />

            {/* Image slider */}
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                    <div
                        className="absolute inset-0 z-0 blur-md scale-105 transition-all duration-500 brightness-50"
                        style={{
                            backgroundImage: `url(${images[currentIndex]})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />

                    <div
                        className="flex transition-transform duration-500 ease-in-out h-full"
                        style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                            width: `${images.length * 100}%`
                        }}
                    >
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Modal image ${index + 1}`}
                                className="w-full object-contain h-full flex-shrink-0"
                            />
                        ))}
                    </div>

                <div className="absolute bottom-2 flex justify-center gap-2 p-1 rounded-full bg-black/50">
                {images.length > 1 &&
                    images.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-200 ${
                                index === currentIndex ? "bg-white scale-110" : "bg-gray-400/50"
                            }`}
                        />
                    ))}
                </div>

                {/* Prev Button */}
                {currentIndex > 0 && (
                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full"
                        title="Previous"
                    >
                        <HiChevronLeft size={32} />
                    </button>
                )}

                {/* Next Button */}
                {currentIndex < images.length - 1 && (
                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full"
                        title="Next"
                    >
                        <HiChevronRight size={32} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default ImagesModal;
