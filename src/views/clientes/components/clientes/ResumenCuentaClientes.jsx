import Titulo from "../../../../common/Titulo";
import ContenedorGeneral from "../../../../common/ContenedorGeneral";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import { Link, useLocation } from "react-router";

import { exportToExcel } from "../../../../common/exportToExcel";

const ResumenCuentaCliente = () => {
    const location = useLocation();
    const cliente = location.state?.cliente;
    const { id } = useParams();
    const [resumen, setResumen] = useState([]);
    const { sector_titulo, sector_nombre } = useParams();

    useEffect(() => {
        axios(url + "cliente/resumen/" + id + "?tipo=CLIENTE").then(({ data }) => {
            const dataFormat = data.resumen.map((d) => {
                const fechaFinal = d.fecha.split("T")[0].split("-").reverse().join("/");
                return { ...d, fecha: fechaFinal };
            });
            setResumen(dataFormat.reverse());
        });
    }, []);

    const handleDonwload = () => {
        const headers = ["Fecha", "Detalle", "Debe ($)", "Haber ($)"];
        exportToExcel(`ResumenCuenta_${cliente.nombre_empresa}`, headers, resumen);
    };

    return (
        <ContenedorGeneral navText={sector_titulo.toUpperCase()}>
            {/* cabecera */}
            <div className="flex justify-between">
                <Titulo text="RESUMEN DE CUENTA" />

                <Link to={`/cliente/${cliente.id}/${sector_titulo}/${sector_nombre}`} className="boton_rojo">
                    VOLVER
                </Link>
            </div>

            <div className="h-screen">
                {/* Contenedor padre con alto definido (puedes ajustar esto según tu necesidad) */}
                <div className="bg-white-bg flex flex-col justify-between space-y-2 p-2 h-full">
                    {/* Primer div */}
                    <div className="flex space-x-4">
                        <div>
                            <p className="font-semibold text-white-bg3">Nombre</p>
                            <p className="bg-white-bg2 px-2 py-1 text-xl min-w-64">{cliente.nombre_empresa}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-white-bg3">Localidad</p>
                            <p className="bg-white-bg2 px-2 py-1 text-xl min-w-64">{cliente.localidad}</p>
                        </div>
                    </div>

                    {/* Segundo div (Tabla) */}
                    <div className="flex-1 scrollbar overflow-y-auto overflow-x-hidden bg-white-bg2">
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
                                        <tr
                                            key={r.id}
                                            className="bg-white-bg hover:bg-[#cac8c8] cursor-pointer"
                                            onClick={() => handleshowRemito(r.detalle)}
                                        >
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
                                    <td colSpan="7" className="text-center text-white-bg3">
                                        No se encontraron movimientos en esta cuenta.
                                    </td>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Tercer div */}
                    <div className="flex items-center justify-between">
                        <button onClick={handleDonwload} className="boton_verde">
                            DESCARGAR RESUMEN CUENTA
                        </button>
                        <div className="flex items-center space-x-2">
                            <p className="font-semibold text-black">SALDO TOTAL:</p>
                            <p className="bg-white-bg2 px-2 py-2 text-xl min-w-52">$ {cliente.saldo}</p>
                        </div>
                    </div>
                </div>
            </div>

        </ContenedorGeneral>
    );
};

export default ResumenCuentaCliente;
