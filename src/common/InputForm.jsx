import { useState } from "react";

//? ICONOS
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

const InputForm = ({ label, placeHolder, hanlder, nameInput, type, bg = "white" }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="flex flex-col w-full">
            <label htmlFor={nameInput} className="text-xl font-semibold text-white-bg3">
                {label}
            </label>
            {nameInput === "password" ? (
                <div
                    className={`${
                        bg === "white" ? "bg-white-bg" : "bg-white-bg2"
                    } text-black-comun text-xl flex items-center relative`}
                >
                    <input
                    id={nameInput}
                        onChange={hanlder}
                        placeholder={placeHolder}
                        type={show ? "text" : "password"}
                        name={nameInput}
                        className={`${bg === "white" ? "bg-white-bg" : "bg-white-bg2"} py-2 pl-5 pr-8 w-full`}
                        user-select={type === "password" ? "none" : null}
                    />
                    {show ? (
                        <FaRegEyeSlash
                            className=" absolute right-4 top[50%] text-black-comun cursor-pointer"
                            onClick={() => setShow(false)}
                            user-select="none"
                        />
                    ) : (
                        <FaRegEye
                            className=" absolute right-4 top[50%] text-black-comun cursor-pointer"
                            onClick={() => setShow(true)}
                            user-select="none"
                        />
                    )}
                </div>
            ) : (
                <input
                    onChange={hanlder}
                    placeholder={placeHolder}
                    type={type}
                    name={nameInput}
                    className={`${bg === "white" ? "bg-white-bg" : "bg-white-bg2"} text-black-comun py-2 px-5 text-xl`}
                />
            )}
        </div>
    );
};

export default InputForm;
