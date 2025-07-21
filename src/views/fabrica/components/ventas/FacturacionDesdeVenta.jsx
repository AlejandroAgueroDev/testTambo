import { useEffect, useState } from "react";
import Titulo from "../../../../common/Titulo";
import BarraSeparadora from "../../../../common/BarraSeparadora";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import Modal from "../../../../common/Modal";
import LoaderModal from "../../../../common/LoaderModal";
import { TablaProductosFactura } from "./TablaProductosFactura";
import SeleccionarTributo from "../../../caja/components/emitirFactura/AñadirTributo";
import { FaPlus } from "react-icons/fa6";
import Swal from "sweetalert2";
import axios from "axios";
import { handlePrint } from "../../../../common/impresionYDescarga/imprimirFactura";
import { url } from "../../../../common/URL_SERVER";

const FacturacionDesdeVenta = ({ id_cliente, productos, setShowModal, clientesDatas, formVenta }) => {
    const [loader, setLoader] = useState(false);

    const [facturaData, setFacturaData] = useState({
        tipoComprobante: "",
        concepto: 1,
        fecha: obtenerFechaActual("fecha").split("-").reverse().join("-"),
        fecha_sin_alterar: obtenerFechaActual("fecha").split("-").reverse().join("/"),
        tipoDocumento: "",
        numeroDocumento: "",
        nombreDestinatario: "",
        direccion: "",
        importeNeto: 0,
        divisa: "PES",
        cotizacion: 0,
        condicionDeVenta: "",
        condicionFrenteAlIva: "",
        condicionFrenteAlIva_value: "",
    });

    const [totalesFinales, setTotalesFinales] = useState({
        importeNeto: 0,
        i27: 0,
        i21: 0,
        i10_5: 0,
        i0: 0,
        tributos: 0,
        total: 0,
    });

    const [prodServFactura, setProdServFactura] = useState([]);

    const calcularTotales = () => {
        let neto = 0;
        let total27 = 0;
        let total21 = 0;
        let total10_5 = 0;
        let total0 = 0;
        let totalFinal = 0;

        prodServFactura.forEach((item) => {
            if (item.descripcion && item.cantidad && item.precio_unidad && item.iva && item.sub_total && item.total) {
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
        console.log(totalFinal);
        console.log(prodServFactura);

        setTotalesFinales({
            importeNeto: neto,
            i27: total27,
            i21: total21,
            i10_5: total10_5,
            i0: total0,
            total: totalFinal,
        });
    };
    useEffect(() => {
        calcularTotales();
    }, [prodServFactura]);

    useEffect(() => {
        setLoader(true);
        clientesDatas.forEach((c) => {
            if (c.id === id_cliente) {
                setFacturaData({
                    ...facturaData,
                    numeroDocumento: c.cuit_cuil,
                    nombreDestinatario: c.nombre_empresa,
                    direccion: c.localidad,
                });
            }
        });

        const productosFormat = [];
        productos.forEach((p, index) => {
            productosFormat.push({
                id: index + 1,
                descripcion: p.nombre,
                cantidad: p.cantidad,
                unidad_medida: "",
                unidad_medida_label: "",
                precio_unidad: p.precio,
                iva: "",
                iva_label: "",
                sub_total: p.cantidad * p.precio,
                total: 0,
            });
        });
        setProdServFactura(productosFormat);
        setLoader(false);
    }, []);

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
                cotizacion: 1,
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
        // console.log(e.target.options[e.target.selectedIndex].text);
        setFacturaData({
            ...facturaData,
            condicionFrenteAlIva: e.target.options[e.target.selectedIndex].text,
            condicionFrenteAlIva_value: e.target.value,
        });
    };

    const handleCancelar = () => {
        setShowModal({ factura: false, remito: false });
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
        setTotalesFinales({ ...totalesFinales, tributos: totalesFinales.tributos - importe });
    };

    //! EMITIR FACTURA
    const handleEmitir = () => {
        if (
            !facturaData.tipoComprobante ||
            !facturaData.tipoDocumento ||
            !facturaData.numeroDocumento ||
            !facturaData.condicionFrenteAlIva_value ||
            !facturaData.nombreDestinatario ||
            !facturaData.direccion ||
            !facturaData.divisa ||
            !facturaData.cotizacion
        ) {
            return Swal.fire({
                title: "Completa todos los campos para emitir la factura",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "warning",
            });
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
            condicionDeVenta: facturaData.condicionDeVenta,
            nombreDestinatario: facturaData.nombreDestinatario,
            direccion: facturaData.direccion,
            condicionIVA: facturaData.condicionFrenteAlIva,
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
                            importe: (item.total - item.sub_total).toFixed(2),
                        });
                        alicuotasIDs.push(item.iva);
                    }
                } else {
                    const index = alicuotasIDs.indexOf(item.iva);
                    ALICUOTAS[index].baseImp += item.sub_total;
                    ALICUOTAS[index].importe += (item.total - item.sub_total).toFixed(2);
                }
            }
        });

        // items []
        const ITEMS = [];
        prodServFactura.map((item) => {
            if (
                item.descripcion &&
                item.cantidad &&
                item.precio_unidad &&
                item.unidad_medida &&
                item.iva &&
                item.total
            ) {
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
                    importeIVA: (item.total - item.sub_total).toFixed(2),
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

        console.log("items:", ITEMS);

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
        }).then(async (res) => {
            if (res.isConfirmed) {
                setLoader(true);

                const resFac = await axios.post(url + "afip", FACTURA_DATA);
                // console.log(resFac);

                if (resFac.status !== 200) {
                    return Swal.fire({
                        title: "Error al cargar la factura",
                        text: error.message || "Intenta nuevamente",
                        icon: "error",
                        confirmButtonColor: "#D64747",
                    });
                }

                const dataVenta = { ...formVenta, datosFacturacion: { numero: resFac.data.numeroComprobante } };
                const resVenta = await axios.post(`${url}fabrica/ventaproducto`, dataVenta);

                console.log(resVenta);
                if (resVenta.status === 200) {
                    Swal.fire({
                        title: "¡Factura y venta emitidas con éxito!",
                        text: "¿Quiere imprimir o descargar el comprobante?",
                        icon: "success",
                        showCancelButton: true,
                        confirmButtonText: "Imprimir/Descargar",
                        cancelButtonText: "Cargar otra venta",
                        confirmButtonColor: "#86C394",
                        cancelButtonColor: "#D64747",
                        iconColor: "#86C394",
                    }).then((res2) => {
                        if (res2.isConfirmed) {
                            setLoader(true);
                            handlePrint(
                                {
                                    ...facturaData,
                                    cae: resFac.data.cae,
                                    vencCae: resFac.data.fechaVencimientoCAE,
                                    numeroComprobante: resFac.data.numeroComprobante,
                                    qr: resFac.data.svgQR,
                                    puntoVenta: resFac.data.punto_venta,
                                },
                                prodServFactura,
                                totalesFinales,
                                tributos
                            );

                            // setShowModal({ factura: false, remito: false });
                            window.location.reload();
                        } else {
                            window.location.reload();
                            // setShowModal({ factura: false, remito: false });
                        }
                    });
                } else {
                    setLoader(false);
                    Swal.fire({
                        title: "Error al cargar la venta",
                        text: error.message || "Intenta nuevamente",
                        icon: "error",
                        confirmButtonColor: "#D64747",
                    });
                }

                // axios
                //     .post(url + "afip", FACTURA_DATA)
                //     .then(async (res) => {
                //         // console.log(res);
                //         setLoader(false);
                //         Swal.fire({
                //             title: "¡Factura emitida con éxito!",
                //             text: "¿Quiere imprimir o descargar el comprobante?",
                //             icon: "success",
                //             showCancelButton: true,
                //             confirmButtonText: "Imprimir/Descargar",
                //             cancelButtonText: "Emitir otra factura",
                //             confirmButtonColor: "#86C394",
                //             cancelButtonColor: "#D64747",
                //             iconColor: "#86C394",
                //         }).then((res2) => {
                //             if (res2.isConfirmed) {
                //                 setLoader(true);
                //                 handlePrint(
                //                     {
                //                         ...facturaData,
                //                         cae: res.data.cae,
                //                         vencCae: res.data.fechaVencimientoCAE,
                //                         numeroComprobante: res.data.numeroComprobante,
                //                         qr: res.data.svgQR,
                //                         puntoVenta: res.data.punto_venta,
                //                     },
                //                     prodServFactura,
                //                     totalesFinales,
                //                     tributos
                //                 );

                //                 // setShowModal({ factura: false, remito: false });
                //                 // window.location.reload();
                //             } else {
                //                 // window.location.reload();
                //                 setShowModal({ factura: false, remito: false });
                //             }
                //         });

                //         const dataVenta = { ...formVenta, datosFacturacion: { numero: res.data.numeroComprobante } };
                //         const resVenta = await axios.post(`${url}fabrica/ventaproducto`, dataVenta);

                //         if (resVenta.data.success) {
                //             Swal.fire({
                //                 title: "¡Venta cargada exitosamente!",
                //                 icon: "success",
                //                 confirmButtonText: "Aceptar",
                //                 confirmButtonColor: "#86C394",
                //             }).then(() => {
                //                 window.location.reload();
                //             });
                //         } else {
                //             setLoader(false);
                //             Swal.fire({
                //                 title: "Error al cargar la venta",
                //                 text: error.message || "Intenta nuevamente",
                //                 icon: "error",
                //                 confirmButtonColor: "#D64747",
                //             });
                //         }
                //     })
                //     .catch((err) => {
                //         setLoader(false);
                //         console.log(err);
                //         Swal.fire({
                //             title: "Ocurrio un error inesperad, vuelva a intentar",
                //             confirmButtonText: "Aceptar",
                //             confirmButtonColor: "#D64747",
                //             icon: "warning",
                //         });
                //     });
            } else {
                return;
            }
        });
    };

    return (
        <div className="flex flex-col space-y-2 w-[900px] max-h-[80vh] scrollbar overflow-auto">
            <div className="w-full flex justify-between">
                <Titulo text="FACTURAR VENTA" />

                <button onClick={handleCancelar} className="boton_rojo">
                    CANCELAR FACTURACION
                </button>
            </div>

            <div className="pb-3">
                <div className="flex flex-wrap justify-between w-full gap-y-2 pr-2">
                    {/* tipo de factura */}
                    <div className="flex flex-col w-[49%]">
                        <label className="labelInput">Tipo de factura</label>
                        <select
                            className="bg-white text-black-comun py-2 px-2 text-xl w-full sm:w-auto sm:grow"
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
                    <div className="flex flex-col w-[49%]">
                        <label className="labelInput">Tipo de documento</label>
                        <select
                            className="bg-white text-black-comun py-2 px-2 text-xl w-full sm:w-auto sm:grow"
                            name="tipoDocumento"
                            onChange={handleInput}
                        >
                            <option selected disabled>
                                Seleccionar
                            </option>
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
                    <div className="flex flex-col w-[49%]">
                        <label className="labelInput">N° de documento</label>
                        <input
                            className="bg-white text-black-comun py-2 px-2 text-xl w-full sm:w-auto sm:grow"
                            name="numeroDocumento"
                            type="number"
                            placeholder="xxxxxxxxxx"
                            value={facturaData.numeroDocumento}
                            disabled={facturaData.tipoDocumento === "99" ? true : false}
                            onChange={handleInput}
                        />
                    </div>

                    {/* condicion frentte al ia */}
                    <div className="flex flex-col w-[49%]">
                        <label className="labelInput">Condición frente al IVA</label>
                        <select
                            className="bg-white text-black-comun py-2 px-2 text-xl w-full sm:w-auto sm:grow"
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
                    <div className="flex flex-col w-[49%]">
                        <label className="labelInput">Nombre destinatario</label>
                        <input
                            className="bg-white text-black-comun py-2 px-2 text-xl w-full sm:w-auto sm:grow"
                            name="nombreDestinatario"
                            type="text"
                            value={facturaData.nombreDestinatario}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="flex flex-col w-[49%]">
                        <label className="labelInput">Dirección</label>
                        <input
                            className="bg-white text-black-comun py-2 px-2 text-xl w-full sm:w-auto sm:grow"
                            name="direccion"
                            type="text"
                            onChange={handleInput}
                            value={facturaData.direccion}
                        />
                    </div>

                    <div className="flex flex-col w-[49%]">
                        <label className="labelInput">Divisa y cotización</label>
                        <div className="flex items-center space-x-2">
                            <select
                                name="divisa"
                                className=" text-black-comun py-2 px-3 text-xl w-full sm:w-auto sm:grow text-center"
                                onChange={handleInput}
                            >
                                <option value="PES">$</option>
                                <option value="DOL">U$D</option>
                            </select>
                            <input
                                type="number"
                                name="cotizacion"
                                onChange={handleInput}
                                className="bg-white text-black-comun py-2 px-2 text-xl w-full"
                            />
                        </div>
                    </div>

                    {/* condicion de venta */}
                    <div className="flex flex-col w-[49%]">
                        <label className="labelInput">Condición de venta</label>
                        <select
                            className="bg-white text-black-comun py-2 px-2 text-xl w-full sm:w-auto sm:grow"
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
                </div>
            </div>

            <BarraSeparadora orientacion="horizontal" />

            <TablaProductosFactura prodServFactura={prodServFactura} setProdServFactura={setProdServFactura} />

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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white-bg2">
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
                    EMITIR FACTURA Y CARGAR VENTA
                </button>
            </div>

            {/* loader */}
            {loader && (
                <Modal>
                    <LoaderModal textLoader="Aguarde un momento..." />
                </Modal>
            )}

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
        </div>
    );
};

export default FacturacionDesdeVenta;
