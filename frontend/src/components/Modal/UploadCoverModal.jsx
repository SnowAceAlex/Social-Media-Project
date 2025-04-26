// components/Modal/UploadCoverModal.jsx
import { forwardRef, useEffect, useRef, useState } from 'react';

const UploadCoverModal = forwardRef(({ onClose, onSubmit }, ref) => {
    const [coverUrl, setCoverUrl] = useState('');
    const [coverFile, setCoverFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setCoverUrl('');
        }
    };

    const handleUrlChange = (e) => {
        setCoverUrl(e.target.value);
        setCoverFile(null);
    };

    const handleSubmit = async () => {
        if (!coverFile && !coverUrl) return;
        setLoading(true);
        try {
            await onSubmit({ file: coverFile, url: coverUrl });
        } catch (err) {
            console.error("Failed to update cover", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (coverFile) {
            const objectUrl = URL.createObjectURL(coverFile);
            setPreviewUrl(objectUrl);
    
            return () => URL.revokeObjectURL(objectUrl); // Cleanup khi unmount hoặc file đổi
        } else if (coverUrl) {
            setPreviewUrl(coverUrl);
        } else {
            setPreviewUrl('');
        }
    }, [coverFile, coverUrl]);    

    return (
        <div 
            ref={ref}
            className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-dark-card
                        border-2 border-light-border dark:border-dark-border
                        rounded-xl shadow-xl p-4 z-50 space-y-3">
            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt="Cover preview"
                    className="w-full h-32 object-cover rounded"
                />
            ) : (
                <div className='w-full h-32 object-cover rounded text-white
                                bg-gradient-to-tr from-[#fd9739] via-[#e75982]  to-[#c91dc4]
                                flex items-center justify-center text-xl'>
                    Choose your cover
                </div>
            )}
            <div>
                <label className="text-sm font-medium">Upload from device</label>
                <input type="file" className='my-4' accept="image/*" onChange={handleFileChange} />
            </div>

            <div>
                <label className="text-sm font-medium">Paste image URL</label>
                <input
                    type="text"
                    value={coverUrl}
                    onChange={handleUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="mt-2 w-full p-2 focus:outline-none rounded text-sm
                                border border-light-input-border dark:border-dark-input-border"
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-2 rounded-md text-sm font-medium cursor-pointer
                        ${loading ? '' : 'bg-light-button hover:bg-light-button-hover dark:bg-dark-button dark:hover:bg-dark-button-hover'}`}
            >
                {loading ? 'Saving...' : 'Save Cover'}
            </button>
        </div>
    );
});

export default UploadCoverModal;