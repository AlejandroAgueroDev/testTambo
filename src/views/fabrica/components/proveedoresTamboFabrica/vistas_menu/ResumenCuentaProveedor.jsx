import Titulo from "../../../../../common/Titulo";
import ContenedorGeneral from "../../../../../common/ContenedorGeneral";
import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { url } from "../../../../../common/URL_SERVER";
import { exportToExcel } from "../../../../../common/exportToExcel";

const ResumenCuentaProveedorTambo = () => {
    const { id } = useParams();
    const location = useLocation();
    const [resumen, setResumen] = useState([]);
    const [proveedor, setProveedor] = useState(location.state?.proveedor || {});

    useEffect(() => {
        // Si no hay proveedor en el state, buscarlo por id
        if (!proveedor.id) {
            axios.get(`${url}proveedor/${id}`).then(({ data }) => {
                setProveedor(data.tamboProveedor || {});
            });
        }
        axios(`${url}proveedor/resumen/${id}?tipo=TAMBO_PROVEEDOR`).then(({ data }) => {
            const dataFormat = data.resumen.map((d) => {
                const fechaFinal = d.fecha.split("T")[0].split("-").reverse().join("/");
                return { ...d, fecha: fechaFinal };
            });
            setResumen(dataFormat.reverse());
        });
    }, [id]);

    const handleDonwload = () => {
        const headers = ["Fecha", "Detalle", "Debe ($)", "Haber ($)"];
        exportToExcel(`ResumenCuenta_${proveedor.nombre_empresa}`, headers, resumen);
    };

    return (
        <ContenedorGeneral navText="FABRICA | TAMBO">
            {/* cabecera */}
            <div className="w-screen md:w-full flex md:justify-between md:pl-0 md:pr-0 justify-center items-center pl-14 pr-4 text-center space-x-3">
                <Titulo text="RESUMEN DE CUENTA" />
                <Link to={`/fabrica/vistaProveedorTamboFabrica/${id}`} className="boton_rojo mt-4 sm:mt-0">
                    VOLVER
                </Link>
            </div>

            <div className="h-screen">
                <div className="bg-white-bg flex flex-col justify-between space-y-2 p-4 h-full">
                    <div className="flex space-x-4">
                        <div className="flex flex-col sm:flex-row justify-center items-center">
                            <p className="font-semibold text-white-bg3">Nombre</p>
                            <p className="bg-white-bg2 px-2 py-1 text-xl w-full sm:w-auto">
                                {proveedor.nombre_empresa}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center items-center">
                            <p className="font-semibold text-white-bg3">Localidad</p>
                            <p className="bg-white-bg2 px-2 py-1 text-xl w-full sm:w-auto">{proveedor.localidad}</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-auto bg-white-bg2">
                        <table className="border-separate text-lg w-full">
                            <thead>
                                <tr className="bg-white-bg3 text-white-bg text-center">
                                    <th>Fecha</th>
                                    <th>Detalle</th>
                                    <th className="w-36">Debe ($)</th>
                                    <th className="w-36">Haber ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resumen.length ? (
                                    resumen.map((r) => (
                                        <tr key={r.id} className="bg-white-bg">
                                            <td className="px-1 text-center">{r.fecha}</td>
                                            <td className="px-1">
                                                <strong>{r.detalle.split("|")[0]}</strong> |
                                                {r.detalle.split("|")[1] || ""}
                                            </td>
                                            <td className="px-1">{r.debe ? `$ ${r.debe.toFixed(2)}` : null}</td>
                                            <td className="px-1">{r.haber ? `$ ${r.haber.toFixed(2)}` : null}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-white-bg3">
                                            No se encontraron movimientos en esta cuenta.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-wrap items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                            <p className="font-semibold text-black">SALDO HACIA EL PROVEEDOR:</p>
                            <p className="bg-white-bg2 px-2 py-2 text-xl w-full sm:w-auto">$ {proveedor.saldo}</p>
                        </div>
                        <button onClick={handleDonwload} className="boton_verde mt-4 sm:mb-0">
                            DESCARGAR RESUMEN CUENTA
                        </button>
                    </div>
                </div>
            </div>
        </ContenedorGeneral>
    );
};

export default ResumenCuentaProveedorTambo;
