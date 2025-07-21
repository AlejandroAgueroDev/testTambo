import Titulo from "../../../common/Titulo";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";

const EditarProveedor = ({ proveedor, setShowModal, handleSave, loader }) => {
    const [formProveedor, setFormProveedor] = useState({
        nombre_empresa: "",
        contacto_1: "",
        localidad: "",
        isTamboProveedor: false,
        id: "",
    });

    useEffect(() => {
        if (proveedor) {
            setFormProveedor({
                nombre_empresa: proveedor.nombre_empresa || "",
                contacto_1: proveedor.contacto_1 || "",
                localidad: proveedor.localidad || "",
                saldo: proveedor.saldo || "",
                isTamboProveedor: false,
                id: proveedor.id || "",
            });
        }
    }, [proveedor]);

    const handleForm = (e) => {
        const { name, value } = e.target;
        setFormProveedor((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = () => {
        if (!formProveedor.nombre_empresa || !formProveedor.contacto_1 || !formProveedor.localidad) {
            return Swal.fire({
                title: "Complete los campos obligatorios",
                text: "Nombre, Contacto 1 y Localidad son requeridos",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "warning",
            });
        }

        handleSave(formProveedor);
    };

    return (
        <div className="flex flex-col space-y-2 items-start w-[380px] sm:w-[500px]">
            <Titulo text={`EDITAR PROVEEDOR`} />
            <div className="w-full space-y-3">
                <div className="containerInput">
                    <label className="labelInput">
                        Nombre del tambo <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        onChange={handleForm}
                        name="nombre_empresa"
                        value={formProveedor.nombre_empresa}
                        className="input"
                    />
                </div>

                <div className="containerInput">
                    <label className="labelInput">
                        Contacto <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        onChange={handleForm}
                        name="contacto_1"
                        value={formProveedor.contacto_1}
                        className="input"
                    />
                </div>

                <div className="containerInput">
                    <label className="labelInput">
                        Localidad <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        onChange={handleForm}
                        name="localidad"
                        value={formProveedor.localidad}
                        className="input"
                    />
                </div>

                <div className="w-full flex justify-end space-x-3">
                    <button onClick={() => setShowModal(false)} className="boton_rojo">
                        CANCELAR
                    </button>
                    <button onClick={handleUpdate} className="boton_verde">
                        {loader ? (
                            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
                        ) : (
                            "ACTUALIZAR"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditarProveedor;
