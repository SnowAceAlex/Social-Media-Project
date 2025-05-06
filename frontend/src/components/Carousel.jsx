import { useState, useEffect } from "react";

const Carousel = () => {
    const images = [
        "https://images.unsplash.com/photo-1577080353772-1e76f4de0627?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTU5fHxoYXBweXxlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1740520224737-9838d33c2fb2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMzJ8fHxlbnwwfHx8fHw%3D",
        "https://images.unsplash.com/photo-1741289512974-4c2ad13598e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0OHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1741290606057-dfae12914684?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyOHx8fGVufDB8fHx8fA%3D%3D",
    ];

    const captions = [
        "Sharing pure joy with my little one-laughter!",
        "Lost in the beauty of the mountains, with my best companion by my side",
        "I love the vibrant colors and fresh scents of these gorgeous tulips!",
        "Art, personality, and a touch of rebellion."
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-[90%] w-[70%] bg-white rounded-3xl overflow-hidden shadow-lg">
            {/* Images */}
            <div
                className="flex transition-transform duration-1000 ease-in-out h-full w-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`carousel-${index}`}
                        className="w-full h-full object-cover flex-shrink-0"
                    />
                ))}
            </div>

            {/* Captions */}
            <div className="absolute bottom-0 h-60 w-full bg-gradient-to-t from-gray-900 to-transparent flex items-end overflow-hidden">
                <div
                    className="flex w-full transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {captions.map((text, index) => (
                        <span
                            key={index}
                            className="text-white w-full font-bold text-2xl flex-shrink-0 p-8"
                        >
                            <p className="max-w-[85%]">
                                {text}
                            </p>
                        </span>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 transition-all rounded-full ${
                            currentIndex === index ? "w-6 bg-[#F77737]" : "w-2 bg-[#F77737]"
                        }`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;