import Titulo from "../../../../common/Titulo";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { url } from "../../../../common/URL_SERVER";
import { BiLoaderAlt } from "react-icons/bi";

const AñadirProduccion = ({ closeModal, productos, fetchProductos }) => {
    const [loader, setLoader] = useState(false);
    const [produccion, setProduccion] = useState(
        productos.map((p) => {
            return {
                id: p.id,
                nombre: p.nombre,
                cantidad: "",
                masa_sin_elaborar: p.masa_sin_elaborar,
                variedad: p.litro_variedad,
            };
        })
    );

    const handleProduccionChange = (index, name, value) => {
        const prod = { ...produccion[index] };

        prod[name] = Number(value) === 0 ? "" : Number(value);

        setProduccion((prev) => prev.map((p, i) => (i === index ? prod : p)));
    };

    // const [produccion, setProduccion] = useState({});
    // const [usoMasa, setUsoMasa] = useState({});

    // const handleProduccionChange = (id, value) => {
    //     setProduccion((prev) => ({ ...prev, [id]: Number(value) }));
    // };

    // const handleUsoMasaChange = (id, value) => {
    //     setUsoMasa((prev) => ({ ...prev, [id]: Number(value) }));
    // };

    const handleEnviarProduccion = async () => {
        setLoader(true);

        try {
            for (const producto of produccion) {
                const prodDiaria = Number(producto.cantidad);
                const masa = Number(producto.masa_sin_elaborar);

                if (prodDiaria && prodDiaria < 0) {
                    setLoader(false);
                    return Swal.fire({
                        title: `Valor inválido en "Producción realizada" para "${producto.nombre}"`,
                        text: "No se permite ingresar números negativos.",
                        icon: "warning",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#D64747",
                    });
                }

                if (masa && masa < 0) {
                    setLoader(false);
                    return Swal.fire({
                        title: `Valor inválido en "Masa restante" para "${producto.nombre}"`,
                        text: "No se permite ingresar números negativos.",
                        icon: "warning",
                        confirmButtonText: "Aceptar",
                        confirmButtonColor: "#D64747",
                    });
                }
            }

            // console.log(produccion);

            await axios.put(`${url}fabrica/carga-producion/`, { arrayProducto: produccion });

            Swal.fire({
                title: "¡Producción añadida con éxito!",
                confirmButtonText: "Aceptar",
                icon: "success",
                confirmButtonColor: "#86C394",
            });

            fetchProductos();
            closeModal();
        } catch (error) {
            console.error("Error al actualizar:", error);
            Swal.fire({
                title:
                    error.response.data.error === "Validation error: Validation min on litros failed"
                        ? "No tiene los litros suficientes en el tanque para cargar esta producción, incorpórelos  orelos e intente nuevamente"
                        : "Ocurrió un error inesperado, intente nuevamente",
                text: error.message === "Network Error" ? "Contacte con el servicio técnico" : "",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#D64747",
                icon: "error",
            });
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="flex flex-col space-y-2 w-[380px] sm:w-[550px]">
            <div className="w-full flex justify-between">
                <Titulo text="AÑADIR PROCUCION DIARIA" />
            </div>
            <div className="max-h-[400px] scrollbar overflow-auto mt-4">
                <table className="border-separate text-lg w-full relative">
                    <thead className="sticky top-0 bg-white-bg3 z-10">
                        <tr className="bg-white-bg3 text-white-bg text-center">
                            <td>PRODUCTOS</td>
                            <td>Produccion Realizada(KG)</td>
                            <td>Masa Restante(KG)</td>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(produccion) && produccion.length ? (
                            produccion.map((producto, i) => (
                                <tr key={producto.id} className="bg-white-bg2 text-center">
                                    <td className="bg-white-bg_hover px-1">{producto.nombre}</td>
                                    <td>
                                        <input
                                            type="number"
                                            className="bg-[#b5b6d7] w-full text-center"
                                            value={producto.cantidad || ""}
                                            onChange={(e) => handleProduccionChange(i, "cantidad", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="bg-[#d7b6b5]  w-full text-center"
                                            value={producto.masa_sin_elaborar || ""}
                                            onChange={(e) =>
                                                handleProduccionChange(i, "masa_sin_elaborar", e.target.value)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">
                                    Aun no hay productos cargados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="w-full flex justify-end space-x-3">
                <button onClick={closeModal} className="boton_rojo">
                    CANCELAR
                </button>
                <button className="boton_verde" onClick={handleEnviarProduccion}>
                    {loader ? (
                        <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
                    ) : (
                        "AÑADIR PRODUCCION"
                    )}
                </button>
            </div>

            <p className="text-white-bg3 w-full">
                -Produccion realizada se sumara al <strong className="text-black-comun">cantidad del producto.</strong>
            </p>
            <p className="text-white-bg3 w-full">
                -Masa restante reemplazara al valor <strong className="text-black-comun">Masa sin elaborar.</strong>
            </p>
        </div>
    );
};

export default AñadirProduccion;
