import { useEffect, useState } from "react";
import logo from "../../../../assets/logo.jpg";
import logo_arca from "../../../../assets/logo_arca.jpg";

const FacturaMuestra = ({ data, prod, totalesFinales, tributos }) => {
    const [listaProdServ, setListaProdServ] = useState([]);

    useEffect(() => {
        const list = [];

        prod.forEach((p) => {
            if (p.descripcion || p.cantidad || p.unidad_medida || p.precio_unidad || p.iva || p.total) {
                list.push({
                    descripcion: p.descripcion,
                    cantidad: p.cantidad,
                    unidad_medida: p.unidad_medida_label,
                    precio_unidad: p.precio_unidad,
                    subtotal: p.cantidad * p.precio_unidad || "",
                    iva: p.iva_label || "",
                    iva_value: p.iva || "",
                    total: p.total || "",
                });
            }
        });

        setListaProdServ(list);
    }, [prod]);

    function roundTo(num, precision) {
        const factor = Math.pow(10, precision);
        return Math.round(num * factor) / factor;
    }

    const validarIvaB = (importe, iva) => {
        let total = 0;
        if (iva) {
            switch (iva) {
                case "4":
                    total = importe + importe * 0.105; // 10.5%
                    break;
                case "5":
                    total = importe + importe * 0.21; // 21%
                    break;
                case "6":
                    total = importe + importe * 0.27; // 27%
                    break;
                default:
                    total = importe; // Sin IVA
                    break;
            }
        }

        return total;
    };

    const [totalTributos, setTotalTributos] = useState(0);
    useEffect(() => {
        const total = tributos.reduce((acc, t) => acc + Number(t.importe), 0);
        setTotalTributos(total);
    }, [tributos]);

    return (
        <div className="flex justify-center h-[100%] scrollbar">
            <div className="bg-[#fff] scale-75 lg:scale-90 xl:scale-100 min-w-[500px] w-[65%] aspect-[1/1.4142] grid grid-rows-[100px_50px_1fr_auto_70px] p-3">
                {/* header */}
                <div className="border-[1px] border-black-comun relative w-full flex ">
                    {/* tipo de factura */}
                    <div className="border-l-[1px] border-r-[1px] border-b-[1px] border-black-comun absolute top-0 left-1/2 transform -translate-x-1/2 px-2 pb-1 flex flex-col items-center bg-[#fff] z-10">
                        <p className="text-[30px] leading-[30px]">
                            {!data.tipoComprobante ? "-" : Number(data.tipoComprobante) === 1 ? "A" : "B"}
                        </p>
                        <p className="text-[8px] leading-[6px]">COD. 00{data.tipoComprobante || "-"}</p>
                    </div>

                    {/* data izquierda */}
                    <div className="w-[50%] h-[100%] border-r-[0.5px] border-black-comun flex flex-col justify-between pb-2 pr-3 pl-2">
                        <div className="flex justify-center h-[60%]">
                            <img src={logo} className=" object-contain" />
                        </div>

                        <div>
                            <p className="text-[8px] leading-[8px]">
                                <strong>Razón Social:</strong> DAMYA S.A.
                            </p>
                            <p className="text-[8px] leading-[8px]">
                                <strong>Domicilio Comercial:</strong> Sofia C De Luque 2366 Dpto: 1 - Ciudad De Córdoba
                                Sur, Córdoba
                            </p>
                            <p className="text-[8px] leading-[8px]">
                                <strong>Condición frente al IVA: IVA Responsable Inscripto</strong>
                            </p>
                        </div>
                    </div>

                    {/* data derecha */}
                    <div className="w-[50%] h-[100%] pl-8 py-2 pr-3 flex flex-col justify-between">
                        <div>
                            <p className="text-[12px] font-bold">FACTURA</p>

                            <div className="flex justify-between">
                                <p className="text-[8px] font-bold">Punto de venta: 0000</p>
                                <p className="text-[8px] font-bold">Comp. Nro: 00000001</p>
                            </div>

                            <p className="text-[8px] font-bold">Fecha de emisión: {data.fecha_sin_alterar}</p>
                        </div>

                        <div>
                            <p className="text-[8px] leading-[8px]">
                                <strong>CUIT:</strong> 30710695276
                            </p>
                            <p className="text-[8px] leading-[8px]">
                                <strong>Ingresos Brutos:</strong> 270836763
                            </p>
                            <p className="text-[8px] leading-[8px]">
                                <strong>Fecha de Inicio de Actividades</strong> 04/11/2008
                            </p>
                        </div>
                    </div>
                </div>

                {/* info destinatario */}
                <div className="border-[1px] border-black-comun w-full flex mt-1">
                    <div className="w-[50%] h-[100%] flex flex-col justify-between pb-2 pr-3 pl-2">
                        <div>
                            <p className="text-[8px]">
                                <strong>CUIT:</strong> {data.numeroDocumento || "-----------"}
                            </p>
                            <p className="text-[8px]">
                                <strong>Condición frente al IVA:</strong>{" "}
                                {data.condicionFrenteAlIva || "-----------------"}
                            </p>
                            <p className="text-[8px]">
                                <strong>Condición de venta:</strong> {data.condicionDeVenta || "------------"}
                            </p>
                        </div>
                    </div>

                    <div className="w-[50%] h-[100%] flex flex-col justify-between pb-2 pr-3 pl-2">
                        <div>
                            <p className="text-[8px]">
                                <strong>Nombre / Razón Social:</strong>{" "}
                                {data.nombreDestinatario || "---------------- -------"}
                            </p>
                            <p className="text-[8px]">
                                <strong>Domicilio Comercial:</strong>{" "}
                                {data.direccion || "---------------- --------------"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* body */}
                <div className="border-[1px] border-black-comun w-full mt-1 p-1">
                    <table className="text-[8px] w-full">
                        <thead className="bg-white-bg z-10 text-black-comun">
                            <tr>
                                <th className="px-[2px] border-y-[1px] border-x-[1px] border-black-comun">
                                    Descripción
                                </th>
                                <th className="px-[2px] border-y-[1px] border-r-[1px] border-black-comun">Cant</th>
                                <th className="px-[2px] border-y-[1px] border-r-[1px] border-black-comun">U.M</th>
                                <th className="px-[2px] border-y-[1px] border-r-[1px] border-black-comun">Precio U.</th>
                                <th className="px-[2px] border-y-[1px] border-r-[1px] border-black-comun w-8">
                                    % Bonif
                                </th>
                                <th
                                    className={
                                        data.tipoComprobante === "1"
                                            ? "px-[2px] border-y-[1px] border-r-[1px] border-black-comun"
                                            : "hidden"
                                    }
                                >
                                    Subtotal
                                </th>
                                <th
                                    className={
                                        data.tipoComprobante === "1"
                                            ? "px-[2px] border-y-[1px] border-r-[1px] border-black-comun"
                                            : "hidden"
                                    }
                                >
                                    Alic. Iva
                                </th>
                                <th className="px-[2px] border-y-[1px] border-r-[1px] border-black-comun">
                                    {data.tipoComprobante === "1" ? "Subtotal c/IVA" : "Subtotal"}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaProdServ.map((ps) => (
                                <tr key={ps.id}>
                                    <td>{ps.descripcion}</td>
                                    <td className="text-end pr-1">
                                        {roundTo(Number(ps.cantidad), 2).toLocaleString() || ""}
                                    </td>
                                    <td>{ps.unidad_medida}</td>
                                    <td>
                                        {ps.precio_unidad
                                            ? data.tipoComprobante === "1"
                                                ? data.divisa === "PES"
                                                    ? "$"
                                                    : "USD"
                                                : ps.iva
                                                ? data.divisa === "PES"
                                                    ? "$"
                                                    : "USD"
                                                : ""
                                            : ""}{" "}
                                        {data.tipoComprobante === "1"
                                            ? roundTo(Number(ps.precio_unidad), 2).toLocaleString() || ""
                                            : ps.iva
                                            ? validarIvaB(
                                                  roundTo(Number(ps.precio_unidad), 2),
                                                  ps.iva_value
                                              ).toLocaleString() || ""
                                            : ""}
                                    </td>
                                    <td>0.00</td>
                                    <td className={data.tipoComprobante === "1" ? "" : "hidden"}>
                                        {ps.subtotal ? (data.divisa === "PES" ? "$" : "USD") : ""}{" "}
                                        {roundTo(Number(ps.subtotal), 2).toLocaleString() || ""}
                                    </td>
                                    <td className={data.tipoComprobante === "1" ? "" : "hidden"}>{ps.iva}</td>
                                    <td>
                                        {ps.total ? (data.divisa === "PES" ? "$" : "USD") : ""}{" "}
                                        {roundTo(Number(ps.total), 2).toLocaleString() || ""}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* resultados */}
                <div className="border-[1px] border-black-comun w-full flex flex-col mt-1 py-1 pr-2">
                    <div className="text-end">
                        <p className="text-[8px]">
                            Moneda: {data.divisa === "PES" ? "PES - Peso Argentino" : "USD - Dólar Estadounidense"}
                        </p>
                    </div>

                    <div className="text-[8px] flex justify-between mb-1">
                        <div className="w-[50%] h-[100%] flex flex-col justify-between pb-2 pr-3 pl-2">
                            <div className={tributos.length ? "" : "hidden"}>
                                <table className="text-[8px] w-full">
                                    <thead className="bg-white-bg z-10 text-black-comun">
                                        <tr>
                                            <th className="px-[2px] border-y-[1px] border-x-[1px] border-black-comun">
                                                Descripción
                                            </th>
                                            <th className="px-[2px] border-y-[1px] border-r-[1px] border-black-comun">
                                                Alic. %
                                            </th>
                                            <th className="px-[2px] border-y-[1px] border-r-[1px] border-black-comun">
                                                Importe
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tributos.map((t) => (
                                            <tr key={t.codigo}>
                                                <td>{t.descripcion}</td>
                                                <td>{t.alicuota} %</td>
                                                <td>
                                                    {data.divisa === "PES" ? "$" : "USD"}{" "}
                                                    {roundTo(Number(t.importe) || 0, 2).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className={tributos.length ? "text-[8px] flex justify-end space-x-2" : "hidden"}>
                                <strong className="text-end w-[60%]">Importe Otros Tributos:</strong>
                                <p className="w-[20%]">
                                    {data.divisa === "PES" ? "$" : "USD"}{" "}
                                    {roundTo(Number(totalesFinales.tributos) || 0, 2).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="w-[50%] h-[100%] flex flex-col pb-2 pr-3 pl-2">
                            <div className="text-[8px] flex justify-between">
                                <strong className="text-end w-[60%]">
                                    {data.tipoComprobante === "1" ? "Importe Neto Gravado" : "Subtotal"}:{" "}
                                    {data.divisa === "PES" ? "$" : "USD"}
                                </strong>
                                <p>{roundTo(Number(totalesFinales.importeNeto) || 0, 2).toLocaleString()}</p>
                            </div>

                            <div
                                className={data.tipoComprobante === "1" ? "text-[8px] flex justify-between" : "hidden"}
                            >
                                <strong className="text-end w-[60%]">
                                    IVA 27%: {data.divisa === "PES" ? "$" : "USD"}
                                </strong>
                                <p>{roundTo(Number(totalesFinales.i27) || 0, 2).toLocaleString()}</p>
                            </div>
                            <div
                                className={data.tipoComprobante === "1" ? "text-[8px] flex justify-between" : "hidden"}
                            >
                                <strong className="text-end w-[60%]">
                                    IVA 21%: {data.divisa === "PES" ? "$" : "USD"}
                                </strong>
                                <p>{roundTo(Number(totalesFinales.i21) || 0, 2).toLocaleString()}</p>
                            </div>
                            <div
                                className={data.tipoComprobante === "1" ? "text-[8px] flex justify-between" : "hidden"}
                            >
                                <strong className="text-end w-[60%]">
                                    IVA 10.5%: {data.divisa === "PES" ? "$" : "USD"}
                                </strong>
                                <p>{roundTo(Number(totalesFinales.i10_5) || 0, 2).toLocaleString()}</p>
                            </div>
                            <div
                                className={data.tipoComprobante === "1" ? "text-[8px] flex justify-between" : "hidden"}
                            >
                                <strong className="text-end w-[60%]">
                                    IVA 0%: {data.divisa === "PES" ? "$" : "USD"}
                                </strong>
                                <p>{roundTo(Number(totalesFinales.i0) || 0, 2).toLocaleString()}</p>
                            </div>
                            <div className="text-[8px] flex justify-between">
                                <strong className="text-end w-[60%]">
                                    Importe Otros Tributos: {data.divisa === "PES" ? "$" : "USD"}
                                </strong>
                                <p>{roundTo(Number(totalesFinales.tributos) || 0, 2).toLocaleString()}</p>
                            </div>
                            <div className="text-[10px] flex justify-between">
                                <strong className="text-end w-[60%]">
                                    Importe Total: {data.divisa === "PES" ? "$" : "USD"}
                                </strong>
                                <p>
                                    {roundTo(
                                        Number(totalesFinales.total) + Number(totalTributos) || 0,
                                        2
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* footer */}
                <div className="border-[1px] border-black-comun w-full flex mt-1 items-center px-2 justify-between">
                    <div className="flex">
                        <div className="border-[1px] border-black-comun w-[50px] h-[50px] flex justify-center items-center">
                            <p className="text-[10px]">QR</p>
                        </div>

                        <div className="flex flex-col justify-around items-start">
                            <img src={logo_arca} className="h-[20px] object-contain" />
                            <p className="text-[6px] italic pl-1">Comprobante Autorizado</p>
                            <p className="text-[4px] pl-1">
                                Esta Agencia no se responsabiliza por los datos ingresados en el detalle de la operación
                            </p>
                        </div>
                    </div>

                    <div className="pr-2">
                        <p className="text-[8px] text-end">
                            <strong>CAE:</strong> ---------------
                        </p>
                        <p className="text-[8px] text-end">
                            <strong>Fecha de Vencimiento:</strong> --/--/----
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacturaMuestra;
