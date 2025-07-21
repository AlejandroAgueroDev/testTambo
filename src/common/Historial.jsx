import { useState } from "react";
import Titulo from "./Titulo";
import Modal from "./Modal";
import { FaNewspaper } from "react-icons/fa6";

const Historial = ({ setCloseModal, title, arrayHeader, arrayContent, placeHolder, ultimosRetiros = false }) => {
    const [modalTexto, setModalTexto] = useState(null);

    const [showArchivo, setShowArchivo] = useState(false);
    const [archivo, setArchivo] = useState("");

    const handleShowArchivo = (arch) => {
        setArchivo(arch);
        setShowArchivo(true);
    };

    return (
        <div className="flex flex-col space-y-2 items-start w-[95vw] md:w-[85vw]">
            <div className="w-full flex justify-between">
                <Titulo text={title} />
                <button onClick={() => setCloseModal(false)} className="boton_rojo">
                    VOLVER
                </button>
            </div>
            <div className="w-full scrollbar overflow-auto">
                <div className="h-full max-h-[70dvh] min-w-[648px]">
                    <table className="border-separate text-lg w-full relative">
                        <thead className="sticky top-0 bg-white-bg3 z-10">
                            <tr className="bg-white-bg3 text-center">
                                {arrayHeader.map((ah) => (
                                    <td key={ah}>{ah}</td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {arrayContent.length ? (
                                arrayContent.map((ac, i) => (
                                    <tr key={i} className="bg-white-bg2 text-center">
                                        {ac.map((c, j) =>
                                            j === ac.length - 1 ? (
                                                <td className="w-8">
                                                    <button
                                                        onClick={() => handleShowArchivo(ac[ac.length - 1])} // Usar el último elemento como comprobante
                                                        className={
                                                            ac[ac.length - 1] && ac[ac.length - 1] !== "-"
                                                                ? "hover:bg-button-green_hover bg-button-green text-white-bg text-[20px] cursor-pointer w-8 h-8 flex items-center justify-center"
                                                                : "bg-gray-400 text-white-bg text-[20px] cursor-not-allowed w-8 h-8 flex items-center justify-center mx-auto"
                                                        }
                                                        title={
                                                            ac[ac.length - 1] && ac[ac.length - 1] !== "-"
                                                                ? "Ver comprobante"
                                                                : "Sin comprobante"
                                                        }
                                                        disabled={!ac[ac.length - 1] || ac[ac.length - 1] === "-"}
                                                    >
                                                        <FaNewspaper className="mx-auto" />
                                                    </button>
                                                </td>
                                            ) : (
                                                <td
                                                    key={j}
                                                    className={`px-2 py-1 max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis ${
                                                        j === 5 ? "cursor-pointer hover:underline" : ""
                                                    }`}
                                                    onClick={() => j === 5 && c !== "-" && setModalTexto(c)}
                                                    title={j === 5 ? "Ver aclaración completa" : ""}
                                                >
                                                    {c}
                                                </td>
                                            )
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={arrayHeader.length} className="text-center text-white-bg3 py-4">
                                        {placeHolder}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal flotante para mostrar aclaración completa */}
            {modalTexto && (
                <Modal>
                    <div className="flex flex-col space-y-4 items-start w-[380px] sm:w-[560px]">
                        <div className="w-full flex justify-between">
                            <Titulo text="ACLARACION COMPLETA" />
                        </div>
                        <div className="w-full max-h-[300px] scrollbar overflow-auto border border-gray-300 rounded p-4 bg-white-bg2">
                            <p className="text-lg text-black-comun whitespace-pre-line">{modalTexto}</p>
                        </div>
                        <div className="w-full flex justify-end">
                            <button onClick={() => setModalTexto(null)} className="boton_rojo">
                                VOLVER
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Modal para mostrar imagen */}
            {showArchivo && (
                <Modal>
                    <div className="w-full flex justify-between pb-2">
                        <Titulo text="DOCUMENTO ADJUNTO" />
                        <button onClick={() => setShowArchivo(false)} className="boton_rojo">
                            VOLVER
                        </button>
                    </div>
                    <img
                        src={archivo}
                        alt="Imagen de comrpobante."
                        className="w-[300px] lg:w-[450px] sm:aspect-[10/12] aspect-[8/8] object-cover ml-10 sm:ml-0 scrollbar overflow-auto"
                    />
                </Modal>
            )}
        </div>
    );
};

export default Historial;
