import Titulo from "../../../../common/Titulo";
import BarraSeparadora from "../../../../common/BarraSeparadora";

const DataComrprobante = ({ onClose, data }) => {
    return (
        <div className="flex flex-col space-y-2 items-start w-full font-NS">
            <div className="w-full flex justify-between space-x-2">
                <Titulo text="DATOS DEL COMPROBANTE" />

                <button onClick={() => onClose(false)} className="boton_rojo">
                    VOLVER
                </button>
            </div>

            <div className="space-y-3 w-full">
                <p>
                    Tipo de comprobante: <strong>{data.tipo_comprobante}</strong>
                </p>
                <p>
                    Numero de comp.: <strong>{data.numero_factura}</strong>
                </p>
                <p>
                    Sector inputado: <strong>{data.nombre_sector}</strong>
                </p>
                <p>
                    Sub-area: <strong>{data.subarea}</strong>
                </p>
                <p>
                    Sector inputado: <strong>{data.nombre_sector}</strong>
                </p>

                <BarraSeparadora orientacion="horizontal" />

                <p>
                    Emisor: <strong>{data.razon_social}</strong>
                </p>
                <p>
                    Cuit: <strong>{data.cuit}</strong>
                </p>
                <p>
                    Otros datos: <strong>{data.otros_datos || "-"}</strong>
                </p>

                <BarraSeparadora orientacion="horizontal" />

                <div>
                    <div className="">
                        <table className="border-separate text-lg w-full relative">
                            <thead className="sticky top-0 bg-white-bg3 z-10">
                                <tr className="bg-white-bg3 text-white-bg text-center">
                                    <td>Nombre</td>
                                    <td>Cantidad</td>
                                    <td>U M</td>
                                    <td>Precio</td>
                                    <td>IVA</td>
                                    <td>Total</td>
                                </tr>
                            </thead>
                            <tbody>
                                {data.comprobanteInsumos.length ? (
                                    data.comprobanteInsumos.map((f) => (
                                        <tr key={f.id} className="bg-white-bg2 text-center">
                                            <td className="px-1">{f.Insumo.nombre || "-"}</td>
                                            <td className="px-1">{f.cantidad || "-"}</td>
                                            <td className="px-1">{f.unidad || "-"}</td>
                                            <td className="px-1">$ {f.precio || "-"}</td>
                                            <td className="px-1">{f.iva || "-"}</td>
                                            <td className="px-1">$ {f.total || "-"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            Aun no hay productos o servicios cargados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <BarraSeparadora orientacion="horizontal" />

                <p>
                    Total productos: <strong>$ {data.total_productos}</strong>
                </p>
                <p>
                    Total tributos: <strong>$ {data.total_tributos}</strong>
                </p>
                <p>
                    Total: <strong>$ {data.total_general}</strong>
                </p>
            </div>
        </div>
    );
};

export default DataComrprobante;
