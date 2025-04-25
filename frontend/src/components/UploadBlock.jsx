import React, { useRef, useState } from 'react';
import { LiaPhotoVideoSolid } from 'react-icons/lia';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function UploadBlock({onFilesSelected}) {
        const fileInputRef = useRef(null);
        const [images, setImages] = useState([]);
        const [currentIndex, setCurrentIndex] = useState(0);
    
        const handleClick = () => {
            fileInputRef.current.click();
        };
    
        const handleFileChange = (e) => {
            const files = Array.from(e.target.files);
            const imageUrls = files.map(file => URL.createObjectURL(file));
            setImages(imageUrls);
            setCurrentIndex(0);
            if (onFilesSelected) {
                onFilesSelected(files);
            }
        };
    
        const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        };
    
        const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        };
    
        return (
        <>
            <div
            className="order-2 md:order-1 w-full md:flex-4 aspect-[3/3]
                        min-h-[20rem]
                        md:aspect-auto
                        flex items-center justify-center cursor-pointer
                        bg-light-button hover:bg-light-button-hover
                        dark:bg-dark-inputCard dark:hover:bg-dark-inputCard-hover
                        overflow-hidden relative"
            onClick={handleClick}
            title='Select photos/video'
            >
            {images.length > 0 ? (
                <>
                <img
                    src={images[currentIndex]}
                    alt={`Uploaded ${currentIndex + 1}`}
                    className="w-full h-full object-contain shadow-2xl"
                />
                {/* Back Button */}
                {images.length > 1 && currentIndex > 0 && (
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                        }}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-dark active:bg-dark-hover bg-opacity-50 
                                text-white rounded-full hover:bg-opacity-70 cursor-pointer"
                        title="Previous"
                    >
                        <HiChevronLeft size={24} />
                    </button>
                )}

                    {/* Next Button */}
                    {images.length > 1 && currentIndex < images.length - 1 && (
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-dark active:bg-dark-hover bg-opacity-50 
                                text-white rounded-full hover:bg-opacity-70 cursor-pointer"
                        title="Next"
                    >
                        <HiChevronRight size={24} />
                    </button>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center">
                <LiaPhotoVideoSolid size={70} />
                <span>Select your photos/videos</span>
                </div>
            )}
            </div>
    
            {/* Hidden input file */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
            />
        </>
        );
}
