
const SidebarItem = ({ icon: Icon, label, onClick }) => {
    return (
        <div className='flex items-center justify-start w-full h-fit py-2 px-4 gap-4
                        rounded-xl hover-bg-color-light cursor-pointer
                        transition-all duration-200 ease-in-out'
                        onClick={onClick}>
            <Icon size={30} />
            <p className='font-medium text-lg'>{label}</p>
        </div>
    );
};

export default SidebarItem;