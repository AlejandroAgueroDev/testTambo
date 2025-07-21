import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Modal from "../../../../common/Modal";
import { BiLoaderAlt } from "react-icons/bi";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import AñadirProveedor from "../proveedoresTamboFabrica/AñadirProveedor";
import SearchableSelect from "../../../../common/SearchSelect";

const CargarRetiroLeche = ({ proveedores, getProveedores, retiroCargado }) => {
    const [proveedorCreado, setProveedorCreado] = useState(false);
    const [loader, setLoader] = useState(false);
    const [formCompra, setFormCompra] = useState({
        fecha: "",
        hora_retiro: "",
        hora_carga: "",
        fecha_carga: "",
        id_proveedor: 0,
        liquidado: false,
        cantidad: 0,
        encargado_retiro: "",
        estado: "ACTIVO",
        aclaracion: "",
        id_liquidacion: null,
        id_empleado: window.localStorage.getItem("user_id"),
        actaBase64: "",
    });

    const handleForm = (e) => {
        const { name, value } = e.target;
        setFormCompra({ ...formCompra, [name]: value });
    };

    const handleSelectFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(",")[1];
                setFormCompra({ ...formCompra, actaBase64: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formCompra.cantidad <= 0 || !formCompra.hora_retiro || !formCompra.encargado_retiro || !formCompra.fecha) {
            return Swal.fire({
                title: "Complete los campos necesarios para cargar el retiro",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "warning",
            });
        }

        const formData = {
            ...formCompra,
            hora_carga: obtenerFechaActual("hora"),
        };

        try {
            setLoader(true);
            console.log("Datos enviados:", formData);

            const { data } = await axios.post(
                `${url}fabrica/compraleche?id_proveedor=${formData.id_proveedor}`,
                formData
            );

            setLoader(false);
            Swal.fire({
                title: "Retiro cargado exitosamente",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#86C394",
                iconColor: "#86C394",
                icon: "success",
            }).then(() => {
                retiroCargado();
                handleCancel();
            });
        } catch (error) {
            setLoader(false);
            console.error("Error al enviar los datos:", error);
            Swal.fire({
                title: "Error al cargar la compra",
                text: error.response ? error.response.data.message : error.message,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "error",
            });
        }
    };

    const handleCancel = () => {
        setFormCompra({
            fecha: "",
            hora_retiro: "",
            hora_carga: "",
            fecha_carga: "",
            id_proveedor: 0,
            liquidado: false,
            cantidad: 0,
            encargado_retiro: "",
            estado: "ACTIVO",
            aclaracion: "",
            id_liquidacion: null,
            id_empleado: window.localStorage.getItem("user_id"),
            actaBase64: "",
        });
    };

    useEffect(() => {
        if (formCompra.id_proveedor === "new") {
            setProveedorCreado(true);
        }
    }, [formCompra.id_proveedor]);

    const handleProveedorSelect = (id) => {
        if (id === "new") {
            setProveedorCreado(true);
        } else {
            setFormCompra((prev) => ({ ...prev, id_proveedor: id }));
        }
    };

    const opcionesProveedores = proveedores.map((c) => ({
        value: c.id,
        label: c.nombre_empresa,
    }));

    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
    const input4Ref = useRef(null);
    const input5Ref = useRef(null);

    const handleKeyDown = (e, nextRef, prevRef) => {
        if (e.key === "ArrowDown" && nextRef) {
            e.preventDefault();
            nextRef.current.focus();
        } else if (e.key === "ArrowUp" && prevRef) {
            e.preventDefault();
            prevRef.current.focus();
        }
    };

    const handleOpenModal = () => {
        setProveedorCreado(true);
    };

    const handleCloseModal = () => {
        setProveedorCreado(false);
        setFormCompra({ ...formCompra, id_proveedor: 0 });
    };

    return (
        <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full">
            {/* TÍTULO FIJO */}
            <div className="flex w-full">
                <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">CARGAR RETIRO DE LECHE</h2>
            </div>

            {/* CONTENIDO SCROLLEABLE */}
            <div className="w-full flex flex-col items-center space-y-2 scrollbar overflow-y-auto sm:max-h-[70dvh] max-h-[45dvh]">
                <div className="flex flex-col w-full">
                    <label htmlFor="fecha" className="labelInput">
                        Fecha<strong className="text-red-400">*</strong>
                    </label>
                    <input
                        id="fecha"
                        ref={input1Ref}
                        onKeyDown={(e) => handleKeyDown(e, input2Ref, null)}
                        onChange={handleForm}
                        type="date"
                        value={formCompra.fecha}
                        name="fecha"
                        className="bg-white-bg2 text-black-comun py-2 px-5 text-xl w-full"
                    />
                </div>

                <div className="flex flex-col w-full">
                    <label htmlFor="tambo" className="labelInput">
                        Tambo <strong className="text-red-400">*</strong>
                    </label>
                    <div className="flex w-full z-20">
                        <SearchableSelect
                            options={opcionesProveedores}
                            placeholder="Buscar tambo"
                            onSelect={handleProveedorSelect}
                        />

                        <button onClick={handleOpenModal} className="boton_verde sm:mt-0">
                            NUEVO
                        </button>
                    </div>
                </div>

                <div className="flex w-full justify-between">
                    <div className="flex flex-col w-[48%]">
                        <label htmlFor="hora" className="text-xl font-semibold text-white-bg3">
                            Hora de Compra<strong className="text-red-400">*</strong>
                        </label>
                        <input
                            id="hora"
                            ref={input2Ref}
                            onKeyDown={(e) => handleKeyDown(e, input3Ref, input1Ref)}
                            onChange={handleForm}
                            type="time"
                            value={formCompra.hora_retiro}
                            name="hora_retiro"
                            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                        />
                    </div>

                    <div className="flex flex-col w-[48%]">
                        <label htmlFor="hora_carga" className="text-xl font-semibold text-white-bg3">
                            Hora de carga
                        </label>
                        <p id="hora_carga" className="bg-white-bg2 text-black-comun py-2 px-5 text-xl">
                            {obtenerFechaActual("hora")}
                        </p>
                    </div>
                </div>

                <div className="flex w-full justify-between">
                    <div className="flex flex-col w-[48%]">
                        <label htmlFor="litros" className="text-xl font-semibold text-white-bg3">
                            Litros a retirar<strong className="text-red-400">*</strong>
                        </label>
                        <input
                            id="litros"
                            ref={input3Ref}
                            onKeyDown={(e) => handleKeyDown(e, input4Ref, input2Ref)}
                            onChange={handleForm}
                            type="number"
                            value={formCompra.cantidad || ""}
                            name="cantidad"
                            placeholder="Ej: 200"
                            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                        />
                    </div>

                    <div className="flex flex-col w-[48%]">
                        <label htmlFor="encargado_retiro" className="text-xl font-semibold text-white-bg3">
                            Encargado del retiro<strong className="text-red-400">*</strong>
                        </label>
                        <input
                            id="encargado_retiro"
                            ref={input4Ref}
                            onKeyDown={(e) => handleKeyDown(e, input5Ref, input3Ref)}
                            onChange={handleForm}
                            type="text"
                            placeholder="Ej: Lucas Perez."
                            value={formCompra.encargado_retiro}
                            name="encargado_retiro"
                            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                        />
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <label htmlFor="comprobante" className="text-xl font-semibold text-white-bg3">
                        Subir Comprobante
                    </label>
                    <input
                        id="comprobante"
                        type="file"
                        onChange={handleSelectFile}
                        className="bg-white-bg2 text-black-comun py-2 px-5 text-base cursor-pointer"
                    />
                </div>

                <div className="flex flex-col w-full">
                    <label htmlFor="aclaraciones" className="text-xl font-semibold text-white-bg3">
                        Aclaraciones
                    </label>
                    <textarea
                        id="aclaraciones"
                        ref={input5Ref}
                        onKeyDown={(e) => handleKeyDown(e, null, input4Ref)}
                        onChange={handleForm}
                        placeholder="Aclaraciones sobre esta producción"
                        value={formCompra.aclaracion}
                        name="aclaracion"
                        className="bg-white-bg2 text-black-comun py-2 px-5 text-xl max-h-20 min-h-20"
                    />
                </div>
            </div>

            {/* BOTONES FIJOS */}
            <div className="space-x-2 flex justify-end w-full mt-2">
                <button onClick={handleCancel} className="boton_rojo">
                    CANCELAR
                </button>
                <button onClick={handleSubmit} className="boton_verde">
                    {loader ? (
                        <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
                    ) : (
                        "CARGAR RETIRO"
                    )}
                </button>
            </div>

            <p className="text-white-bg3 w-full">
                - Los campos marcados con <strong className="text-red-400">*</strong> son obligatorios.
            </p>

            {/* MODALES */}
            {proveedorCreado && (
                <Modal>
                    <AñadirProveedor setCloseModal={handleCloseModal} getProveedores={getProveedores} />
                </Modal>
            )}
        </div>
    );
};

export default CargarRetiroLeche;
