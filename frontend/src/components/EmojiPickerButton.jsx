// components/EmojiPickerButton.jsx
import { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

const EmojiPickerButton = ({ textareaRef, value, onChange, top, left }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const pickerRef = useRef(null);

    const currentTheme = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);

    const handleEmojiClick = (emojiData) => {
        const ref = textareaRef.current;
        if (!ref) return;

        const start = value.substring(0, ref.selectionStart);
        const end = value.substring(ref.selectionEnd);
        const newText = start + emojiData.emoji + end;

        onChange(newText);

        setTimeout(() => {
            ref.focus();
            ref.selectionStart = ref.selectionEnd = start.length + emojiData.emoji.length;
        }, 0);
    };

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="text-xl cursor-pointer"
                style={{ marginTop: '' }}
            >
                <BsEmojiSmile className="text-gray-500 hover:text-gray-700" />
            </button>

            {/* Picker */}
            {showEmojiPicker && (
                <div
                    ref={pickerRef}
                    style={{ marginTop: '20px', marginBottom: '20px' }}
                    className={`absolute ${top} ${left} z-50`}
                >
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        theme={currentTheme}
                        width={300}
                        height={300}
                        searchDisabled
                        skinTonesDisabled
                        previewConfig={{ showPreview: false }}
                        emojiStyle="native"
                    />
                </div>
            )}
        </div>
    );
};

export default EmojiPickerButton;