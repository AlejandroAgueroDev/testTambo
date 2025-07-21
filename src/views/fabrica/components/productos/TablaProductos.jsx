import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

const TablaProductos = ({ productos, onEditar, onDelete }) => {
    return (
        <div className="h-full min-w-[648px] overflex-x-auto scrollbar overflow-auto">
            <table className="border-separate text-lg w-full relative">
                <thead className="sticky top-0 bg-white-bg3 z-10">
                    <tr className="bg-white-bg3 text-white-bg text-center">
                        <td>Nombre</td>
                        <td>Stock</td>
                        <td>Precio Reventa</td>
                        <td>Precio Comercio</td>
                        <td>Precio Cons. final</td>
                        <td>Litros / Variedad</td>
                        <td>Masa Sin Elaborar</td>
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(productos) && productos.length ? (
                        productos.map((producto) => (
                            <tr key={producto.id} className="bg-white-bg2 text-center">
                                <td className="px-1">{producto.nombre}</td>
                                <td className="px-1">{producto.stock}</td>
                                <td className="px-1">${producto.precio_reventa}</td>
                                <td className="px-1">${producto.precio_comercio}</td>
                                <td className="px-1">${producto.precio_consumidor_final}</td>
                                <td className="px-1">{producto.litro_variedad} Litros</td>
                                <td className="px-1">{producto.masa_sin_elaborar}</td>
                                <td
                                    className="hover:bg-button-green_hover bg-button-green text-white-bg text-2xl cursor-pointer w-8"
                                    onClick={() => onEditar(producto)}
                                >
                                    <MdEdit className="mx-auto" />
                                </td>
                                <td
                                    className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8"
                                    onClick={() => onDelete(producto)}
                                >
                                    <MdDelete className="mx-auto" />
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
    );
};

export default TablaProductos;
