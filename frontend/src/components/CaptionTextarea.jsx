import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import EmojiPickerButton from "./EmojiPickerButton";

const CaptionTextarea = ({
    placeholder = "Write a caption ...",
    onChange,
    value,
}) => {
    const textareaRef = useRef(null);
    const [internalValue, setInternalValue] = useState(value || "");

    const handleChange = (newValue) => {
        setInternalValue(newValue);
        onChange?.(newValue);
    };

    return (
        <div className="relative w-full mb-6 pr-6">
            <TextareaAutosize
                ref={textareaRef}
                value={internalValue}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                maxRows={7}
                className="w-full resize-none bg-transparent text-lg
                    placeholder-gray-400 dark:placeholder-dark-text-subtle
                    focus:outline-none focus:ring-0 border-none
                    overflow-auto transition-all pr-6"
            />

            {/* Emoji Picker Button */}
            <div className="absolute left-0 top-full"
                style={{marginTop: "1rem"}}>
                <EmojiPickerButton
                    textareaRef={textareaRef}
                    value={internalValue}
                    onChange={handleChange}
                    top={"top-full"}
                    left={"left-0"}
                />
            </div>
        </div>
    );
};

export default CaptionTextarea;