const Busqueda = ({ placeholder, handler, clear, value, color = "gris" }) => {
    return (
        <div className="flex space-x-2">
            <div>
                <input
                    value={value}
                    onChange={handler}
                    type="text"
                    className={`${
                        color === "gris" ? "bg-white-bg" : "bg-white-bg2"
                    }  text-black py-2 px-3 text-xl w-60`}
                    placeholder={placeholder}
                />
            </div>
            <button className="bg-button-red hover:bg-button-red_hover px-3" onClick={clear}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0 17.8744L7.87016 10.0067L0.0111158 2.15L2.13984 0.0222222L9.99555 7.87667L17.8746 0L20 2.12556L12.1198 10.0067L19.9844 17.87L17.859 19.9956L9.99555 12.1367L2.1265 20L0 17.8744Z"
                        fill="#E5E5E5"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Busqueda;
