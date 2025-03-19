import React from "react";

function LogInForm() {
    return (
    <div>
        <form className="flex flex-col gap-4">
            <input
            type="text"
            placeholder="Username or email"
            className="w-full px-4 py-3 border border-gray-200 rounded-md bg-[#e8f0fe] text-[#1B1B1B]
                                    focus:ring-2 focus:ring-[#E1306C] focus:border-[#F77737] outline-none placeholder-gray-400"
            />
            <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-200 rounded-md bg-[#e8f0fe] text-[#1B1B1B]
                                    focus:ring-2 focus:ring-[#E1306C] focus:border-[#F77737] outline-none placeholder-gray-400"
            />
            <button
            type="submit"
            className="w-full bg-gradient-to-tr from-[#fd9739] via-[#e75982] to-[#c91dc4]  
                                    text-white py-2 rounded-lg font-semibold
                                    hover:bg-gradient-to-bl transition-all duration-500 ease-in-out cursor-pointer"
            >
            Log in
            </button>
        </form>

        <div className="text-center mt-4">
            <a
            href="#"
            className="text-sm text-blue-400 hover:underline font-medium"
            >
            Forgot password?
            </a>
        </div>
    </div>
    );
}

export default LogInForm;
