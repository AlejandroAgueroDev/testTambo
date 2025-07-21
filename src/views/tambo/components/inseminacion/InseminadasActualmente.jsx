import Titulo from "../../../../common/Titulo";
import Paginador from "../../../../common/Paginador";
import { FaNewspaper } from "react-icons/fa6";
import axios from "axios";
import { useState, useEffect } from "react";
import { url } from "../../../../common/URL_SERVER";
import LoaderDatos from "../../../../common/LoaderDatos";
import Modal from "../../../../common/Modal";
import Swal from "sweetalert2";

const InseminadasActualmente = ({ setCloseModal, allInseminaciones }) => {
    const [loader, setLoader] = useState(true);
    const [ganadoIns, setGanadoIns] = useState([]);

    useEffect(() => {
        setLoader(true);
        axios(url + "tambo/ganado?limit=99999999999999").then(({ data }) => {
            const inseminadas = data.data.filter((d) => d.inseminado);
            console.log(inseminadas);

            const ganadoInseminado = inseminadas.map((i) => {
                const datosIns = allInseminaciones.find((ins) => ins.caravana === i.caravana);
                return {
                    idAnimal: i.id,
                    caravana: i.caravana,
                    sexado: datosIns?.sexado || "-",
                    pajuela: datosIns?.pajuela || "-",
                    fecha: datosIns?.fecha || "-",
                };
            });

            setGanadoIns(ganadoInseminado);
            setLoader(false);
        });
    }, []);

    const cancelarAbortar = (id, caravana) => {
        Swal.fire({
            title: `¿Quieres cancelar la inseminación del animal con caravana "${caravana}"?`,
            showDenyButton: true,
            confirmButtonText: "Si",
            denyButtonText: `No`,
            confirmButtonColor: "#86C394",
            denyButtonColor: "#D64747",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoader(true);
                axios
                    .put(url + "tambo/ganado/inseminacion/abortar", { id })
                    .then((res) => {
                        Swal.fire({
                            title: `¡Inseminación cancelada con éxito!`,
                            confirmButtonText: "Aceptar",
                            icon: "success",
                            confirmButtonColor: "#86C394",
                        }).then(() => {
                            setLoader(false);
                            window.location.reload();
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
        <div className="flex flex-col space-y-2 items-start w-[95vw] md:w-[85vw]">
            <div className="w-full flex justify-between">
                <Titulo text="INSEMINADAS ACTUALMENTE" />
                <button onClick={() => setCloseModal(false)} className="boton_rojo">
                    VOLVER
                </button>
            </div>
            {loader ? (
                <LoaderDatos textLoader="Cargando ganado inseminado" />
            ) : (
                <div className="w-full scrollbar overflow-auto">
                    <div className="h-full max-h-[80dvh] min-w-[648px]">
                        <table className="border-separate text-lg w-full relative">
                            <thead className="sticky top-0 bg-white-bg3 z-10">
                                <tr className="bg-white-bg3 text-center">
                                    <td>Caravana</td>
                                    <td>Fecha de inseminación</td>
                                    <td>Sexado</td>
                                    <td>Pajuela</td>
                                </tr>
                            </thead>
                            <tbody>
                                {ganadoIns.length ? (
                                    ganadoIns.map((ac, index) => (
                                        <tr key={index} className="bg-white-bg2 text-center">
                                            <td className="text-black-comun text-xl  w-6 px-1">{ac.caravana}</td>
                                            <td className="text-black-comun text-xl  w-6 px-1">
                                                {ac.fecha === "-"
                                                    ? "-"
                                                    : ac.fecha.split("T")[0].split("-").reverse().join("/")}
                                            </td>
                                            <td className="text-black-comun text-xl  w-6 px-1">{ac.sexado}</td>
                                            <td className="text-black-comun text-xl  w-6 px-1">{ac.pajuela}</td>
                                            <td
                                                onClick={() => cancelarAbortar(ac.idAnimal, ac.caravana)}
                                                className=" bg-button-red hover:bg-button-red_hover cursor-pointer text-xl text-white-bg2  w-6 px-1"
                                            >
                                                Cancelar / Abortar
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <p>No hay ganado inseminado actualmente</p>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InseminadasActualmente;
