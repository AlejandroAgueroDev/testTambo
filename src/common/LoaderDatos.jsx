import { BiLoaderAlt } from "react-icons/bi";

const LoaderDatos = ({ textLoader, showText = true }) => {
    return (
        <div>
            <p className="text-xl text-white-bg3 flex items-center">
                {textLoader} <BiLoaderAlt className="animate-spin text-white-bg3 ml-2" />
            </p>
        </div>
    );
};

export default LoaderDatos;
