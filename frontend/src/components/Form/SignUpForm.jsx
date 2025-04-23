import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { motion } from "framer-motion";
import { registerUser } from "../../services/authService";
import { useUploadService } from "../../hook/useUploadService";
import { DEFAULT_PROFILE_PIC_URL } from "../../constants/imageProfile";
import { useEditProfileService } from "../../hook/useEditProfileService";

function SignUpForm({ showRegister, setShowRegister, showGlobalToast }) {
    const [frameRegister, setFrameRegister] = useState(1);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const { uploadSingle, uploading } = useUploadService();
    const { handleSaveProfile } = useEditProfileService(
        () => console.log("✅ Profile updated after register"),
        (err) => console.error("❌ Update profile failed:", err)
    );

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        full_name: "",
        confirmPassword: "",
        dateOfBirth: "",
        bio: "",
        imgFile: null, 
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
        setFormData((prev) => ({ ...prev, imgFile: files[0], imgUrl: "" }));
        } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
    
        // Kiểm tra email hợp lệ
        if (!isValidEmail(formData.email)) {
            setError("Invalid email format");
            setLoading(false);
            return;
        }
    
        // Kiểm tra mật khẩu
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
    
        // Kiểm tra các trường bắt buộc
        if (!formData.username || !formData.email || !formData.password) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }
    
        try {
            const { confirmPassword, imgFile, ...dataToSend } = formData;
    
            // Đảm bảo luôn có trường profile_pic_url
            dataToSend.profile_pic_url = formData.profile_pic_url || null;
    
            // Tạo FormData để gửi lên backend
            const formDataToSend = new FormData();
            Object.keys(dataToSend).forEach(key => {
                formDataToSend.append(key, dataToSend[key]);
            });
    
            // Nếu có file ảnh, gửi kèm vào FormData
            if (imgFile) {
                formDataToSend.append("avatar", imgFile);
            }
    
            console.log("📤 Dữ liệu gửi đi:", formDataToSend);
            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}: ${value}`);
            }
    
            // Gửi dữ liệu đến backend
            const registerResponse = await registerUser(formDataToSend);
            console.log("✅ Register response:", registerResponse);
    
            showGlobalToast("Account created successfully!", "success");
        } catch (err) {
            setError(err.error || "Failed to register");
            console.error("❌ Register error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Xử lý khi nhập URL ảnh
    const handleImageUrl = (e) => {
        setImageUrl(e.target.value);
        setImage(e.target.value);
    };

    const handleFileChangeUpload = (e) => {
        handleImageUpload(e);
        setImageUrl(""); 
        handleChange(e);
    };

    const handleFileChangeUrl = (e) => {
        handleImageUrl(e);
        setFormData(prev => ({ ...prev, imgFile: null })); 
        handleChange(e);
    };

    return (
        <motion.div
        animate={{
            top: showRegister ? "35%" : "91%",
            height: showRegister ? (error ? "32rem" : "30rem") : "5rem",
            width: showRegister ? "25rem" : "20rem",
        }}
        transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
        className={`absolute left-1/2 -translate-x-1/2 p-4
                                            rounded-t-3xl bg-gradient-to-tr from-[#fd9739] via-[#e75982] to-[#c91dc4] 
                                            flex flex-col justify-start items-center text-white font-medium 
                                            ${showRegister ? "rounded-b-3xl" : ""}`}
        >
        {/* Toggle Form */}
        <div
            onClick={() => (
            setShowRegister(!showRegister), setFrameRegister(1), setError("")
            )}
            className="flex flex-col justify-center items-center cursor-pointer"
        >
            {showRegister ? <FaAngleDown /> : <FaAngleUp />}
            <p>
            {showRegister ? "Click here to login!" : "Click here to register!"}
            </p>
        </div>

        {/* Form */}
        {showRegister && (
            <div className="mt-8 relative mb-8 h-full">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
            >
                <div className="flex flex-col gap-4">
                {/* Step 1: Login Info */}
                {frameRegister === 1 && (
                    <>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        placeholder="Username"
                        className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                outline-none placeholder-gray-200/50"
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        placeholder="Email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                outline-none placeholder-gray-200/50"
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="Password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                                            outline-none placeholder-gray-200/50"
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                                            outline-none placeholder-gray-200/50"
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        onClick={() => setFrameRegister(2)}
                        className="w-full text-[#e75982] py-2 rounded-lg font-semibold
                                                                    bg-white absolute bottom-0 left-1/2 transform -translate-x-1/2 hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                    >
                        Next
                    </button>
                    </>
                )}

                {/* Step 2: Personal Info */}
                {frameRegister === 2 && (
                    <>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        placeholder="Full Name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                                        outline-none placeholder-gray-200/50"
                        onChange={handleChange}
                    />
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                                        outline-none placeholder-gray-200/50"
                        onChange={handleChange}
                    />
                    <textarea
                        name="bio"
                        placeholder="Bio"
                        value={formData.bio}
                        className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                                        outline-none placeholder-gray-200/50 resize-none h-24"
                        onChange={handleChange}
                    ></textarea>
                    <div className="flex justify-between absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full">
                        <button
                        type="button"
                        onClick={() => setFrameRegister(1)}
                        className="w-1/3 text-white py-2 rounded-lg font-semibold
                                                                    bg-gray-600 hover:bg-gray-500 transition-all duration-300 cursor-pointer"
                        >
                        Back
                        </button>
                        <button
                        type="button"
                        onClick={() => setFrameRegister(3)}
                        className="w-1/2 text-[#e75982] py-2 rounded-lg font-semibold
                                                                    bg-white hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                        >
                        Next
                        </button>
                    </div>
                    </>
                )}

                {/* Step 3: Upload Profile Picture */}
                {frameRegister === 3 && (
                    <>
                    <div className="w-full flex justify-center -mt-4">
                        <img
                        src={
                            image ||
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbraIYAfClidvw0KiWZpR5e8IZEeaFJsN8iw&s"
                        }
                        alt="Profile Preview"
                        className="w-20 h-20 object-cover rounded-full border-2 border-white"
                        />
                    </div>

                    <label className="text-white">Upload Profile Picture</label>
                    <input
                        type="file"
                        name="imgFile"
                        accept="image/*"
                        onChange={handleFileChangeUpload}
                        className="w-max bg-transparent text-white
                                                                        file:py-2 file:px-4 file:mr-8 file:rounded-2xl
                                                                        outline-none cursor-pointer file:bg-gray-300 file:text-black"
                    />

                    <label className="text-white">Or Paste Image URL</label>
                    <input
                        type="text"
                        name="profile_pic_url"
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={handleFileChangeUrl}
                        className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                                        outline-none placeholder-gray-200/50"
                    />

                    <div className="flex justify-between absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full">
                        <button
                        type="button"
                        onClick={() => setFrameRegister(2)}
                        className="w-1/3 text-white py-2 rounded-lg font-semibold
                                                                    bg-gray-600 hover:bg-gray-500 transition-all duration-300 cursor-pointer"
                        >
                        Back
                        </button>
                        <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-1/2 text-[#e75982] py-2 rounded-lg font-semibold
                                                                    bg-white hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                        disabled={loading}
                        >
                        {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </div>
                    </>
                )}
                {/*ERROR */}
                {error && (
                    <p className="text-red-500 w-full p-2 rounded-lg text-center bg-black/60">
                    {error}
                    </p>
                )}
                </div>
            </motion.div>
            </div>
        )}
        </motion.div>
    );
}

export default SignUpForm;
