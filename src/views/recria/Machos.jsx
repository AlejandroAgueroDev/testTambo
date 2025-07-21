import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import VenderMachos from "./components/machos/VenderMachos";
import { url } from "../../common/URL_SERVER";
import { FaPlus, FaNewspaper } from "react-icons/fa6";
import Swal from "sweetalert2";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
//?COMPONENTS
import ContenedorGeneral from "../../common/ContenedorGeneral";
import Titulo from "../../common/Titulo";
import Modal from "../../common/Modal";
import AddMovimientos from "./components/machos/AddMovimiento";
import LoaderDatos from "../../common/LoaderDatos";

const Machos = () => {
    const [showVender, setShowVender] = useState(false);
    const [contador, setContador] = useState(0);
    const [ultimoIngreso, setUltimoIngreso] = useState("");
    const [movimientos, setMovimientos] = useState(0);
    const [showNewMov, setShowNewMov] = useState(false);
    const [loader, setLoader] = useState(true);
    const [showAchivo, setShowArchivo] = useState(false);
    const [archivo, setArchivo] = useState("");

    const handleShowArchivo = (arch) => {
        setArchivo(arch);
        setShowArchivo(true);
    };

    useEffect(() => {
        axios(url + "recria/macho")
            .then(({ data }) => {
                setLoader(false);
                setContador(data.ternero_contador);

                // Verificar si la fecha existe y tiene un formato adecuado antes de hacer el split
                if (data.ultimo_ingreso && data.ultimo_ingreso.includes("T")) {
                    const fechaDesarm = data.ultimo_ingreso.split("T")[0].split("-");
                    setUltimoIngreso(`${fechaDesarm[2]}/${fechaDesarm[1]}/${fechaDesarm[0]}`);
                } else {
                    setUltimoIngreso("Fecha no válida");
                }

                // Verificar si 'data.movimientos' es un array antes de hacer el .map()
                const movimientosFormat = Array.isArray(data.movimientos)
                    ? data.movimientos.map((mov) => {
                          if (mov.fecha && mov.fecha.includes("T")) {
                              const fechaDesarm = mov.fecha.split("T")[0].split("-");
                              return {
                                  ...mov,
                                  fecha: `${fechaDesarm[2]}/${fechaDesarm[1]}/${fechaDesarm[0]}`,
                              };
                          } else {
                              return { ...mov, fecha: "Fecha no válida" }; // Si la fecha no es válida
                          }
                      })
                    : [];

                setMovimientos(movimientosFormat.reverse());
            })
            .catch((error) => {
                console.error("Error en los datos:", error);
                setLoader(false);
            });
    }, []);

    const recargarDatos = () => {
        setLoader(true);
        axios(url + "recria/macho").then(({ data }) => {
            setLoader(false);
            setContador(data.ternero_contador);

            // Verificar si la fecha existe y tiene un formato adecuado antes de hacer el split
            if (data.ultimo_ingreso && data.ultimo_ingreso.includes("T")) {
                const fechaDesarm = data.ultimo_ingreso.split("T")[0].split("-");
                setUltimoIngreso(`${fechaDesarm[2]}/${fechaDesarm[1]}/${fechaDesarm[0]}`);
            } else {
                setUltimoIngreso("Fecha no válida");
            }

            const movimientosFormat = data.movimientos.map((mov) => {
                // Verificar si la fecha existe y tiene un formato adecuado antes de hacer el split
                if (mov.fecha && mov.fecha.includes("T")) {
                    const fechaDesarm = mov.fecha.split("T")[0].split("-");
                    return {
                        ...mov,
                        fecha: `${fechaDesarm[2]}/${fechaDesarm[1]}/${fechaDesarm[0]}`,
                    };
                } else {
                    return { ...mov, fecha: "Fecha no válida" }; // Si la fecha no es válida
                }
            });

            setMovimientos(movimientosFormat.reverse());
        });
    };

    const handleDeleteMov = (id, text, fecha) => {
        Swal.fire({
            title: `¿Quieres eliminar el movimiento o aclaración cargada el dia ${fecha} con la siguiente descripción?`,
            text: `"${text}"`,
            showDenyButton: true,
            confirmButtonText: "Si",
            denyButtonText: `No`,
            confirmButtonColor: "#86C394",
            denyButtonColor: "#D64747",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(url + `recria/macho/movimientos/${id}`)
                    .then(() => {
                        Swal.fire({
                            title: "Movimiento o aclaracion eliminada con éxito",
                            confirmButtonColor: "#86C394",
                            icon: "success",
                        }).then(() => recargarDatos());
                    })
                    .catch((error) => {
                        Swal.fire({
                            title: "Ocurrio un error inesperado",
                            text: error.message === "Network Error" ? "Contacte con el servicio técnico" : error,
                            confirmButtonColor: "#D64747",
                            icon: "error",
                        });
                    });
            }
        });
    };

    return (
        <ContenedorGeneral navText="RECRIA">
            <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <div className="w-full flex justify-between">
                    <Titulo text="RECRIA | MACHOS" />

                    <Link to="/recria" className="boton_rojo">
                        VOLVER
                    </Link>
                </div>
            </div>

            <div className="h-full w-full pr-4 md:p-2 md:w-auto bg-white-bg2 space-y-5 p-2">
                <div className="flex justify-between">
                    {/* Bloque de Cantidad de Machos */}
                    <div className="flex flex-col space-y-2">
                        <p className="text-xl font-semibold text-white-bg3">Cantidad de machos:</p>
                        {loader ? (
                            <LoaderDatos showText={false} />
                        ) : (
                            <p className="bg-white-bg text-xl px-5 py-1">{contador}</p>
                        )}
                    </div>

                    {/* Bloque de Botones */}
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 text-center items-center">
                        <Link to="/clientes/Recria/recria" className="boton_verde">
                            COMPRADORES
                        </Link>
                        <button onClick={() => setShowVender(true)} className="boton_verde">
                            VENDER TERNEROS
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <p className="text-xl font-semibold text-white-bg3">Movimientos y anotaciones:</p>
                    <div className="w-full h-[65dvh] bg-white-bg p-2 space-y-3 scrollbar overflow-auto border-[3px] border-white-bg">
                        {loader ? (
                            <LoaderDatos textLoader="Cargando datos" />
                        ) : movimientos.length ? (
                            movimientos.map((mov, index) => (
                                <div key={index} className="bg-white-bg2 space-y-2 p-2">
                                    <p className="text-xl">{mov.texto}</p>
                                    <div className="flex w-full justify-between">
                                        <p className="text-xl font-semibold text-white-bg3">{mov.fecha}</p>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => handleShowArchivo(mov.archivo)}
                                                className={
                                                    mov.archivo
                                                        ? "hover:bg-button-green_hover bg-button-green text-white-bg text-[20px] cursor-pointer w-8"
                                                        : "hidden"
                                                }
                                            >
                                                <FaNewspaper className="mx-auto" />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteMov(mov.id, mov.texto, mov.fecha)}
                                                className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8"
                                            >
                                                <MdDelete className="mx-auto" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xl">Sin movimientos ni anotaciones.</p>
                        )}
                    </div>

                    <Tippy
                        content="Agregar movimiento o aclaración"
                        placement={window.innerWidth < 640 ? "top-end" : "left"}
                        arrow={true}
                        theme="custom_2"
                    >
                        <div className="fixed sm:absolute bottom-4 right-4 sm:bottom-2 sm:right-2">
                            <button
                                onClick={() => setShowNewMov(true)}
                                className="bg-button-green hover:bg-button-green_hover text-white-bg2 rounded-full shadow-xl flex items-center justify-center"
                            >
                                <span className="sm:hidden py-3 px-4 text-sm font-semibold">
                                    AGREGAR ACLARACIÓN O MOVIMIENTO
                                </span>

                                <span className="hidden sm:flex p-4">
                                    <FaPlus className="text-xl" />
                                </span>
                            </button>
                        </div>
                    </Tippy>
                </div>
            </div>

            {showVender ? (
                <Modal>
                    <VenderMachos setCloseModal={setShowVender} />
                </Modal>
            ) : null}

            {showNewMov ? (
                <Modal>
                    <AddMovimientos setCloseModal={setShowNewMov} cantidadTerneros={contador} recarga={recargarDatos} />
                </Modal>
            ) : null}

            {showAchivo ? (
                <Modal>
                    <div className="w-full flex justify-between pb-2">
                        <Titulo text="DOCUMENTO ADJUNTO" />
                        <button onClick={() => setShowArchivo(false)} className="boton_rojo">
                            VOLVER
                        </button>
                    </div>
                    <img
                        src={archivo}
                        alt="Imagen cargada en liquidación"
                        className="w-[300px] lg:w-[450px] sm:aspect-[10/12] aspect-[8/8] object-cover ml-10 sm:ml-0 scrollbar overflow-auto"
                    />
                </Modal>
            ) : null}
        </ContenedorGeneral>
    );
};

export default Machos;

{
    /* <div className="flex space-x-3 items-center">
                            <p className="text-xl font-semibold text-white-bg3">Ultimo ingreso:</p>
                            {loader ? (
                                <LoaderDatos showText={false} />
                            ) : (
                                <p className="bg-white-bg text-xl px-5 py-1">{ultimoIngreso || "Sin datos."}</p>
                            )}
                        </div> */
}
