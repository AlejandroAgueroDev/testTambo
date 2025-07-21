import { useNavigate } from "react-router-dom";

const TablaEmpleados = ({ empleados }) => {
    const navigate = useNavigate();

    const handleRowClick = (empleado) => {
        navigate(`/empleados/vistaDataEmpleado/${empleado.id}`);
    };

    return (
        <div className="h-full min-w-[648px] overflex-x-auto scrollbar overflow-auto ">
            <table className="border-separate text-lg w-full relative">
                <thead className="sticky top-0 bg-white-bg3 z-10">
                    <tr className="bg-white-bg3 text-white-bg text-center">
                        <td>Nombre</td>
                        <td>DNI</td>
                        <td>Contacto</td>
                        <td>Cuit/Cuil</td>
                        <td>Sector</td>
                        <td>Saldo</td>
                    </tr>
                </thead>
                <tbody>
                    {empleados.length ? (
                        empleados.map((empleado) => (
                            <tr
                                key={empleado.id}
                                className="bg-white-bg2 hover:bg-white-bg_hover cursor-pointer text-center"
                                onClick={() => handleRowClick(empleado)}
                            >
                                <td className="px-1">{empleado.nombre}</td>
                                <td className="px-1">{empleado.dni}</td>
                                <td className="px-1">{empleado.contacto}</td>
                                <td className="px-1">{empleado.cuit_cuil || "-"}</td>
                                <td className="px-1">{empleado.sector}</td>
                                <td className="px-1">$ {empleado.saldo}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Aun no hay empleados cargados
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TablaEmpleados;
