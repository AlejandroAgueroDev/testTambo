import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";

const CargarDocumento = ({ setCloseModal, id_sector, fetchDocumentos }) => {
    const [formDocumento, setFormDocumento] = useState({
        detalle: "",
        fecha: obtenerFechaActual("dato"),
        image: "",
        id_sector: id_sector,
    });

    const [loader, setLoader] = useState(false);

    const handleSelectFile = (event) => {
        const file = event.target.files[0]; // Toma el primer archivo seleccionado
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(",")[1];
                setFormDocumento({ ...formDocumento, image: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCargarDocumento = () => {
        if (!formDocumento.image) {
            return Swal.fire({
                title: "Agregue un documento para continuar",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                iconColor: "#D64747",
                icon: "warning",
            });
        }
        setLoader(true);
        axios
            .post(url + "insumo/comprobante", formDocumento)
            .then((res) => {
                setLoader(false);
                Swal.fire({
                    title: "¡Documento cargado con éxito!",
                    confirmButtonText: "Aceptar",
                    icon: "success",
                    confirmButtonColor: "#86C394",
                }).then(() => {
                    fetchDocumentos();
                    setCloseModal(false);
                });
            })
            .catch((error) => {
                setLoader(false);
                console.log(error);
                Swal.fire({
                    title: "Ocurrio un error inesperado, intente nuevamente",
                    text: error.message === "Network Error" ? "Contacte con el servicio técnico" : error,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#D64747",
                    icon: "error",
                });
            });
    };

    return (
        <div className="flex flex-col space-y-2 items-start w-[90vw] sm:w-[500px]">
            <div className="w-full flex justify-between">
                <Titulo text={`CARGAR DOCUMENTO`} />
            </div>

            <div className="w-full space-y-3">
                <div className="flex flex-col  w-full">
                    <label className="text-xl font-semibold text-white-bg3">Nombre</label>
                    <textarea
                        onChange={(e) => setFormDocumento({ ...formDocumento, detalle: e.target.value })}
                        placeholder="Aclaraciones sobre este documento"
                        type="text"
                        className="bg-white-bg2 text-black-comun py-2 px-5 text-xl w-full grow max-h-20 min-h-20"
                    />
                </div>

                <div className="flex flex-col w-full">
                    <label className="text-xl font-semibold text-white-bg3">Documento</label>
                    <input
                        onChange={handleSelectFile}
                        type="file"
                        className="bg-white-bg2 text-black-comun py-2 px-5 text-xl cursor-pointer"
                    />
                </div>

                <div className="w-full flex justify-end space-x-3">
                    <button onClick={() => setCloseModal(false)} className="boton_rojo">
                        CANCELAR
                    </button>
                    <button onClick={handleCargarDocumento} className="boton_verde">
                        {loader ? (
                            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
                        ) : (
                            "CARGAR"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CargarDocumento;
