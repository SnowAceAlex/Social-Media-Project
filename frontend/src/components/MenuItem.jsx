import React from 'react';
import { Link } from 'react-router-dom';

const MenuItem = ({ icon: Icon, label, onClick, to, isLogout = false }) => {
    const baseClass = `flex items-center justify-start w-[90%] h-fit py-4 px-4 gap-4
                       rounded-md hover:bg-light-hover cursor-pointer
                       transition-all duration-200 ease-in-out
                       dark:hover:bg-dark-hover
                       ${isLogout ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-950' : ''}`;

    const content = (
        <>
            <Icon size={25} />
            <p className="font-[400] text-md">{label}</p>
        </>
    );

    if (to) {
        return (
            <Link to={to} className={baseClass}>
                {content}
            </Link>
        );
    }

    return (
        <div onClick={onClick} className={baseClass}>
            {content}
        </div>
    );
};

export default MenuItem;
