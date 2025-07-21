import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import Titulo from "../../../../common/Titulo";

const TablaInsumos = ({ title, insumos, onEdit, onDelete, onAddNew }) => {
  return (
    <div className="space-y-2 items-start w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <Titulo text={title} />
        <button
          onClick={(e) => onAddNew(e, "FABRICA")}
          className="boton_verde mt-3 sm:mt-0 sm:ml-4"
        >
          NUEVO INSUMO
        </button>
      </div>

      <div className="w-full scrollbar overflow-auto bg-white-bg2">
        <div className="h-[350px] sm:h-[240px] max-h-[70dvh] min-w-[648px]">
          <table className="border-separate text-lg w-full relative">
            <thead className="sticky top-0 bg-white-bg3 z-10">
              <tr className="bg-white-bg3 text-white-bg text-center border-b border-gray-300">
                <td className="w-1/5">Nombre</td>
                <td className="w-1/5">Proveedor</td>
                <td className="w-1/5">Stock</td>
                <td className="w-1/5">Fecha ult. ingreso</td>
                <td className="w-1/5">Precio</td>
                <td className="w-1/5"></td>
                <td className="w-1/5"></td>
              </tr>
            </thead>
            <tbody>
              {insumos.length === 0 ? (
                <tr>
                 <td colSpan="7" className="text-center text-white-bg3">
                    No se encontraron insumos cargados.
                  </td>
                </tr>
              ) : (
                insumos.map((insumo) => (
                  <tr key={insumo.id} className="bg-white-bg">
                    <td>{insumo.nombre}</td>
                    <td className="text-center">
                      {insumo.Proveedors?.[0]?.nombre_empresa || ""}
                    </td>
                    <td className="text-center">{insumo.stock}</td>
                    <td className="text-center">{insumo.fecha}</td>
                    <td className="text-center">$ {insumo.precio}</td>
                    <td
                      className="hover:bg-button-green_hover bg-button-green text-white-bg text-2xl cursor-pointer w-8"
                      onClick={() => onEdit(insumo)}
                    >
                      <MdEdit className="mx-auto" />
                    </td>
                    <td
                      className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8"
                      onClick={() =>
                        onDelete(insumo.id, insumo.nombre, insumo.id_sector)
                      }
                    >
                      <MdDelete className="mx-auto" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablaInsumos;
