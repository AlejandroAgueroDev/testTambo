import { useState } from "react";
import Titulo from "../../../../common/Titulo";
import Modal from "../../../../common/Modal";
import { FaNewspaper } from "react-icons/fa6";
import { Comprobante } from "../../../caja/components/historialDeFacturas/Comrpobnate";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";

const HistorialDeVentas = ({ setCloseModal, arrayContent }) => {
    const [modalTexto, setModalTexto] = useState(null);

    const [mostrarProductos, setMostrarProductos] = useState(false);
    const [dataProductos, setDataProductos] = useState([]);

    const handleShowProducts = (data) => {
        setDataProductos(data);
        setMostrarProductos(true);
    };

    const [showComprobante, setShowComprobante] = useState(false);
    const [dataComprobante, setDataComprobante] = useState({});

    const handleShowComp = async (numero) => {
        const factura = await axios(url + "afip/facturas/" + numero);
        // console.log(factura);
        setDataComprobante(factura.data);
        setShowComprobante(true);
    };

    return (
        <div className="flex flex-col space-y-2 items-start w-[95vw] md:w-[85vw]">
            <div className="w-full flex justify-between">
                <Titulo text="HISTORIAL DE VENTAS" />
                <button onClick={() => setCloseModal(false)} className="boton_rojo">
                    VOLVER
                </button>
            </div>
            <div className="w-full scrollbar overflow-auto">
                <div className="h-full max-h-[70dvh] min-w-[648px]">
                    <table className="border-separate text-lg w-full relative">
                        <thead className="sticky top-0 bg-white-bg3 z-10">
                            <tr className="bg-white-bg3 text-center">
                                <td>Fecha</td>
                                <td>Comprador</td>
                                <td>Importe</td>
                                <td>Cant. Productos</td>
                                <td>Aclaración</td>
                                <td>Facturado</td>
                            </tr>
                        </thead>
                        <tbody>
                            {arrayContent.length ? (
                                arrayContent.map((ac, i) => (
                                    <tr key={i} className="bg-white-bg2">
                                        <td className="px-1 text-center">
                                            {ac.fecha.split("T")[0].split("-").reverse().join("/")}
                                        </td>
                                        <td className="px-1">{ac.nombre_cliente}</td>
                                        <td className="px-1">$ {ac.monto.toLocaleString()}</td>
                                        <td
                                            className="px-1 text-center hover:bg-[#bdbcbc] cursor-pointer"
                                            onClick={() => handleShowProducts(ac.Productos)}
                                        >
                                            {ac.Productos.length}
                                        </td>
                                        <td
                                            onClick={() => setModalTexto(ac.detalle)}
                                            className={
                                                ac.detalle
                                                    ? "px-1 w-[30%] truncate hover:bg-[#bdbcbc] cursor-pointer"
                                                    : "px-1 w-[30%]"
                                            }
                                        >
                                            {ac.detalle || "-"}
                                        </td>
                                        <td className="pl-1">
                                            {ac.numero_factura ? (
                                                <div className="flex justify-between">
                                                    <p>SI</p>
                                                    <button
                                                        onClick={() => handleShowComp(ac.numero_factura)}
                                                        className="bg-button-green hover:bg-button-green_hover px-2 text-white-bg2"
                                                    >
                                                        <FaNewspaper />
                                                    </button>
                                                </div>
                                            ) : (
                                                "NO"
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={arrayContent.length} className="text-center text-white-bg3 py-4">
                                        No hay ventas cargadas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {mostrarProductos && (
                <Modal>
                    <div className="flex flex-col space-y-4 items-start w-auto sm:w-[560px]">
                        <div className="w-full flex justify-between">
                            <Titulo text="PRODUCTOS" />
                        </div>
                        <div className="w-full max-h-[300px] scrollbar overflow-auto ">
                            <div className="h-full max-h-[60] ">
                                <table className="border-separate text-lg w-full relative">
                                    <thead className="sticky top-0 bg-white-bg3 z-10">
                                        <tr className="bg-white-bg3 text-center">
                                            <td>Nombre</td>
                                            <td>Precio unitario</td>
                                            <td>cantidad</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataProductos.length ? (
                                            dataProductos.map((p, i) => (
                                                <tr key={i} className="bg-white-bg2">
                                                    <td className="px-1">{p.nombre}</td>
                                                    <td className="px-1">
                                                        $ {p.VentaProducto.precio_unidad.toLocaleString()}
                                                    </td>
                                                    <td className="px-1">
                                                        $ {p.VentaProducto.cantidad.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={arrayContent.length}
                                                    className="text-center text-white-bg3 py-4"
                                                >
                                                    No hay productos cargados.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="w-full flex justify-end">
                            <button onClick={() => setMostrarProductos(false)} className="boton_rojo">
                                VOLVER
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {modalTexto && (
                <Modal>
                    <div className="flex flex-col space-y-4 items-start w-[380px] sm:w-[560px]">
                        <div className="w-full flex justify-between">
                            <Titulo text="ACLARACION SOBRE LA VENTA" />
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

            {showComprobante && (
                <Modal>
                    <Comprobante
                        data={dataComprobante}
                        setShowComp={setShowComprobante}
                        tributos={dataComprobante.TributosFacturaArcas}
                        prod={dataComprobante.ProductoFacturaArcas}
                    />
                </Modal>
            )}
        </div>
    );
};

export default HistorialDeVentas;
