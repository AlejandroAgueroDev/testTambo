import { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../common/URL_SERVER";
import Titulo from "../../../common/Titulo";
import { Validation } from "../../../common/Validation";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const NuevoProveedor = ({ setShowModal, id_sector, setProveedores, setProveedoresFiltrados }) => {
    const [nuevoProveedor, setNuevoProveedor] = useState({
        nombre_empresa: "",
        contacto_1: "",
        localidad: "",
        saldo: "",
        isTamboProveedor: false,
        id_sector: id_sector,
    });
    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const errorMsg = Validation(name, value);

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMsg,
        }));

        setNuevoProveedor((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        // Validar que no haya errores visibles ni campos vacíos obligatorios
        const requiredFields = ["nombre_empresa", "localidad", "saldo"];
        const newErrors = {};

        requiredFields.forEach((field) => {
            const value = nuevoProveedor[field];
            const errorMsg = Validation(field, value);
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

        // Si no hay errores, proceder con el POST
        setLoader(true);

        try {
            await axios.post(`${url}proveedor`, nuevoProveedor);
            setErrors({});
            Swal.fire({
                title: "Proveedor agregado con éxito!",
                confirmButtonText: "Aceptar",
                icon: "success",
                confirmButtonColor: "#86C394",
            }).then(() => {
                axios(`${url}proveedor?id_sector=${id_sector}`).then(({ data }) => {
                    setProveedores(data);
                    setProveedoresFiltrados(data);
                    setShowModal(false);
                });
            });
        } catch (error) {
            console.error("Error al agregar proveedor:", error);
            setErrors({});
            Swal.fire({
                title: "Error al agregar proveedor",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
            });
        } finally {
            setLoader(false);
        }
    };

    const handleKeyDownEnter = (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita el comportamiento predeterminado
            handleSave();
        }
    };

    return (
        <div className="flex flex-col space-y-4 items-start sm:w-[450px] max-h-[80dvh] overflow-y-auto overflow-x-hidden">
            <Titulo text="AGREGAR PROVEEDOR" />
            <div className="text-xl flex flex-col space-y-3 mx-auto" onKeyDown={handleKeyDownEnter}>
                <div className="containerInput">
                    <label className="labelInput">
                        Nombre / Empresa <strong className="text-red-400">*</strong>
                    </label>
                    <Tippy
                        content={errors.nombre_empresa || ""}
                        visible={!!errors.nombre_empresa}
                        placement="top-end"
                        arrow={true}
                        theme="custom"
                    >
                        <input
                            onChange={handleInputChange}
                            type="text"
                            placeholder="Nombre / Empresa"
                            name="nombre_empresa"
                            value={nuevoProveedor.nombre_empresa}
                            className={`input ${errors.nombre_empresa ? "border-red-500" : "border-gray-300"}`}
                        />
                    </Tippy>
                </div>

                <div className="containerInput">
                    <label className="labelInput">
                        Contacto <strong className="text-red-400">*</strong>
                    </label>
                    <input
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Puede ser telefono o un email."
                        name="contacto_1"
                        value={nuevoProveedor.contacto_1}
                        className="input"
                    />
                </div>

                <div className="containerInput">
                    <label className="labelInput">
                        Localidad <strong className="text-red-400">*</strong>
                    </label>
                    <Tippy
                        content={errors.localidad || ""}
                        visible={!!errors.localidad}
                        placement="top-end"
                        arrow={true}
                        theme="custom"
                    >
                        <input
                            onChange={handleInputChange}
                            type="text"
                            placeholder="Calchín, Córdoba"
                            name="localidad"
                            value={nuevoProveedor.localidad}
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
                        <div className="bg-white-bg2 text-black-comun text-xl pl-3 flex items-center space-x-2 w-full">
                            <p className="font-bold text-white-bg3">$</p>
                            <input
                                onChange={handleInputChange}
                                type="number"
                                name="saldo"
                                placeholder="Ej: 1000 o 0"
                                onKeyDown={(e) => {
                                    if (e.key === "e" || e.key === "E" || e.key === "+") {
                                        e.preventDefault();
                                    }
                                }}
                                value={nuevoProveedor.saldo}
                                className={`input ${errors.saldo ? "border-red-500" : "border-gray-300"}`}
                            />
                        </div>
                    </Tippy>
                </div>

                <div className="flex justify-end space-x-3 pt-5">
                    <button className="boton_rojo" onClick={() => setShowModal(false)}>
                        CANCELAR
                    </button>
                    <button onClick={handleSave} className="boton_verde">
                        {loader ? (
                            <BiLoaderAlt className="animate-spin text-black-comun text-center grow" />
                        ) : (
                            "AGREGAR"
                        )}
                    </button>
                </div>
                <p className="text-white-bg3 w-full">
                    - Los campos marcados con <strong className="text-red-400">*</strong> son obligatorios para cargar
                    un nuevo proveedor.
                </p>
            </div>
        </div>
    );
};

export default NuevoProveedor;
