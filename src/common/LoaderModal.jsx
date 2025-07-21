import { BiLoaderAlt } from "react-icons/bi";

const LoaderModal = ({ textLoader }) => {
    return (
        <p className="text-2xl text-black-comun flex items-center">
            {textLoader} <BiLoaderAlt className="animate-spin text-button-green ml-2" />
        </p>
    );
};

export default LoaderModal;
