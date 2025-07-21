import { useState, useEffect } from "react";
import Modal from "../../../../common/Modal";
import Historial from "../../../../common/Historial";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import { Link } from "react-router-dom";
import LoaderDatos from "../../../../common/LoaderDatos";

const UltimosRetiros = ({ refreshRetiros }) => {
    //? LOADER
    const [loaderTabla, setLoaderTabla] = useState(true);
    const [showHistorial, setShowHistorial] = useState(false);
    const [cargadosRecientemente, setCargadosRecientemente] = useState([]);
    const [dataCargada, setDataCargada] = useState(false);
    //! DATOS PARA HISTORIAL
    const arrayHeader = [
        "Fecha",
        "Hora de carga",
        "Hora de retiro",
        "Litros",
        "Encargado del retiro",
        "Aclaraciones",
        "Liquidado",
        "Proveedor",
    ];
    const [arrayContent, setArrayContent] = useState([]);

    const formatearFecha = (fechaISO) => {
        const fecha = fechaISO.split("T")[0];
        const arrayFecha = fecha.split("-");
        return `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
    };

    const cargarRetirosRecientes = async () => {
        try {
            const response = await axios.get(url + "fabrica/compraleche");
            if (Array.isArray(response.data) && response.data.length > 0) {
                const recientes = response.data.map((cargado) => ({
                    id: cargado.id,
                    fecha: formatearFecha(cargado.fecha),
                    liquidado: cargado.liquidado,
                    cantidad: cargado.cantidad,
                    tamboProveedor: cargado.TamboProveedor?.nombre_empresa,
                }));

                setCargadosRecientemente(recientes.reverse());
            } else {
                setCargadosRecientemente([]);
            }
            return true;
        } catch (error) {
            console.error("Error al cargar retiros recientes:", error);
            return false;
        }
    };

    // Función para cargar historial
    const cargarHistorial = async () => {
        try {
            const response = await axios.get(url + "fabrica/compraleche");
            if (Array.isArray(response.data) && response.data.length > 0) {
                const historial = response.data.map((r) => [
                    formatearFecha(r.fecha),
                    r.hora_carga || "—",
                    r.hora_retiro || "—",
                    r.cantidad || 0,
                    r.encargado_retiro || "—",
                    r.aclaracion || "—",
                    r.liquidado ? "Sí" : "No",
                    r.TamboProveedor?.nombre_empresa || "—",
                    r.acta_url,
                ]);
                console.log("Historial cargado:", historial);

                setArrayContent(historial.reverse()); // más recientes primero
                return true;
            } else {
                setArrayContent([]);
                return true;
            }
        } catch (error) {
            console.error("Error al cargar historial:", error);
            setArrayContent([]);
            return false;
        }
    };

    // Función para cargar todos los datos
    const cargarDatos = async () => {
        setLoaderTabla(true);

        try {
            const promesaRecientes = cargarRetirosRecientes();
            const promesaHistorial = cargarHistorial();

            const [recientesOk, historialOk] = await Promise.all([promesaRecientes, promesaHistorial]);

            setDataCargada(recientesOk || historialOk);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            setDataCargada(false);
        } finally {
            setLoaderTabla(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [refreshRetiros]);

    return (
        <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full">
            <div className="flex w-full">
                <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">CARGADOS RECIENTEMENTE</h2>
            </div>
            {loaderTabla ? (
                <LoaderDatos textLoader="Cargando ultimos retiros" />
            ) : (
                <div className="flex flex-col w-full h-full">
                    <p className="text-start w-full">Se mostraran los ultimos diez (10) retiros de leche.</p>
                    <div className="min-h-[300px] h-[83%] w-full scrollbar overflow-auto">
                        <table className="border-separate text-lg w-full text-black-comun">
                            <thead className="sticky top-0 bg-white-bg3 z-10">
                                <tr className="bg-white-bg3 text-center">
                                    <td>Fecha</td>
                                    <td>Liquidado</td>
                                    <td>Litros</td>
                                    <td>Tambo proveedor</td>
                                </tr>
                            </thead>
                            <tbody className="relative">
                                {cargadosRecientemente.length > 0 ? (
                                    cargadosRecientemente.slice(0, 10).map((cargado) => (
                                        <tr key={cargado.id} className="bg-white-bg2 text-center">
                                            <td>{cargado.fecha}</td>
                                            <td>{cargado.liquidado ? "Si" : "No"}</td>
                                            <td>{cargado.cantidad}</td>
                                            <td>{cargado.tamboProveedor}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4">
                                            <p className="text-white-bg3 text-md">
                                                {dataCargada
                                                    ? "No se encontraron datos cargados"
                                                    : "Error al cargar los datos. Intente nuevamente."}
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="space-x-2 flex justify-end w-full">
                        <Link to="/fabrica/proveedorTambosFabrica" className="boton_rojo">
                            PROVEEDORES DE LECHE
                        </Link>
                        <button onClick={() => setShowHistorial(true)} className="boton_verde">
                            HISTORIAL DE RETIROS
                        </button>
                    </div>
                </div>
            )}

            {showHistorial ? (
                <Modal>
                    <Historial
                        setCloseModal={setShowHistorial}
                        title="HISTORIAL DE RETIROS"
                        arrayHeader={arrayHeader}
                        arrayContent={arrayContent}
                        placeHolder="Aun no se cargaron retiros."
                        ultimosRetiros={true}
                    />
                </Modal>
            ) : null}
        </div>
    );
};

export default UltimosRetiros;
