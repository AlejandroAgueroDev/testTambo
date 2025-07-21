import React from "react";
import { useNavigate } from "react-router-dom";

const TablaCompradores = ({ compradores }) => {
    const nav = useNavigate();
    return (
        <div className="h-full min-w-[648px] overflex-x-auto scrollbar overflow-auto">
            <table className="border-separate text-lg w-full relative">
                <thead className="sticky top-0 bg-white-bg3 z-10">
                    <tr className="bg-white-bg3 text-white-bg text-center">
                        <td>Nombre / Empresa</td>
                        <td>Contacto</td>
                        <td>Localidad</td>
                        <td>CUIT/CUIL</td>
                        {/* <td>Saldo</td> */}
                    </tr>
                </thead>
                <tbody>
                    {compradores.length ? (
                        compradores.map((cliente) => (
                            <tr
                                onClick={() => nav("/tambo/compradores-leche/" + cliente.id)}
                                key={cliente.id}
                                className="bg-white-bg2 hover:bg-white-bg_hover cursor-pointer"
                            >
                                <td className="px-1">{cliente.nombre_empresa}</td>
                                <td className="px-1">{cliente.contacto_1}</td>
                                <td className="px-1">{cliente.localidad}</td>
                                <td className="px-1">{cliente.cuit_cuil}</td>
                                {/* <td className="px-1">$ {cliente.saldo}</td> */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Aun no hay clientes cargados
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TablaCompradores;
