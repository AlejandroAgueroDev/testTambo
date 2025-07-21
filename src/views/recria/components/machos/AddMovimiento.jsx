import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";

const AddMovimientos = ({ setCloseModal, cantidadTerneros, recarga }) => {
    const [loader, setLoader] = useState(false);
    const [formMov, setFormMov] = useState({
        texto: "",
        fecha: obtenerFechaActual("dato"),
        archivo: "",
        ternero_contador: 0,
        tipo_movimiento: "",
    });

    const hanldeChangeForm = (e) => {
        const { name, value } = e.target;

        setFormMov({ ...formMov, [name]: value });
    };

    const handleSelectFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(",")[1];
                setFormMov({ ...formMov, archivo: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCargar = () => {
        if (!formMov.texto || !formMov.tipo_movimiento) {
            return Swal.fire({
                title: "Complete los campos necesarios para cargar el movimiento.",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "warning",
                iconColor: "#D64747",
            });
        }

        setLoader(true);

        axios
            .post(url + "recria/macho/movimientos", formMov)
            .then((res) => {
                setLoader(false);
                Swal.fire({
                    title: "Movimiento cargado con éxito",
                    confirmButtonText: "Aceptar",
                    icon: "success",
                    confirmButtonColor: "#86C394",
                    iconColor: "#86C394",
                }).then(() => {
                    recarga();
                    setCloseModal(false);
                });
            })
            .catch((error) => {
                setLoader(false);
                console.log(error);
                Swal.fire({
                    title: "Ocurrio un error inesperado, intente nuevamente",
                    text: error.message === "Network Error" ? "Contacte con el servicio técnico" : error,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#D64747",
                    icon: "error",
                    iconColor: "#D64747",
                });
            });
    };

    return (
        <div className="flex flex-col space-y-2 items-start w-[380px] sm:w-[550px] scrollbar overflow-auto sm:overflow-visible">
            <div className="w-full flex justify-between">
                <Titulo text="NUEVO MOVIMIENTO O ACLARACION" />
            </div>

            <div className="w-full space-y-3">
                <div className="flex flex-col w-full">
                    <label className="text-xl font-semibold text-white-bg3">
                        Detalle del movimiento o aclaración <strong className="text-red-400">*</strong>
                    </label>
                    <textarea
                        onChange={hanldeChangeForm}
                        placeholder="Aclaraciones sobre este ingreso"
                        type="number"
                        name="texto"
                        className="bg-white-bg2 text-black-comun py-1 px-2 text-xl max-h-20 min-h-20"
                    />
                </div>

                <div>
                    <label className="text-xl font-semibold text-white-bg3">Adjuntar documento (solo imagen)</label>
                    <input
                        onChange={handleSelectFile}
                        type="file"
                        name="documento"
                        className="bg-white-bg2 text-black-comun p-[5px] text-xl w-full cursor-pointer"
                    />
                </div>

                <div>
                    <label className="text-xl font-semibold text-white-bg3">
                        Tipo de movimiento <strong className="text-red-400">*</strong>
                    </label>
                    <select
                        onChange={hanldeChangeForm}
                        name="tipo_movimiento"
                        className="bg-white-bg2 text-black-comun py-2 px-2 text-xl w-full"
                    >
                        <option selected disabled>
                            Seleccionar tipo
                        </option>
                        <option value="BAJA">Baja</option>
                        <option value="INGRESO">Ingreso</option>
                        <option value="ACLARACION">Aclaración</option>
                    </select>
                </div>

                {/* modificar */}
                {formMov.tipo_movimiento === "INGRESO" ? (
                    <div className="flex w-full justify-between p-2 bg-white-bg2">
                        <div className="flex flex-col w-[48%]">
                            <label className="text-xl font-semibold text-white-bg3">Cantidad actual</label>
                            <p className="bg-white-bg text-black-comun py-2 px-2 text-xl">
                                {cantidadTerneros || "Sin terneros cargados"}
                            </p>
                        </div>
                        <div className="flex flex-col w-[48%]">
                            <label className="text-xl font-semibold text-white-bg3">
                                Cantidad de ingreso <strong className="text-red-400">*</strong>
                            </label>
                            <input
                                onChange={hanldeChangeForm}
                                type="number"
                                name="ternero_contador"
                                value={formMov.ternero_contador || ""}
                                className="bg-white-bg text-black-comun py-2 px-2 text-xl"
                            />
                        </div>
                    </div>
                ) : formMov.tipo_movimiento === "BAJA" ? (
                    <div className="flex w-full justify-between p-2 bg-white-bg2">
                        <div className="flex flex-col w-[48%]">
                            <label className="text-xl font-semibold text-white-bg3">Cantidad actual</label>
                            <p className="bg-white-bg text-black-comun py-2 px-2 text-xl">
                                {cantidadTerneros || "Sin terneros cargados"}
                            </p>
                        </div>
                        <div className="flex flex-col w-[48%]">
                            <label className="text-xl font-semibold text-white-bg3">
                                Cantidad de bajas <strong className="text-red-400">*</strong>
                            </label>
                            <input
                                onChange={hanldeChangeForm}
                                type="number"
                                name="ternero_contador"
                                value={formMov.ternero_contador || ""}
                                className="bg-white-bg text-black-comun py-2 px-2 text-xl"
                            />
                        </div>
                    </div>
                ) : null}

                <div className="w-full flex justify-end space-x-3">
                    <button onClick={() => setCloseModal(false)} className="boton_rojo">
                        CANCELAR
                    </button>
                    <button onClick={handleCargar} className="boton_verde">
                        {loader ? (
                            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
                        ) : (
                            "AÑADIR"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMovimientos;
