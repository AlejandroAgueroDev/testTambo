import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";
import Modal from "../../../../common/Modal";
import CargarPago from "./CargarPago";

const Liquidar = ({ setCloseModal, retirosNoLiquidados, id }) => {
    const [loader, setLoader] = useState(false);
    const [formLiquidacion, setFormLiquidacion] = useState({
        precio_litro: 0,
        importe_total: 0,
        importe_blanco: 0,
        importe_negro: 0,
        fecha: "",
        arrayIdRetiros: [],
        imagenBase64: "",
        modelo: "RetiroLeche",
        litros: 0,
    });
    const [totalLitros, setTotalLitros] = useState(0);
    const [showPagoModal, setShowPagoModal] = useState(false);
    const [importeParaPago, setImporteParaPago] = useState(0);

    const handleForm = (e) => {
        const v = e.target.value;
        const p = e.target.name;

        setFormLiquidacion({ ...formLiquidacion, [p]: v });
    };

    const handleSelectFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(",")[1];
                setFormLiquidacion({ ...formLiquidacion, imagenBase64: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    //? MARGENES DE FECHAS
    const [margenes, setMargenes] = useState({ desde: "", hasta: "" });

    const handleMargenes = (fecha) => {
        if (!margenes.desde && !margenes.hasta) {
            setMargenes({ ...margenes, desde: fecha });
        } else if (margenes.desde && !margenes.hasta) {
            const desde = new Date(margenes.desde);
            const newFecha = new Date(fecha);

            if (desde.getTime() > newFecha.getTime()) {
                setMargenes({ desde: fecha, hasta: margenes.desde });
            } else {
                setMargenes({ desde: margenes.desde, hasta: fecha });
            }
        } else {
            setMargenes({ desde: fecha, hasta: "" });
        }
    };

    useEffect(() => {
        if (!margenes.hasta) {
            const idRetiro = [];
            let totalLitros = 0;
            retirosNoLiquidados.map((r) => {
                if (r.fecha === margenes.desde) {
                    idRetiro.push(r.id);
                    totalLitros += r.cantidad;
                }
            });
            setFormLiquidacion({ ...formLiquidacion, arrayIdRetiros: idRetiro });
            setTotalLitros(totalLitros);
        } else {
            const idRetiros = [];
            let totalLitros = 0;

            const desde = new Date(margenes.desde);
            const hasta = new Date(margenes.hasta);

            retirosNoLiquidados.map((r) => {
                const fecha = new Date(r.fecha);

                if (fecha.getTime() >= desde.getTime() && fecha.getTime() <= hasta.getTime()) {
                    idRetiros.push(r.id);
                    totalLitros += r.cantidad;
                }
            });
            setFormLiquidacion({ ...formLiquidacion, arrayIdRetiros: idRetiros });
            setTotalLitros(totalLitros);
        }
    }, [margenes]);

    useEffect(() => {
        const importeTotal = Number(formLiquidacion.precio_litro) * Number(totalLitros);
        setFormLiquidacion({ ...formLiquidacion, importe_total: importeTotal });
    }, [formLiquidacion.precio_litro, totalLitros]);

    const handleCarga = async () => {
        if (
            !formLiquidacion.precio_litro ||
            !formLiquidacion.importe_total ||
            !formLiquidacion.fecha ||
            !formLiquidacion.arrayIdRetiros.length
        ) {
            return Swal.fire({
                title: "Complete los campos necesarios para completar la liquidación",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "warning",
            });
        }

        // Validación de suma de importes
        const sumaImportes = Number(formLiquidacion.importe_blanco) + Number(formLiquidacion.importe_negro);

        if (sumaImportes !== Number(formLiquidacion.importe_total)) {
            return Swal.fire({
                title: "La suma de los importes no coincide",
                text: "El importe con factura más el importe sin factura debe ser igual al importe total.",
                icon: "error",
                confirmButtonColor: "#D64747",
            });
        }

        // ✅ ACTIVAR LOADER ANTES DE LA PETICIÓN
        setLoader(true);

        try {
            const datosLiquidacion = { ...formLiquidacion, litros: totalLitros };

            await axios.post(url + "tambo/retiroleche/liquidacion", datosLiquidacion);

            // ✅ DESACTIVAR LOADER DESPUÉS DE LA PETICIÓN EXITOSA
            setLoader(false);

            Swal.fire({
                title: "¡Retiros liquidados!",
                text: "¿Desea cargar un pago?",
                confirmButtonText: "Cargar pago",
                cancelButtonText: "Volver a datos de la empresa",
                showCancelButton: true,
                icon: "success",
                confirmButtonColor: "#86C394",
                iconColor: "#86C394",
            }).then((res) => {
                if (res.isConfirmed) {
                    setImporteParaPago(formLiquidacion.importe_total);
                    setShowPagoModal(true);
                } else {
                    window.location.reload();
                }
            });
        } catch (error) {
            // ✅ DESACTIVAR LOADER EN CASO DE ERROR
            setLoader(false);
            
            Swal.fire({
                title: "Error al liquidar retiros",
                text: "Ocurrió un error al procesar la liquidación. Intente nuevamente.",
                icon: "error",
                confirmButtonColor: "#D64747",
            });
        }
    };

    return (
        <div className="flex flex-col space-y-2 items-start w-[95vw] lg:w-[800px]">
            <div className="w-full flex justify-between">
                <Titulo text={`LIQUIDAR RETIROS`} />
            </div>

            <div className="w-full space-y-3">
                <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-3 max-h-[87dvh] overflow-auto">
                    <div className="w-full lg:w-[50%] space-y-1">
                        <div className="flex flex-col w-full">
                            <label className="text-xl font-semibold text-white-bg3">
                                Fecha <strong className="text-red-400">*</strong>
                            </label>
                            <input
                                type="date"
                                onChange={handleForm}
                                name="fecha"
                                value={formLiquidacion.fecha}
                                className="bg-white-bg2 text-black-comun py-2 px-5 text-xl w-full grow"
                            />
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="text-xl font-semibold text-white-bg3">
                                Precio por litro <strong className="text-red-400">*</strong>
                            </label>
                            <div className="flex items-center bg-white-bg2 pl-3 w-full space-x-2 grow">
                                <p className="text-xl text-white-bg3">$</p>
                                <input
                                    placeholder="Ej: 2000"
                                    type="number"
                                    onChange={handleForm}
                                    name="precio_litro"
                                    value={formLiquidacion.precio_litro || ""}
                                    className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="text-xl font-semibold text-white-bg3">Total litros</label>
                            <div className="flex items-center bg-white-bg2 pl-3 w-full space-x-2 grow">
                                <p className="text-xl text-white-bg3">$</p>
                                <p className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow">{totalLitros}</p>
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="text-xl font-semibold text-white-bg3">
                                Importe total <strong className="text-red-400">*</strong>
                            </label>
                            <div className="flex items-center bg-white-bg2 pl-3 w-full space-x-2 grow">
                                <p className="text-xl text-white-bg3">$</p>
                                <input
                                    placeholder="Ej: 1000"
                                    type="number"
                                    disabled
                                    onChange={handleForm}
                                    name="importe_total"
                                    value={formLiquidacion.importe_total.toLocaleString()}
                                    className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
                                />
                            </div>
                        </div>

                        <div className="flex w-full justify-between">
                            <div className="flex flex-col w-[48%]">
                                <label className="text-xl font-semibold text-white-bg3">
                                    Importe con factura <strong className="text-red-400">*</strong>
                                </label>
                                <input
                                    onChange={handleForm}
                                    type="number"
                                    placeholder="Ej: 1000"
                                    value={formLiquidacion.importe_blanco || ""}
                                    name="importe_blanco"
                                    className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                                />
                            </div>
                            <div className="flex flex-col w-[48%]">
                                <label className="text-xl font-semibold text-white-bg3">
                                    Importe sin factura <strong className="text-red-400">*</strong>
                                </label>
                                <input
                                    onChange={handleForm}
                                    type="number"
                                    placeholder="Ej: 1200"
                                    value={formLiquidacion.importe_negro || ""}
                                    name="importe_negro"
                                    className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="text-xl font-semibold text-white-bg3">Adjuntar documento</label>
                            <input
                                onChange={handleSelectFile}
                                type="file"
                                className="bg-white-bg2 text-black-comun p-2 text-xl grow"
                            />
                        </div>
                    </div>

                    <div className=" w-full lg:w-[50%] max-h-[303px]">
                        <label className="text-xl font-semibold text-white-bg3">
                            Seleccione los retiros a liquidar <strong className="text-red-400">*</strong>
                        </label>
                        <div className="h-[92%] w-full overflow-auto">
                            <table className="border-separate text-lg w-full text-black-comun">
                                <thead className="sticky top-0 bg-white-bg3 z-10">
                                    <tr className="bg-white-bg3 text-center">
                                        <td>Fecha</td>
                                        <td>Hora</td>
                                        <td>Litros</td>
                                    </tr>
                                </thead>
                                <tbody className="relative">
                                    {retirosNoLiquidados.length ? (
                                        retirosNoLiquidados.map((retiros) => (
                                            <tr
                                                onClick={() => handleMargenes(retiros.fecha, retiros.hora_retiro)}
                                                key={retiros.id}
                                                className={`${
                                                    formLiquidacion.arrayIdRetiros.includes(retiros.id)
                                                        ? "bg-button-red hover:bg-button-red_hover text-white-bg2"
                                                        : "bg-white-bg2 hover:bg-white-bg_hover"
                                                } cursor-pointer text-center`}
                                            >
                                                <td>{retiros.fecha_muestra}</td>
                                                <td>{retiros.hora_retiro}</td>
                                                <td>{retiros.cantidad}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="text-white-bg3 absolute text-md text-center">
                                                No se encontraron retiros sin liquidar
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-end space-x-3">
                    <button 
                        onClick={() => setCloseModal(false)} 
                        className="boton_rojo"
                        disabled={loader}
                    >
                        CANCELAR
                    </button>
                    <button 
                        onClick={handleCarga} 
                        className="boton_verde"
                        disabled={loader}
                    >
                        {loader ? (
                            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
                        ) : (
                            "CARGAR"
                        )}
                    </button>
                </div>
            </div>
            {/* Modal de pago */}
            {showPagoModal && (
                <Modal>
                    <CargarPago closeModal={setShowPagoModal} importeTotal={importeParaPago} id={id} />
                </Modal>
            )}
        </div>
    );
};

export default Liquidar;