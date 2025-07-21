import { FaPlus } from "react-icons/fa6";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Swal from "sweetalert2";
import { url } from "../../../../common/URL_SERVER";
import axios from "axios";

const TablaEfectivo = ({ datosEfectivo, fetchData, sector }) => {
  const handleAnular = (efectivo) => {
    Swal.fire({
      title: `¿Quieres anular el importe de importe "${efectivo.monto}" definitivamente?`,
      showDenyButton: true,
      confirmButtonText: "Sí, anular",
      denyButtonText: "No",
      confirmButtonColor: "#D64747",
      denyButtonColor: "#A3A3A3",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`${url}caja/anular-efectivo?id=${efectivo.id}`);
          Swal.fire({
            title: "Efectivo anulado correctamente",
            confirmButtonText: "Aceptar",
            icon: "success",
            confirmButtonColor: "#86C394",
          });
          fetchData();
        } catch (error) {
          Swal.fire({
            title: "Ocurrió un error inesperado, intente nuevamente",
            text:
              error.message === "Network Error"
                ? "Contacte con el servicio técnico"
                : error.response?.data?.message,
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#D64747",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div className="h-full flex flex-col justify-between p-2 space-y-4">
      <div className="w-full scrollbar overflow-auto">
        <div className="h-[980px] max-h-[75dvh]">
          <table className="border-separate text-sm sm:text-base w-full relative">
            <thead className="sticky top-0 bg-white-bg3 z-10">
              <tr className="bg-white-bg3 text-white-bg text-center">
                <td>Tipo de movimiento</td>
                <td>Fecha</td>
                <td>Importe</td>
                <td>Origen/Destino</td>
                <td>Detalle</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {datosEfectivo.length ? (
                datosEfectivo.map((efectivo) => (
                  <tr key={efectivo.id} className="bg-white-bg2 text-center">
                    <td className="px-1">
                      {efectivo.GastoIngreso?.tipo || "-"}
                    </td>
                    <td className="px-1">
                      {efectivo.createdAt
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("/")}
                    </td>
                    <td className="px-1">$ {efectivo.monto}</td>
                    <td className="px-1">
                      {(() => {
                        const tipo = efectivo.GastoIngreso?.tipo;
                        const nombreSector = sector.find(
                          (sector) =>
                            sector.id === efectivo.GastoIngreso?.id_sector
                        )?.nombre;
                        if (!tipo || !nombreSector) return "-";
                        return `${nombreSector} (${
                          tipo === "EGRESO" ? "DESTINO" : "ORIGEN"
                        })`;
                      })()}
                    </td>
                    <td className="px-1">
                      {efectivo.GastoIngreso?.detalle || "-"}
                    </td>
                    <Tippy
                      content={"ANULAR"}
                      placement="top-end"
                      arrow={true}
                      theme="custom"
                    >
                      <td
                        onClick={() => handleAnular(efectivo)}
                        className="hover:bg-button-red_hover bg-button-red text-white-bg text-xl cursor-pointer w-8 align-middle"
                      >
                        <FaPlus className="m-auto rotate-45" />
                      </td>
                    </Tippy>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Aún no hay transferencias cargadas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablaEfectivo;
