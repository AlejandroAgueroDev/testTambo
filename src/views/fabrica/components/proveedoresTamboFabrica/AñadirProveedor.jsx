import { useRef, useState } from "react";
import Titulo from "../../../../common/Titulo";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import { BiLoaderAlt } from "react-icons/bi";
import { Validation2 } from "../../../../common/Validation2";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const AñadirProveedor = ({ setCloseModal, getProveedores }) => {
    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState({});
    //? DESPLAZAMIENTO CON LA FLECHA
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
    const input4Ref = useRef(null);
    const input5Ref = useRef(null);

    const handleKeyDown = (e, nextRef, prevRef) => {
        if (e.key === "ArrowDown" && nextRef) {
            e.preventDefault();
            nextRef.current.focus();
        } else if (e.key === "ArrowUp" && prevRef) {
            e.preventDefault();
            prevRef.current.focus();
        }
    };

    //?-------------------------------
    const [newProveedor, setNewProveedor] = useState({
        nombre_empresa: "",
        saldo: "",
        contacto_1: "",
        contacto_2: "",
        localidad: "",
        isTamboProveedor: true,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const errorMsg = Validation2(name, value);

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMsg,
        }));

        setNewProveedor({ ...newProveedor, [name]: value });
    };

    const handleNewProveedor = async () => {
        const requiredFields = ["nombre_empresa", "localidad", "saldo"];
        const newErrors = {};

        requiredFields.forEach((field) => {
            const value = newProveedor[field];
            const errorMsg = Validation2(field, value);
            if (errorMsg) {
                newErrors[field] = errorMsg;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors({});

            Swal.fire({
                title: "Campos inválidos",
                text: "Por favor, revisá los errores antes de continuar.",
                icon: "warning",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
            });
            return;
        }

        const { nombre_empresa, saldo, localidad } = newProveedor;
        if (!nombre_empresa || !saldo || !localidad) {
            return Swal.fire({
                title: "No puedes dejar campos vacíos",
                icon: "warning",
                iconColor: "#D64747",
                confirmButtonColor: "#D64747",
            });
        }

        setLoader(true);
        //?POST de proveedor
        try {
            const { data } = await axios.post(`${url}proveedor`, newProveedor);

            Swal.fire({
                title: "Proveedor para tambo añadido exitosamente",
                confirmButtonText: "Aceptar",
                icon: "success",
                confirmButtonColor: "#86C394",
            }).then((result) => {
                if (result.isConfirmed) {
                    setCloseModal(false); // Cerrar el modal
                    getProveedores(); // Actualizar la lista de proveedores
                }
            });
        } catch (error) {
            Swal.fire({
                title: "Error al añadir proveedor de tambo",
                text: "Ocurrió un error al intentar añadir el proveedor de tambo.",
                icon: "error",
                confirmButtonColor: "#D64747",
            });
            console.error(error);
        } finally {
            setLoader(false); // Ocultar spinner
        }
    };

    //? ENVIAR CON ENTER
    const handleKeyDownEnter = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleNewProveedor();
        }
    };

    return (
        <div className="flex flex-col space-y-2 items-start w-[380px] sm:w-[500px]">
            <div className="w-full flex justify-between">
                <Titulo text="AGREGAR PROVEEDOR DE TAMBO" />
            </div>
            <div className="w-full space-y-3" onKeyDown={handleKeyDownEnter}>
                <div className="containerInput">
                    <label className="labelInput">
                        Nombre<strong className="text-red-400">*</strong>
                    </label>
                    <Tippy
                        content={errors.nombre_empresa || ""}
                        visible={!!errors.nombre_empresa}
                        placement="top-end"
                        arrow={true}
                        theme="custom"
                    >
                        <input
                            placeholder="Nombre del tambo o del dueño"
                            ref={input1Ref}
                            onKeyDown={(e) => handleKeyDown(e, input2Ref, null)}
                            onChange={handleChange}
                            type="text"
                            name="nombre_empresa"
                            className={`input ${errors.nombre_empresa ? "border-red-500" : "border-gray-300"}`}
                        />
                    </Tippy>
                </div>

                <div className="containerInput">
                    <label className="labelInput">
                        Contacto 1<strong className="text-red-400">*</strong>
                    </label>
                    <input
                        placeholder="Puede ser telefono o un email."
                        ref={input2Ref}
                        onKeyDown={(e) => handleKeyDown(e, input3Ref, input1Ref)}
                        onChange={handleChange}
                        type="email"
                        name="contacto_1"
                        className="input"
                    />
                </div>

                <div className="containerInput">
                    <label className="labelInput">Contacto 2</label>
                    <input
                        placeholder="Puede ser telefono o un email."
                        ref={input3Ref}
                        onKeyDown={(e) => handleKeyDown(e, input4Ref, input2Ref)}
                        onChange={handleChange}
                        type="text"
                        name="contacto_2"
                        className="input"
                    />
                </div>

                <div className="containerInput">
                    <label className="labelInput">
                        Localidad<strong className="text-red-400">*</strong>
                    </label>
                    <Tippy
                        content={errors.localidad || ""}
                        visible={!!errors.localidad}
                        placement="top-end"
                        arrow={true}
                        theme="custom"
                    >
                        <input
                            placeholder="Cordoba"
                            ref={input4Ref}
                            onKeyDown={(e) => handleKeyDown(e, input5Ref, input3Ref)}
                            onChange={handleChange}
                            type="text"
                            name="localidad"
                            className={`input ${errors.localidad ? "border-red-500" : "border-gray-300"}`}
                        />
                    </Tippy>
                </div>

                <div className="containerInput">
                    <label className="labelInput">
                        Saldo<strong className="text-red-400">*</strong>
                    </label>
                    <Tippy
                        content={errors.saldo || ""}
                        visible={!!errors.saldo}
                        placement="top-end"
                        arrow={true}
                        theme="custom"
                    >
                        <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow">
                            <p className="text-xl text-white-bg3">$</p>
                            <input
                                ref={input5Ref}
                                onKeyDown={(e) => {
                                    if (e.key === "e" || e.key === "E" || e.key === "+") {
                                        e.preventDefault();
                                    }
                                    handleKeyDown(e, null, input4Ref);
                                }}
                                onChange={handleChange}
                                type="number"
                                name="saldo"
                                value={newProveedor.saldo}
                                placeholder="Ej: 1200 o 0"
                                className={`input ${errors.saldo ? "border-red-500" : "border-gray-300"}`}
                            />
                        </div>
                    </Tippy>
                </div>

                <div className="flex justify-end space-x-3">
                    <button className="boton_rojo" onClick={() => setCloseModal(false)}>
                        CANCELAR
                    </button>
                    <button onClick={handleNewProveedor} className="boton_verde">
                        {loader ? (
                            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
                        ) : (
                            "AGREGAR"
                        )}
                    </button>
                </div>
                <p className="text-white-bg3 w-full">
                    - Los campos marcados con<strong className="text-red-400">*</strong> son obligatorios para cargar un
                    nuevo proveedor en tambo.
                </p>
            </div>
        </div>
    );
};

export default AñadirProveedor;
