import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Titulo from "../../../../common/Titulo";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import { useEffect, useState } from "react";
import Modal from "../../../../common/Modal";
import LoaderModal from "../../../../common/LoaderModal";
import { FaNewspaper } from "react-icons/fa6";
import CargarDocumento from "./CargarDocumento";

const TablaDocumentos = ({ sectorId }) => {
    const [loader, setLoader] = useState(false);
    const [showCargarDocu, setShowCargarDocu] = useState(false);
    const [showDocu, setShowDocu] = useState(false);
    const [documento, setDocumento] = useState(false);
    const [datos, setDatos] = useState([]);

    const fetchDocumentos = async () => {
        if (!sectorId) return;

        try {
            const { data } = await axios(url + `insumo/comprobante/${sectorId}`);

            setDatos(data);
        } catch (error) {
            console.error("Error al obtener documentos:", error);
        }
    };

    useEffect(() => {
        fetchDocumentos();
    }, [sectorId]);

    const handleShowDoc = (doc) => {
        setDocumento(doc);
        setShowDocu(true);
    };

    const deleteInsumo = (id, id_sector, nombre) => {
        const datos = { id: id, id_sector: id_sector };

        Swal.fire({
            title: `¿Quieres eliminar el insumo "${nombre}" definitivamente?`,
            showDenyButton: true,
            confirmButtonText: "Si",
            denyButtonText: `No`,
            confirmButtonColor: "#86C394",
            denyButtonColor: "#D64747",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoader(true);
                axios
                    .delete(`${url}insumo/comprobante/${id}`)

                    .then(() => {
                        Swal.fire({
                            title: `¡Insumo "${nombre}" eliminado con éxito!`,
                            confirmButtonText: "OK",
                            icon: "success",
                            confirmButtonColor: "#86C394",
                        }).then(() => {
                            setLoader(false);
                            setDatos((prev) => prev.filter((doc) => doc.id !== id));
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
            } else if (result.isDenied) {
                setLoader(false);
                return;
            }
        });
    };

    return (
        <div className="space-y-2 items-start w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <Titulo text="DOCUMENTOS ADJUNTOS" />
                <button onClick={() => setShowCargarDocu(true)} className="boton_verde mt-3 sm:mt-0 sm:ml-4">
                    AGREGAR DOCUMENTO
                </button>
            </div>
            <div className="w-full scrollbar overflow-auto">
                <div className="h-full max-h-[400px] min-w-[648px]">
                    <table className="border-separate text-lg w-full relative">
                        <thead className="sticky top-0 bg-white-bg3 z-10">
                            <tr className="bg-white-bg3 text-center">
                                <td>Detalle del documento</td>
                                <td>Fecha de carga</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {datos.length ? (
                                datos.map((d, index) => (
                                    <tr key={index} className={`text-center bg-white-bg`}>
                                        <td className="truncate px-1">{d.detalle}</td>
                                        <td className="truncate px-1">{d.fecha.split("-").join("/")}</td>
                                        <td
                                            onClick={() => handleShowDoc(d.url)}
                                            className="hover:bg-button-green_hover bg-button-green text-white-bg text-2xl cursor-pointer w-8"
                                        >
                                            <FaNewspaper className="mx-auto" />
                                        </td>
                                        <td className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8">
                                            <MdDelete
                                                onClick={() => deleteInsumo(d.id, d.id_sector, d.detalle)}
                                                className="mx-auto"
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center text-white-bg3">
                                        No se encontraron documentos cargados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <button className="boton_rojo sm:hidden">ADJUNTAR DOCUMENTO</button>

            {loader ? (
                <Modal>
                    <LoaderModal textLoader="Eliminado insumo..." />
                </Modal>
            ) : null}

            {showCargarDocu ? (
                <Modal>
                    <CargarDocumento
                        setCloseModal={setShowCargarDocu}
                        id_sector={sectorId}
                        fetchDocumentos={fetchDocumentos}
                    />
                </Modal>
            ) : null}

            {showDocu ? (
                <Modal>
                    <div className="w-full flex justify-between pb-2">
                        <Titulo text="DOCUMENTO DE INSEMINACION" />
                        <button onClick={() => setShowDocu(false)} className="boton_rojo">
                            VOLVER
                        </button>
                    </div>
                    <img
                        src={documento}
                        alt="Imagen cargada en liquidación"
                        className="w-[450px] lg:w-[450px] aspect-[16/16] object-cover scrollbar overflow-auto"
                    />
                </Modal>
            ) : null}
        </div>
    );
};

export default TablaDocumentos;
