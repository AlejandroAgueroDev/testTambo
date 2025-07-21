const Modal = ({ setShowModal, children }) => {
    return (
        <div className="w-screen h-screen fixed -top-1 left-0 flex items-center z-50 bg-[#000] bg-opacity-60">
            <div className="flex flex-col max-h-[90ddvh] mx-auto bg-white-bg p-2 md:p-4 mb-20 shadow-black shadow-lg">
                {children}
            </div>
        </div>
    );
};

export default Modal;
