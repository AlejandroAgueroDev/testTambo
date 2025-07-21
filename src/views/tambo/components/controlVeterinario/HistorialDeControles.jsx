import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ContenedorGeneral from "../../../../common/ContenedorGeneral";
import Swal from "sweetalert2";
import axios from "axios";
import Paginador from "../../../../common/Paginador";
import { FaNewspaper } from "react-icons/fa6";
// import ControlDatos from "./ControlDatos";
import DatosControlVeterinario from "./DatosControlVeterinario";
import Modal from "../../../../common/Modal";
import { url } from "../../../../common/URL_SERVER";

const HistorialDeControlesVeterinarios = () => {
    const { origen } = useParams();
    // const [controles, setControles] = useState([]);
    const [cantidadPaginas, setCantidadPaginas] = useState(0);
    const [paginaActual, setPaginaActual] = useState(0);

    const [showModalDatos, setShowModalDatos] = useState(false);
    const [datosModal, setDatosModal] = useState({});

    const [controles, setControles] = useState([]);

    const handleMostrarInforme = (datos) => {
        setDatosModal(datos);
        setShowModalDatos(true);
    };

    //!CUANDO PUEDA TRAER DATOS
    useEffect(() => {
        axios(url + "tambo/controlveterinario")
            .then(({ data }) => {
                const recientes = data.map((cargado) => {
                    const fecha = cargado.createdAt.split("T")[0];
                    const arrayFecha = fecha.split("-");
                    const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
                    return {
                        ...cargado,
                        fecha: fechaFinal,
                    };
                });

                setControles(recientes);
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <ContenedorGeneral navText="TAMBO">
            <div className="w-screen md:w-full flex sm:hidden justify-between pl-10 sm:pl-14 md:pl-0 pr-4 md:pr-0 pt-1">
                <Titulo text="HISTORIAL DE CONTROLES" />

                <Link to={`/control-veterinario/${origen}`} className="boton_rojo">
                    VOLVER
                </Link>
            </div>
            <div className="w-screen md:w-full hidden sm:flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="HISTORIAL DE CONTROL VETERINARIO" />

                <Link to={`/control-veterinario/${origen}`} className="boton_rojo">
                    VOLVER
                </Link>
            </div>

            <div className="w-full flex flex-col space-y-2 sm:bg-white-bg pt-2">
                <p>Seleccione registro para ver su informe.</p>

                <div className="w-full h-[400px] scrollbar overflow-auto space-y-3">
                    <table className="border-separate text-lg w-full text-black-comun">
                        <thead className="sticky top-0 bg-white-bg3 z-10">
                            <tr className="bg-white-bg3 text-center">
                                <td>Fecha</td>
                                <td>Veterinario</td>
                                <td>Cantidad de animales</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody className="relative">
                            {controles.length ? (
                                controles.map((c) => (
                                    <tr key={c.id} className="bg-white-bg2 text-center">
                                        <td>{c.fecha}</td>
                                        <td>{c.veterinario}</td>
                                        <td>{c.Ganados.length}</td>
                                        <td
                                            onClick={() => handleMostrarInforme(c)}
                                            className="hover:bg-button-green_hover
                                            bg-button-green text-white-bg text-xl cursor-pointer w-8"
                                        >
                                            <FaNewspaper className="mx-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <p className="text-white-bg3 absolute text-md">
                                    No hay controles veterinarios cargados
                                </p>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className={cantidadPaginas <= 1 ? "hidden" : "block"}>
                    <Paginador
                        cantidadPaginas={cantidadPaginas}
                        paginaActual={paginaActual}
                        setPagina={setPaginaActual}
                    />
                </div>
            </div>

            {showModalDatos ? (
                <Modal>
                    <DatosControlVeterinario setCloseModal={setShowModalDatos} datos={datosModal} />
                </Modal>
            ) : null}
        </ContenedorGeneral>
    );
};

export default HistorialDeControlesVeterinarios;
