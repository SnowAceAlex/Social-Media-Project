import React, { useEffect, useState } from 'react'
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { motion } from "framer-motion";

function SignUpForm({showRegister, setShowRegister }) {
    const [frameRegister, setFrameRegister] = useState(1);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        fullName: "",
        dateOfBirth: "",
        bio: "",
        imgFile: null, 
        imgUrl: "",     
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            setFormData((prev) => ({ ...prev, imgFile: files[0], imgUrl: "" }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let response;
            if (formData.imgFile) {
                const fd = new FormData();
                Object.keys(formData).forEach((key) => {
                    if (formData[key]) fd.append(key, formData[key]);
                });

                response = await fetch("http://localhost:5000/users/register", {
                    method: "POST",
                    body: fd, 
                });
            } else {
                const { imgFile, ...jsonData } = formData;
                response = await fetch("http://localhost:5000/users/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(jsonData),
                });
            }

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Đăng ký thất bại");

            alert("Đăng ký thành công!");
        } catch (err) {
            setError(err.message);
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

    return (
    <motion.div
        animate={{
            top: showRegister ? "35%" : "91%",
            height: showRegister ? "30rem" : "5rem",
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
            onClick={() => setShowRegister(!showRegister)}
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
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    {/* Step 1: Login Info */}
                    {frameRegister === 1 && (
                    <>
                            <input
                            type="text"
                            placeholder="Username"
                            className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                                    outline-none placeholder-gray-200/50"
                            />
                            <input
                            type="text"
                            placeholder="Email"
                            className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                                    outline-none placeholder-gray-200/50"
                            />
                            <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                                    outline-none placeholder-gray-200/50"
                            />
                            <input
                            type="password"
                            placeholder="Confirm password"
                            className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                                    outline-none placeholder-gray-200/50"
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
                        placeholder="Full Name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                                outline-none placeholder-gray-200/50"
                        />
                        <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                                outline-none placeholder-gray-200/50"
                        />
                        <textarea
                        placeholder="Bio"
                        className="w-full px-4 py-3 border border-gray-200 rounded-md bg-transparent text-white
                                                                outline-none placeholder-gray-200/50 resize-none h-24"
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
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-max bg-transparent text-white
                                                                file:py-2 file:px-4 file:mr-8 file:rounded-2xl
                                                                outline-none cursor-pointer file:bg-gray-300 file:text-black"
                        />

                        <label className="text-white">Or Paste Image URL</label>
                        <input
                        type="text"
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={handleImageUrl}
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
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            </motion.div>
            </div>
        )}
    </motion.div>
    );
}

export default SignUpForm;
