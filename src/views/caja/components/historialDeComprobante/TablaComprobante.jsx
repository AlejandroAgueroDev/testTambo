import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import { useEffect, useState } from "react";
import { LuInfo } from "react-icons/lu";
import DataComrprobante from "./DataComprobante";
import Modal from "../../../../common/Modal";

const TablaComprobante = () => {
    const [comprobantes, setComprobantes] = useState([]);
    const [loader, setLoader] = useState(true);

    const [showDataComp, setShowDataComp] = useState(false);
    const [dataComp, setDataComp] = useState({});

    const handleShowComp = (comp) => {
        setShowDataComp(true);
        setDataComp(comp);
    };

    useEffect(() => {
        const obtenerComprobantes = async () => {
            try {
                const { data } = await axios.get(`${url}caja/cargar-comprobante`);
                setComprobantes(data.reverse());
                setLoader(false);
            } catch (error) {
                console.error("Error al obtener las facturas emitidas:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudieron cargar las facturas emitidas.",
                });
            }
        };

        obtenerComprobantes();
    }, []);

    return (
        <div className="space-y-1 pt-2">
            <div className="w-full scrollbar overflow-auto bg-white-bg">
                <div className="h-[800px] max-h-[70dvh] min-w-[648px]">
                    {loader ? (
                        <p>Cargando datos...</p>
                    ) : (
                        <table className="border-separate text-lg w-full relative">
                            <thead className="sticky top-0 bg-white-bg3 z-10">
                                <tr className="bg-white-bg3 text-white-bg text-center">
                                    <td>Fecha</td>
                                    <td>Tipo Comp.</td>
                                    <td>N° Comprobante</td>
                                    <td>Emisor</td>
                                    <td>Importe total</td>
                                    <td>Sector inputado</td>
                                </tr>
                            </thead>
                            <tbody>
                                {comprobantes.length ? (
                                    comprobantes.map((f) => (
                                        <tr key={f.id} className="bg-white-bg2 text-center">
                                            <td className="px-1">{f.fecha.split("-").reverse().join("/") || "-"}</td>
                                            <td className="px-1">{f.tipo_comprobante || "-"}</td>
                                            <td className="px-1">{f.numero_factura || "-"}</td>
                                            <td className="px-1">{f.razon_social || "-"}</td>
                                            <td className="px-1">$ {f.total_general || "-"}</td>
                                            <td className="px-1">{f.nombre_sector || "-"}</td>
                                            <td className="hover:bg-button-green_hover bg-button-green text-white-bg text-2xl cursor-pointer w-8">
                                                <LuInfo onClick={() => handleShowComp(f)} className="m-auto" />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            Aun no hay comprobantes cargados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showDataComp && (
                <Modal>
                    <DataComrprobante onClose={setShowDataComp} data={dataComp} />
                </Modal>
            )}
        </div>
    );
};

export default TablaComprobante;
