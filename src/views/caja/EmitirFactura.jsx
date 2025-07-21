import ContenedorGeneral from "../../common/ContenedorGeneral";
import { useEffect, useState } from "react";
import { obtenerFechaActual } from "../../common/obtenerFecha";
import axios from "axios";
import { url } from "../../common/URL_SERVER";
import BarraSeparadora from "../../common/BarraSeparadora";
import { TablaAProductos } from "./components/emitirFactura/TablasFactura";
import FacturaMuestra from "./components/emitirFactura/FacturaMuestra";
import Swal from "sweetalert2";
import { handlePrint } from "../../common/impresionYDescarga/imprimirFactura";
import SeleccionarTributo from "./components/emitirFactura/AñadirTributo";
import Modal from "../../common/Modal";
import { FaPlus } from "react-icons/fa6";
import Titulo from "../../common/Titulo";
import { Link } from "react-router-dom";
import LoaderModal from "../../common/LoaderModal";

const EmitirFactura = () => {
    const [loader, setLoader] = useState(false);

    const [facturaData, setFacturaData] = useState({
        tipoComprobante: "",
        concepto: "",
        fecha: obtenerFechaActual("fecha").split("-").reverse().join("-"),
        fecha_sin_alterar: obtenerFechaActual("fecha").split("-").reverse().join("/"),
        tipoDocumento: "",
        numeroDocumento: 0,
        nombreDestinatario: "",
        direccion: "",
        importeNeto: 0,
        divisa: "PES",
        cotizacion: 1,
        condicionDeVenta: "",
        condicionFrenteAlIva: "",
        condicionFrenteAlIva_value: "",
        // en el caso de ser servicios
        fechaServDesde: "",
        fechaServHasta: "",
        fechaVencimientoPago: "",
    });

    const [prodServFactura, setProdServFactura] = useState(
        Array.from({ length: 50 }, (_, index) => ({
            id: index + 1,
            descripcion: "",
            cantidad: "",
            unidad_medida: "",
            unidad_medida_label: "",
            precio_unidad: "",
            iva: "",
            iva_label: "",
            sub_total: 0,
            total: 0,
        }))
    );

    const [totalesFinales, setTotalesFinales] = useState({
        importeNeto: 0,
        i27: 0,
        i21: 0,
        i10_5: 0,
        i0: 0,
        tributos: 0,
        total: 0,
    });

    useEffect(() => {
        const calcularTotales = () => {
            let neto = 0;
            let total27 = 0;
            let total21 = 0;
            let total10_5 = 0;
            let total0 = 0;
            let totalFinal = 0;

            prodServFactura.forEach((item) => {
                if (
                    item.descripcion &&
                    item.cantidad &&
                    item.precio_unidad &&
                    item.iva &&
                    item.sub_total &&
                    item.total
                ) {
                    const subTotal = item.cantidad * item.precio_unidad;
                    neto += subTotal;

                    switch (item.iva) {
                        case "6": // 27%
                            total27 += subTotal * 0.27;
                            break;
                        case "5": // 21%
                            total21 += subTotal * 0.21;
                            break;
                        case "4": // 10.5%
                            total10_5 += subTotal * 0.105;
                            break;
                        case "3":
                            break;
                        case "2":
                            break;
                        case "1":
                            break;
                        default:
                            break;
                    }
                }
            });

            totalFinal = neto + total27 + total21 + total10_5 + total0;

            setTotalesFinales({
                importeNeto: neto,
                i27: total27,
                i21: total21,
                i10_5: total10_5,
                i0: total0,
                total: totalFinal,
            });
        };

        calcularTotales();
    }, [prodServFactura]);

    const calcularPrecioConIva = (precio, iva) => {
        if (iva === "6") {
            return precio * 1.27; // 27%
        } else if (iva === "5") {
            return precio * 1.21; // 21%
        } else if (iva === "4") {
            return precio * 1.105; // 10.5%
        } else {
            return precio; // Sin IVA
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;

        if (name === "tipoDocumento" && value === "99") {
            setFacturaData((prevData) => ({
                ...prevData,
                [name]: value,
                numeroDocumento: 0,
            }));
        } else if (name === "divisa" && value === "PES") {
            setFacturaData((prevData) => ({
                ...prevData,
                [name]: value,
                cotizacion: value === "PES" ? 1 : "",
            }));
        } else if (name === "divisa" && value === "DOL") {
            setFacturaData((prevData) => ({
                ...prevData,
                [name]: value,
                cotizacion: "",
            }));
        } else {
            setFacturaData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleChangeCondicionIVA = (e) => {
        setFacturaData({
            ...facturaData,
            condicionFrenteAlIva: e.target.name,
            condicionFrenteAlIva_value: e.target.value,
        });
    };

    //! EMITIR FACTURA
    const handleEmitir = () => {
        console.log(facturaData);

        if (
            !facturaData.tipoComprobante ||
            !facturaData.concepto ||
            !facturaData.tipoDocumento ||
            !facturaData.numeroDocumento ||
            !facturaData.condicionFrenteAlIva_value ||
            !facturaData.nombreDestinatario ||
            !facturaData.direccion ||
            !facturaData.divisa ||
            (facturaData.divisa !== "PES" && !facturaData.cotizacion)
        ) {
            return Swal.fire({
                title: "Completa todos los campos para emitir la factura",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "warning",
            });
        }

        if (facturaData.concepto === "2" || facturaData.concepto === "3") {
            if (!facturaData.fechaServDesde || !facturaData.fechaServHasta || !facturaData.fechaVencimientoPago) {
                return Swal.fire({
                    title: "Completa las fechas de servicio para emitir la factura",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#D64747",
                    icon: "warning",
                });
            }
        }

        // data de factura
        let importeTotal = 0;
        let importeNeto = 0;
        let importeIva = 0;
        prodServFactura.forEach((item) => {
            importeTotal += item.total;
            importeNeto += item.sub_total;
            importeIva += item.total - item.sub_total;
        });

        if (tributos.length) {
            importeTotal += Number(totalesFinales.tributos);
        }

        const DATOS = {
            tipoComprobante: facturaData.tipoComprobante,
            concepto: facturaData.concepto,
            tipoDocumento: facturaData.tipoDocumento,
            numeroDocumento: facturaData.numeroDocumento,
            fecha: facturaData.fecha,
            importeTotal: importeTotal,
            importeNeto: importeNeto,
            importeTributos: totalesFinales.tributos,
            ivaImporte: importeIva,
            divisa: facturaData.divisa,
            cotizacion: facturaData.cotizacion,
            condicionIVACodigo: facturaData.condicionFrenteAlIva_value,
            condicionIVA: facturaData.condicionFrenteAlIva,
            fechaServDesde: facturaData.fechaServDesde,
            fechaServHasta: facturaData.fechaServHasta,
            fechaVencimientoPago: facturaData.fechaVencimientoPago,
            condicionDeVenta: facturaData.condicionDeVenta,
            nombreDestinatario: facturaData.nombreDestinatario,
            direccion: facturaData.direccion,
        };

        // alicuotas []
        const ALICUOTAS = [];
        const alicuotasIDs = [];
        prodServFactura.forEach((item) => {
            if (item.descripcion && item.cantidad && item.precio_unidad && item.unidad_medida) {
                if (!alicuotasIDs.includes(item.iva)) {
                    if (item.iva === "4" || item.iva === "5" || item.iva === "6") {
                        ALICUOTAS.push({
                            id: item.iva,
                            baseImp: item.sub_total,
                            importe: item.total - item.sub_total,
                        });
                        alicuotasIDs.push(item.iva);
                    }
                } else {
                    const index = alicuotasIDs.indexOf(item.iva);
                    ALICUOTAS[index].baseImp += item.sub_total;
                    ALICUOTAS[index].importe += item.total - item.sub_total;
                }
            }
        });

        // items []
        const ITEMS = [];
        prodServFactura.map((item) => {
            if (item.descripcion && item.cantidad && item.precio_unidad && item.unidad_medida) {
                ITEMS.push({
                    descripcion: item.descripcion,
                    unidad: item.unidad_medida,
                    unidad_label: item.unidad_medida_label,
                    cantidad: item.cantidad,
                    precioUnitario:
                        facturaData.tipoComprobante === "1"
                            ? item.precio_unidad
                            : calcularPrecioConIva(item.precio_unidad, item.iva),
                    importeTotal: item.total,
                    condIVA: item.iva,
                    importeIVA: item.total - item.sub_total,
                });
            }
        });

        if (!ITEMS.length) {
            return Swal.fire({
                title: "Agrega al menos un producto o servicio a la factura",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "warning",
            });
        }

        const FACTURA_DATA = {
            datos: DATOS,
            alicuotas: ALICUOTAS,
            items: ITEMS,
            tributos: tributos,
        };

        Swal.fire({
            title: "¿Emitir factura?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, emitir",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#86C394",
            cancelButtonColor: "#D64747",
            iconColor: "#86C394",
        }).then((res) => {
            if (res.isConfirmed) {
                setLoader(true);
                axios
                    .post(url + "afip", FACTURA_DATA)
                    .then((res) => {
                        // console.log(res);
                        setLoader(false);
                        Swal.fire({
                            title: "¡Factura emitida con éxito!",
                            text: "¿Quiere imprimir o descargar el comprobante?",
                            icon: "success",
                            showCancelButton: true,
                            confirmButtonText: "Imprimir/Descargar",
                            cancelButtonText: "Emitir otra factura",
                            confirmButtonColor: "#86C394",
                            cancelButtonColor: "#D64747",
                            iconColor: "#86C394",
                        }).then((res2) => {
                            if (res2.isConfirmed) {
                                setLoader(true);
                                handlePrint(
                                    {
                                        ...facturaData,
                                        cae: res.data.cae,
                                        vencCae: res.data.fechaVencimientoCAE,
                                        numeroComprobante: res.data.numeroComprobante,
                                        svgQR: res.data.svgQR,
                                        puntoVenta: res.data.punto_venta,
                                    },
                                    prodServFactura,
                                    totalesFinales,
                                    tributos
                                );
                                window.location.reload();
                            } else {
                                window.location.reload();
                            }
                        });
                    })
                    .catch((err) => {
                        setLoader(false);
                        console.log(err);
                        Swal.fire({
                            title: "Ocurrio un error inesperad, vuelva a intentar",
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: "#D64747",
                            icon: "warning",
                        });
                    });
            } else {
                return;
            }
        });
    };

    //! tributos
    const [tributos, setTributos] = useState([]);
    const [tributosID, setStribtuosID] = useState([]);
    const [showAddTributo, setShowAddTributo] = useState(false);

    useEffect(() => {
        let importeNeto = 0;
        prodServFactura.forEach((item) => {
            importeNeto += item.sub_total;
        });

        const tributosFinales = tributos.map((t) => {
            const importe = (importeNeto * t.alicuota) / 100;
            return {
                ...t,
                importe: importe.toFixed(2),
            };
        });

        let totalTributos = 0;
        tributosFinales.forEach((item) => {
            totalTributos += Number(item.importe);
        });

        totalTributos > 0 && setTotalesFinales({ ...totalesFinales, tributos: totalTributos });

        setTributos(tributosFinales);
    }, [prodServFactura, tributosID]);

    const quitarDeLaLista = (id, importe) => {
        const nuevosTributos = tributos.filter((t) => t.codigo !== id);
        setTributos(nuevosTributos);
        const nuevosIds = tributosID.filter((t) => t !== id);
        setStribtuosID(nuevosIds);
        setTotalesFinales({
            ...totalesFinales,
            tributos: totalesFinales.tributos - importe,
        });
    };

    return (
        <ContenedorGeneral navText="CAJA">
            <div className="w-screen md:w-full flex justify-between pl-10 md:pl-0 pr-4 md:pr-0">
                <Titulo text="CAJA | EMITIR FACTURA" />

                <div className="flex gap-4">
                    <Link to="/caja" className="boton_rojo flex justify-end">
                        VOLVER
                    </Link>
                </div>
            </div>
            <div className="h-[93%] w-full flex flex-col md:flex-row gap-2 md:gap-0 bg-white-bg2 p-5">
                <div className="w-full lg:w-[49%] md:grow flex flex-col overflow-auto ">
                    <div className="flex flex-wrap justify-between w-full gap-y-3 scrollbar overflow-x-auto pr-2">
                        {/* tipo de factura */}
                        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:space-x-5 w-full">
                            <label className="labelInput">Tipo de factura</label>
                            <select
                                className="bg-white text-black-comun py-2 px-2 text-xl w-full"
                                name="tipoComprobante"
                                onChange={handleInput}
                            >
                                <option selected disabled>
                                    Seleccionar
                                </option>
                                <option value={1}>A</option>
                                <option value={6}>B</option>
                            </select>
                        </div>

                        {/* concepto */}
                        <div className="flex  flex-col lg:flex-row items-start lg:items-center lg:space-x-5 w-full">
                            <label className="labelInput">Concepto</label>
                            <select
                                className="bg-white text-black-comun py-2 px-2 text-xl w-full"
                                name="concepto"
                                onChange={handleInput}
                            >
                                <option selected disabled>
                                    Seleccionar
                                </option>
                                <option value={1}>Productos</option>
                                <option value={2}>Servicios</option>
                                <option value={3}>Mixto</option>
                            </select>
                        </div>

                        {/* concepto */}
                        <div className="flex  flex-col lg:flex-row items-start lg:items-center lg:space-x-5 w-full">
                            <label className="labelInput">Tipo de documento</label>
                            <select
                                className="bg-white text-black-comun py-2 px-2 text-xl w-full"
                                name="tipoDocumento"
                                onChange={handleInput}
                            >
                                <option selected disabled>
                                    Seleccionar
                                </option>
                                {/* <option disabled={facturaData.tipoComprobante === "1"} value={99}>
                                    Consumidor final
                                </option> */}
                                <option value={80}>CUIT</option>
                                <option disabled={facturaData.tipoComprobante === "1"} value={86}>
                                    CUIL
                                </option>
                                <option disabled={facturaData.tipoComprobante === "1"} value={96}>
                                    DNI
                                </option>
                            </select>
                        </div>

                        {/* concepto */}
                        <div className="flex  flex-col lg:flex-row items-start lg:items-center lg:space-x-5 w-full">
                            <label className="labelInput">N° de documento</label>
                            <input
                                className="bg-white text-black-comun py-2 px-2 text-xl w-full"
                                name="numeroDocumento"
                                type="number"
                                placeholder="xxxxxxxxxx"
                                disabled={facturaData.tipoDocumento === "99" ? true : false}
                                onChange={handleInput}
                            />
                        </div>

                        {/* condicion frentte al ia */}
                        <div className="flex  flex-col lg:flex-row items-start lg:items-center lg:space-x-5 w-full">
                            <label className="labelInput text-nowrap">Condición frente al IVA</label>
                            <select
                                className="bg-white text-black-comun py-2 px-2 text-xl w-full"
                                name="condicionFrenteAlIva"
                                onChange={handleChangeCondicionIVA}
                            >
                                <option selected disabled>
                                    Seleccionar
                                </option>
                                <option value={1}>Responsable Inscripto</option>
                                <option value={5}>Consumidor Final</option>
                                <option value={6}>Responsable Monotributo</option>
                                <option value={16}>"Monotributo Trabajador Independiente Promovido"</option>
                                <option value={7}>Sujeto No Categorizado</option>
                                <option value={9}>Cliente del Exterior</option>
                                <option value={13}>Monotributista Social</option>
                                <option value={15}>IVA No Alcanzado</option>
                                <option value={4}>IVA Sujeto Exento</option>
                                <option value={10}>IVA Liberado – Ley N° 19.640</option>
                            </select>
                        </div>

                        {/* datos destinatario */}
                        <div className="flex  flex-col lg:flex-row items-start lg:items-center lg:space-x-5 w-full">
                            <label className="labelInput">Nombre destinatario</label>
                            <input
                                className="bg-white text-black-comun py-2 px-2 text-xl w-full"
                                name="nombreDestinatario"
                                type="text"
                                onChange={handleInput}
                            />
                        </div>

                        <div className="flex  flex-col lg:flex-row items-start lg:items-center lg:space-x-5 w-full">
                            <label className="labelInput">Dirección</label>
                            <input
                                className="bg-white text-black-comun py-2 px-2 text-xl w-full"
                                name="direccion"
                                type="text"
                                onChange={handleInput}
                            />
                        </div>

                        {/* divisa */}

                        <div className="flex  flex-col lg:flex-row items-start lg:items-center lg:space-x-5 w-full">
                            <label className="labelInput text-nowrap">Divisa y cotización</label>
                            <div className="flex items-center space-x-2 w-full">
                                <select
                                    onChange={handleInput}
                                    name="divisa"
                                    className=" text-black-comun py-2 px-3 text-xl text-center w-[100px]"
                                    value={facturaData.divisa}
                                >
                                    <option value="PES">$</option>
                                    <option value="DOL">U$D</option>
                                </select>
                                <input
                                    onChange={handleInput}
                                    type="number"
                                    name="cotizacion"
                                    className={`py-2 px-2 text-xl w-full 
                    ${
                        facturaData.divisa === "PES"
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-white text-black-comun"
                    }`}
                                    value={facturaData.cotizacion}
                                    disabled={facturaData.divisa === "PES"}
                                />
                            </div>
                        </div>

                        {/* condicion de venta */}
                        <div className="flex  flex-col lg:flex-row items-start lg:items-center lg:space-x-5 w-full">
                            <label className="labelInput">Condición de venta</label>
                            <select
                                className="bg-white text-black-comun py-2 px-2 text-xl w-full"
                                name="condicionDeVenta"
                                onChange={handleInput}
                            >
                                <option selected disabled>
                                    Seleccionar
                                </option>
                                <option value={"Contado"}>Contado</option>
                                <option value={"Crédito"}>Crédito</option>
                                <option value={"A plazos"}>A plazos</option>
                                <option value={"Porcentaje de pago"}>Porcentaje de pago</option>
                                <option value={"Condiciones especiales"}>Condiciones especiales</option>
                            </select>
                        </div>

                        <BarraSeparadora orientacion="horizontal" />

                        <div
                            className={
                                facturaData.concepto === "2" || facturaData.concepto === "3"
                                    ? "flex flex-col h-78 w-full"
                                    : "flex flex-col h-64 w-full"
                            }
                        >
                            <label className="labelInput">Productos/Servicios</label>
                            <TablaAProductos
                                prodServFactura={prodServFactura}
                                setProdServFactura={setProdServFactura}
                            />
                            {facturaData.concepto === "2" || facturaData.concepto === "3" ? (
                                <div className="pt-2 flex justify-between">
                                    <div className="flex flex-col w-[32%]">
                                        <label className="labelInput">Servicio desde</label>
                                        <input
                                            className="bg-white text-black-comun py-2 px-2 text-xl w-full"
                                            name="fechaServDesde"
                                            type="date"
                                            onChange={handleInput}
                                        />
                                    </div>

                                    <div className="flex flex-col w-[32%]">
                                        <label className="labelInput">Servicio hasta</label>
                                        <input
                                            className="bg-white text-black-comun py-2 px-2 text-xl w-full"
                                            name="fechaServHasta"
                                            type="date"
                                            onChange={handleInput}
                                        />
                                    </div>

                                    <div className="flex flex-col w-[32%]">
                                        <label className="labelInput">Venc. pago</label>
                                        <input
                                            className="bg-white text-black-comun py-2 px-2 text-xl grow"
                                            name="fechaVencimientoPago"
                                            type="date"
                                            onChange={handleInput}
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        <BarraSeparadora orientacion="horizontal" />

                        <div className="flex flex-col w-full">
                            <div className="flex justify-between">
                                <label className="labelInput">Otros tibutos</label>
                                <button
                                    onClick={() => setShowAddTributo(!showAddTributo)}
                                    className="bg-button-green hover:bg-button-green_hover text-white-bg2 py-1 px-2 text-md"
                                >
                                    AÑADIR TRIBUTO
                                </button>
                            </div>
                            {!tributos.length ? (
                                <p>Sin tributos añadidos.</p>
                            ) : (
                                <table className="border-separate text-lg w-full relative">
                                    <thead className="bg-white-bg3 z-10 text-white-bg2">
                                        <tr>
                                            <th>Descripción</th>
                                            <th>Alic. %</th>
                                            <th>Importe</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white-bg">
                                        {tributos.map((t) => (
                                            <tr key={t.codigo}>
                                                <td className="px-1">{t.descripcion}</td>
                                                <td className="text-center">{t.alicuota} %</td>
                                                <td className="px-1">{t.importe || "-"}</td>
                                                <th
                                                    onClick={() => quitarDeLaLista(t.codigo, t.importe)}
                                                    className="hover:bg-button-red_hover bg-button-red text-white-bg text-xl cursor-pointer w-8 align-middle"
                                                >
                                                    <FaPlus className="m-auto rotate-45" />
                                                </th>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <BarraSeparadora orientacion="horizontal" />

                        <div className="w-full text-end">
                            <button onClick={handleEmitir} className="boton_verde">
                                EMITIR FACTURA
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-[49%] md:grow hidden lg:flex flex-col">
                    <FacturaMuestra
                        data={facturaData}
                        prod={prodServFactura}
                        totalesFinales={totalesFinales}
                        tributos={tributos}
                    />
                </div>
            </div>

            {showAddTributo && (
                <Modal>
                    <SeleccionarTributo
                        tributos={tributos}
                        setTributos={setTributos}
                        tributosId={tributosID}
                        setTributosId={setStribtuosID}
                        setShowModal={setShowAddTributo}
                    />
                </Modal>
            )}

            {loader && (
                <Modal>
                    <LoaderModal textLoader="Aguarde un momento..." />
                </Modal>
            )}
        </ContenedorGeneral>
    );
};

export default EmitirFactura;
