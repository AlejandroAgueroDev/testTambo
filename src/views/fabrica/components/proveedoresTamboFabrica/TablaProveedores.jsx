import { useNavigate } from "react-router-dom";

const TablaProveedores = ({ proveedores }) => {
    const navigate = useNavigate();
    const handleRowClick = (proveedor) => {
        navigate(`/fabrica/vistaProveedorTamboFabrica/${proveedor.id}`);
    };
    return (
        <div className="h-full min-w-[648px] overflex-x-auto scrollbar overflow-auto">
            <table className="border-separate text-lg w-full relative">
                <thead className="sticky top-0 bg-white-bg3 z-10">
                    <tr className="bg-white-bg3 text-white-bg text-center">
                        <td>Nombre del tambo</td>
                        <td>Contacto 1</td>
                        <td>Contacto 2</td>
                        <td>Localidad</td>
                        <td>Saldo</td>
                    </tr>
                </thead>
                <tbody>
                    {proveedores.length ? (
                        proveedores.map((proveedor) => (
                            <tr
                                key={proveedor.id}
                                className="bg-white-bg2 hover:bg-white-bg_hover cursor-pointer"
                                onClick={() => handleRowClick(proveedor)}
                            >
                                <td className="px-1">{proveedor.nombre_empresa}</td>
                                <td className="px-1">{proveedor.contacto_1}</td>
                                <td className="px-1">{proveedor.contacto_2}</td>
                                <td className="px-1">{proveedor.localidad}</td>
                                <td className="px-1">$ {proveedor.saldo}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Aún no hay proveedores cargados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TablaProveedores;
