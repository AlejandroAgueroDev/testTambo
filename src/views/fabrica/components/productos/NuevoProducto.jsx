import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";

const NuevoProducto = ({ setCloseModal, sectorID, getProductos, litrosFabrica }) => {
    const [loader, setLoader] = useState(false);
    const [formProducto, setFormProducto] = useState({
        nombre: "",
        stock: 0,
        precio_reventa: "",
        precio_comercio: "",
        precio_consumidor_final: "",
        litro_variedad: 0,
        masa_sin_elaborar: 0,
        id_sector: sectorID,
        ultimo_ingreso: new Date(),
    });

    const handleForm = (e) => {
        const { value, name } = e.target;

        if (
            [
                "stock",
                "litro_variedad",
                "precio_reventa",
                "precio_comercio",
                "masa_sin_elaborar",
                "precio_consumidor_final",
            ].includes(name) &&
            value === "0"
        ) {
            return;
        }

        setFormProducto((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCarga = async () => {
        if (
            !formProducto.nombre ||
            // !formProducto.precio_reventa ||
            // !formProducto.precio_comercio ||
            // !formProducto.precio_consumidor_final ||
            !formProducto.litro_variedad ||
            !formProducto.masa_sin_elaborar ||
            !formProducto.stock
        ) {
            return Swal.fire({
                title: "Complete los campos necesarios para cargar el nuevo producto",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "warning",
            });
        }

        // Calcular el total de litros requeridos
        // const litrosRequeridos = formProducto.stock * formProducto.litro_variedad;

        // // Verificar si hay suficiente capacidad en la fábrica
        // if (litrosRequeridos > litrosFabrica) {
        //     return Swal.fire({
        //         title: "Capacidad de litros en tanque insuficiente.",
        //         html: `Necesitas ${litrosRequeridos} Litros para tener esta cantidad de produtcos, pero solo tienes ${litrosFabrica} Litros disponibles para producir la cantidad de productos ingresada.`,
        //         confirmButtonText: "OK",
        //         confirmButtonColor: "#D64747",
        //         icon: "error",
        //     });
        // }

        setLoader(true);

        try {
            //? POST de productos
            const { data } = await axios.post(`${url}fabrica/producto`, formProducto);
            setLoader(false);

            const result = await Swal.fire({
                title: "¡Nuevo producto cargado con éxito!",
                confirmButtonText: "Aceptar",
                icon: "success",
                confirmButtonColor: "#86C394",
            });

            if (result.isConfirmed) {
                setCloseModal(false);
                getProductos();
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
            Swal.fire({
                title: "Ocurrió un error inesperado, intente nuevamente",
                text: error.message === "Network Error" ? "Contacte con el servicio técnico" : error.message,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "error",
            });
        }
    };

    const cancelar = () => {
        setCloseModal(false);
    };

    return (
        <div className="flex flex-col space-y-2 items-start w-[350px] sm:w-[500px] scrollbar overflow-auto sm:overflow-visible">
            <div className="w-full flex justify-between">
                <Titulo text={"NUEVO PRODUCTO"} />
            </div>

            <div className="w-full space-y-3">
                <div className="containerInput">
                    <label className="labelInput">
                        Nombre <strong className="text-red-400">*</strong>
                    </label>
                    <input
                        placeholder="Nombre del producto"
                        type="text"
                        onChange={handleForm}
                        name="nombre"
                        value={formProducto.nombre}
                        className="input"
                    />
                </div>

                <div className="containerInput">
                    <label className="labelInput">
                        Stock <strong className="text-red-400">*</strong>
                    </label>
                    <input
                        type="number"
                        placeholder="0"
                        onChange={handleForm}
                        name="stock"
                        onKeyDown={(e) => {
                            if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                e.preventDefault();
                            }
                        }}
                        value={formProducto.stock || ""}
                        className="input"
                    />
                </div>

                <div className="containerInput">
                    <label className="labelInput">
                        Precio Reventa <strong className="text-red-400">*</strong>
                    </label>
                    <div className="flex items-center bg-white-bg2 pl-3 w-full space-x-2 grow">
                        <p className="text-xl text-white-bg3">$</p>
                        <input
                            type="number"
                            onChange={handleForm}
                            name="precio_reventa"
                            onKeyDown={(e) => {
                                if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                    e.preventDefault();
                                }
                            }}
                            value={formProducto.precio_reventa}
                            className="input"
                        />
                    </div>
                </div>

                <div className="containerInput">
                    <label className="labelInput">
                        Precio Comercio <strong className="text-red-400">*</strong>
                    </label>
                    <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow w-full">
                        <p className="text-xl text-white-bg3">$</p>
                        <input
                            type="number"
                            onChange={handleForm}
                            name="precio_comercio"
                            onKeyDown={(e) => {
                                if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                    e.preventDefault();
                                }
                            }}
                            value={formProducto.precio_comercio}
                            className="input"
                        />
                    </div>
                </div>

                <div className="containerInput">
                    <label className="labelInput">
                        Consumidor Final <strong className="text-red-400">*</strong>
                    </label>
                    <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow w-full">
                        <p className="text-xl text-white-bg3">$</p>
                        <input
                            type="number"
                            onChange={handleForm}
                            name="precio_consumidor_final"
                            onKeyDown={(e) => {
                                if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                    e.preventDefault();
                                }
                            }}
                            value={formProducto.precio_consumidor_final}
                            className="input"
                        />
                    </div>
                </div>

                <div className="containerInput">
                    <label className="labelInput">
                        Litros por Variedad <strong className="text-red-400">*</strong>
                    </label>
                    <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow w-full">
                        <p className="text-xl text-white-bg3">Litros</p>
                        <input
                            type="number"
                            placeholder="0"
                            onChange={handleForm}
                            name="litro_variedad"
                            onKeyDown={(e) => {
                                if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                    e.preventDefault();
                                }
                            }}
                            value={formProducto.litro_variedad || ""}
                            className="input"
                        />
                    </div>
                </div>

                <div className="containerInput">
                    <label className="labelInput">
                        Masa Sin Elaborar <strong className="text-red-400">*</strong>
                    </label>
                    <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow w-full">
                        <p className="text-xl text-white-bg3">KG</p>
                        <input
                            type="number"
                            placeholder="0"
                            onChange={handleForm}
                            name="masa_sin_elaborar"
                            onKeyDown={(e) => {
                                if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                    e.preventDefault();
                                }
                            }}
                            value={formProducto.masa_sin_elaborar || ""}
                            className="input"
                        />
                    </div>
                </div>

                <div className="w-full flex justify-end space-x-3">
                    <button onClick={cancelar} className="boton_rojo">
                        CANCELAR
                    </button>
                    <button onClick={handleCarga} className="boton_verde">
                        {loader ? (
                            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
                        ) : (
                            "CARGAR"
                        )}
                    </button>
                </div>
            </div>
            <p className="text-white-bg3 w-full">
                - Los campos marcados con <strong className="text-red-400">*</strong> son obligatorios para cargar el
                retiro.
            </p>
        </div>
    );
};

export default NuevoProducto;
