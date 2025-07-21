import React from "react";
import { useNavigate } from "react-router-dom";

const TablaProveedores = ({ proveedores, sector_titulo, sector_nombre }) => {
  const navigate = useNavigate();

  return (
    <div className="h-full min-w-[648px] overflex-x-auto overflow-auto">
      <table className="border-separate text-lg w-full relative">
        <thead className="sticky top-0 bg-white-bg3 z-10">
          <tr className="bg-white-bg3 text-white-bg text-center">
            <td>Nombre / Empresa</td>
            <td>Contacto</td>
            <td>Localidad</td>
            <td>Saldo</td>
          </tr>
        </thead>
        <tbody>
          {proveedores.length ? (
            proveedores.map((proveedor) => (
              <tr
                key={proveedor.id}
                onClick={() =>
                  navigate(
                    `/proveedor/${proveedor.id}/${sector_titulo}/${sector_nombre}`
                  )
                }
                className="bg-white-bg2 hover:bg-white-bg_hover cursor-pointer"
              >
                <td className="px-1">{proveedor.nombre_empresa}</td>
                <td className="px-1">{proveedor.contacto_1 || "-"}</td>
                <td className="px-1">{proveedor.localidad}</td>
                <td className="px-1">$ {proveedor.saldo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Aun no hay proveedores cargados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaProveedores;
