import { useRef, useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

const CaptionTextarea = ({
    placeholder = "Write a caption ...",
    maxHeight = 150,
    onChange,
    value,
    }) => {
    const textareaRef = useRef(null);
    const [internalValue, setInternalValue] = useState(value || "");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(null);
    const pickerRef = useRef(null);
    const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        onChange?.(newValue);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        }
    
        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);

    // Auto resize logic
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
        }
    }, [internalValue, maxHeight]);

    const handleEmojiClick = (emojiData) => {
        const ref = textareaRef.current;
        const start = internalValue.substring(0, ref.selectionStart);
        const end = internalValue.substring(ref.selectionEnd);
        const text = start + emojiData.emoji + end;
        setInternalValue(text);
        onChange?.(text);

        setTimeout(() => {
        ref.focus();
        ref.selectionStart = ref.selectionEnd = start.length + emojiData.emoji.length;
        }, 0);
    };

    return (
        <div className="relative w-full mb-6 pr-6">
        {/* Textarea */}
        <textarea
            ref={textareaRef}
            rows={1}
            value={internalValue}
            onChange={handleChange}
            onClick={() => setCursorPosition(textareaRef.current?.selectionStart)}
            onKeyUp={() => setCursorPosition(textareaRef.current?.selectionStart)}
            placeholder={placeholder}
            className="w-full resize-none bg-transparent text-2xl
                    placeholder-gray-400 dark:placeholder-dark-text-subtle
                    focus:outline-none focus:ring-0 border-none
                    overflow-auto transition-all pr-6"
            style={{ maxHeight }}
        />

        {/* Emoji Button */}
        <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="absolute left-0 top-[120%] text-xl cursor-pointer"
        >
            <BsEmojiSmile className="text-gray-500 hover:text-gray-700" />
        </button>

        {/* Emoji Picker */}
        {showEmojiPicker && (
            <div
                ref={pickerRef}
                style={{ fontSize: '10px' }}
                className="absolute top-[160%] left-0 mb-2 z-50">
                <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme={currentTheme}                    
                    width={200}
                    height={150}
                    searchDisabled={true}     
                    skinTonesDisabled={true}   
                    previewConfig={{ showPreview: false }} 
                    emojiStyle="native"   
                />
            </div>
        )}
        </div>
    );
};

export default CaptionTextarea;
