import { useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
//?COMPONENTS
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import Titulo from "../../../../common/Titulo";
import { Validation } from "../../../../common/Validation";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";

const NuevaTransferencia = ({ setCloseModal, cuentas, token, fetchData, fetchCuentas }) => {
    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState({});
    const [sinRegistrar, setSinRegistrar] = useState(false);
    const [form, setForm] = useState({
        fecha: new Date().toISOString(),
        tipo: "",
        importe: "",
        detalle: "",
        estado: "ACEPTADA",
        id_origen: "",
        id_destino: "",
        nombre_origen: "",
        nombre_destino: "",
    });

    const handleForm = (e) => {
        const { name, value } = e.target;

        const errorMsg = Validation(name, value);

        if (name === "importe" && value === "0") {
            return;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMsg,
        }));

        setForm({ ...form, [name]: value });
    };

    const handleFormCuentas = (e) => {
        const { name, value } = e.target;

        if (name === "nombre_origen") {
            setForm((prev) => ({
                ...prev,
                nombre_origen: value,
                id_origen: null,
            }));
        } else if (name === "id_destino") {
            setForm((prev) => ({
                ...prev,
                id_destino: value,
                nombre_destino: e.target.options[e.target.selectedIndex].text,
            }));
        } else if (name === "id_origen") {
            setForm((prev) => ({
                ...prev,
                id_origen: value,
                nombre_origen: e.target.options[e.target.selectedIndex].text,
            }));
        } else if (name === "nombre_destino") {
            setForm((prev) => ({
                ...prev,
                id_destino: null,
                nombre_destino: value,
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleCarga = async () => {
        // const campos = ["importe", "tipo", "id_cuenta", "id_cuenta_destino"];

        // const nuevosErrores = {};
        // let hayErrores = false;

        // for (const campo of campos) {
        //     const error = Validation(campo, form[campo]);
        //     if (error) {
        //         nuevosErrores[campo] = error;
        //         hayErrores = true;
        //     }
        // }

        // setErrors(nuevosErrores);

        // if (hayErrores) {
        //     setErrors({});
        //     Swal.fire({
        //         icon: "error",
        //         title: "Error en los datos",
        //         text: "Por favor completá todos los campos obligatorios correctamente.",
        //         confirmButtonColor: "#D64747",
        //     });
        //     return;
        // }

        if (!form.tipo || !form.importe || !form.nombre_destino || !form.nombre_origen) {
            return Swal.fire({
                title: "Complete los campos requeridos para continuar.",
                icon: "error",
                confirmButtonColor: "#D64747",
            });
        }

        try {
            setLoader(true);

            const payload = {
                ...form,
                importe: parseFloat(form.importe),
            };

            console.log("datos a enviar:", payload);

            await axios.post(`${url}caja/transferencia`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            fetchCuentas()
            fetchData();

            Swal.fire({
                title: "Transferencia realizada exitosamente",
                confirmButtonText: "Aceptar",
                icon: "success",
                confirmButtonColor: "#86C394",
            });

            setCloseModal(false);
        } catch (error) {
            console.error("Error al crear transferencia:", error);
            Swal.fire({
                title: "Error al intentar transferir",
                text: error.response?.data?.message || "Error desconocido",
                icon: "error",
                confirmButtonColor: "#D64747",
            });
        } finally {
            setLoader(false);
        }
    };

    const cancelar = () => {
        setCloseModal(false);
    };

    return (
        <div className="flex flex-col space-y-2 items-start w-full font-NS sm:w-[380px]">
            <div className="w-full flex justify-between">
                <Titulo text="NUEVA TRANSFERENCIA" />
            </div>

            <div className="w-full space-y-3">
                <div className="flex flex-col w-full">
                    <label className="labelInput">
                        Tipo de transferencia <strong className="text-red-400">*</strong>
                    </label>
                    <select onChange={handleForm} name="tipo" className="input" value={form.tipo || ""}>
                        <option value="" disabled>
                            Seleccionar tipo
                        </option>
                        <option value="DEBITO">Pago (Débito)</option>
                        <option value="CREDITO">Cobro (Crédito)</option>
                    </select>
                </div>

                <div>
                    <label className="labelInput">
                        Cuentas <strong className="text-red-400">*</strong>
                    </label>
                    {/* si es debito */}
                    {form.tipo ? (
                        form.tipo === "DEBITO" ? (
                            <div className="space-y-2 bg-white-bg3 p-2">
                                <div className="flex flex-col w-full">
                                    <label className="text-xl font-semibold text-white-bg2">Origen</label>
                                    <select
                                        onChange={handleFormCuentas}
                                        name="id_origen"
                                        className="input"
                                        // value={form.origen || ""}
                                    >
                                        <option selected disabled>
                                            Seleccionar cuenta
                                        </option>
                                        {cuentas.map((cuenta) => (
                                            <option key={cuenta.id} value={`${cuenta.id}`}>
                                                {cuenta.nombre_cuenta}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col w-full">
                                    <label className="text-xl font-semibold text-white-bg2">Destino</label>

                                    <input
                                        type="text"
                                        onChange={handleFormCuentas}
                                        name="nombre_destino"
                                        placeholder="Cuenta de destino"
                                        className="input"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2 bg-white-bg3 p-2">
                                <div className="flex flex-col w-full">
                                    <label className="text-xl font-semibold text-white-bg2">Origen</label>
                                    <div className="flex justify-between w-full">
                                        <input
                                            type="text"
                                            placeholder="Cuenta de origen"
                                            onChange={handleFormCuentas}
                                            name="nombre_origen"
                                            className="bg-white-bg2 text-black-comun py-2 px-3 text-xl w-full"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="text-xl font-semibold text-white-bg2">Destino</label>
                                    <select
                                        onChange={handleFormCuentas}
                                        name="id_destino"
                                        className="input"
                                        // value={form.id_cuenta_destino ? `${form.id_cuenta_destino}` : ""}
                                    >
                                        <option selected disabled>
                                            Seleccionar cuenta
                                        </option>
                                        {cuentas.map((cuenta) => (
                                            <option key={cuenta.id} value={`${cuenta.id}`}>
                                                {cuenta.nombre_cuenta}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="space-y-2 bg-white-bg3 p-2">
                            <label className="text-xl font-semibold text-white-bg2">
                                Seleccione un tipo de transferencia
                            </label>
                        </div>
                    )}
                </div>
                <div className="flex flex-col w-full">
                    <label className="labelInput">
                        Importe <strong className="text-red-400">*</strong>
                    </label>
                    <Tippy
                        content={errors.importe || ""}
                        visible={!!errors.importe}
                        placement="top-end"
                        arrow={true}
                        theme="custom"
                    >
                        <div className="bg-white-bg2 text-black-comun  pl-3 text-xl w-full flex items-center space-x-2">
                            <p className="text-xl text-white-bg3">$</p>
                            <input
                                value={form.importe || ""}
                                placeholder="Ej: 1000"
                                onKeyDown={(e) => {
                                    if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                        e.preventDefault();
                                    }
                                }}
                                type="number"
                                onChange={handleForm}
                                name="importe"
                                className={`input ${errors.importe ? "border-red-500" : "border-gray-300"}`}
                            />
                        </div>
                    </Tippy>
                </div>

                <div className="flex flex-col w-full">
                    <label className="labelInput">Concepto</label>
                    <input
                        placeholder="Ingrese un concepto par la transferencia"
                        type="text"
                        onChange={handleForm}
                        name="detalle"
                        className="input"
                    />
                </div>
            </div>

            {/* botones */}
            <div className="w-full flex justify-end space-x-3 pt-2">
                <button onClick={cancelar} className="boton_rojo">
                    CANCELAR
                </button>
                <button onClick={handleCarga} className="boton_verde">
                    {loader ? <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" /> : "ACEPTAR"}
                </button>
            </div>
        </div>
    );
};

export default NuevaTransferencia;
