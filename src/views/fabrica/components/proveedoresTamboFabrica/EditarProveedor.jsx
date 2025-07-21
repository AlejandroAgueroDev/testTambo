import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";

const EditarProveedor = ({ setCloseModal, editProveedor, fetchProveedorTambo }) => {
    const [loader, setLoader] = useState(false);
    const [formProveedor, setFormProveedor] = useState(editProveedor);

    const handleForm = (e) => {
        const { name, value } = e.target;
        setFormProveedor({ ...formProveedor, [name]: value });
    };

    const handleUpdate = async () => {
        if (!formProveedor.nombre_empresa || !formProveedor.contacto_1 || !formProveedor.localidad) {
            return Swal.fire({
                title: "Complete los campos necesarios para actualizar el proveedor",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "warning",
            });
        }

        setLoader(true);
        try {
            const dataEdit = { ...formProveedor, isTamboProveedor: true };
            const { data } = await axios.put(`${url}proveedor`, dataEdit);

            setLoader(false);
            const result = await Swal.fire({
                title: "¡Proveedor actualizado con éxito!",
                confirmButtonText: "Aceptar",
                icon: "success",
                confirmButtonColor: "#86C394",
            });

            if (result.isConfirmed) {
                setCloseModal(false);
                fetchProveedorTambo();
            }
        } catch (error) {
            setLoader(false);
            console.error("Error al actualizar el proveedor:", error);
            Swal.fire({
                title: "Ocurrió un error inesperado, intente nuevamente",
                text: error.message === "Network Error" ? "Contacte con el servicio técnico" : error.message,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "error",
            });
        }
    };

    return (
        <div className="flex flex-col space-y-2 items-start w-[380px] sm:w-[500px]">
            <Titulo text={`EDITAR PROVEEDOR`} />
            <div className="w-full space-y-3">
                <div className="containerInput">
                    <label className="labelInput">
                        Nombre del tambo<strong className="text-red-400">*</strong>
                    </label>
                    <input
                        type="text"
                        onChange={handleForm}
                        name="nombre_empresa"
                        value={formProveedor.nombre_empresa || ""}
                        className="input"
                    />
                </div>

                <div className="containerInput">
                    <label className="labelInput">
                        Contacto 1<strong className="text-red-400">*</strong>
                    </label>
                    <input
                        type="text"
                        onChange={handleForm}
                        name="contacto_1"
                        value={formProveedor.contacto_1 || ""}
                        className="input"
                    />
                </div>

                <div className="containerInput">
                    <label className="labelInput">Contacto 2</label>
                    <input
                        type="text"
                        onChange={handleForm}
                        name="contacto_2"
                        value={formProveedor.contacto_2 || ""}
                        className="input"
                    />
                </div>

                <div className="containerInput">
                    <label className="labelInput">
                        Localidad<strong className="text-red-400">*</strong>
                    </label>
                    <input
                        type="text"
                        onChange={handleForm}
                        name="localidad"
                        value={formProveedor.localidad || ""}
                        className="input"
                    />
                </div>

                <div className="w-full flex justify-end space-x-3">
                    <button onClick={() => setCloseModal(false)} className="boton_rojo">
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
