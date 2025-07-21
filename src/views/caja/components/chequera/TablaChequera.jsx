import { Link } from "react-router-dom";
import Titulo from "../../../../common/Titulo";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import { FaPlus } from "react-icons/fa6";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import { formatearFecha } from "../../../../common/fornatearFecha";

const TablaChequesEmitidos = ({ cheques, fetchData }) => {
  const handleAnular = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro de querer anular el cheque?",
        text: "Este cambio no se puede revertir.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#D64747",
        cancelButtonColor: "#A3A3A3",
        confirmButtonText: "Sí, anular",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      await axios.put(
        `${url}caja/cheque/${id}`,
        { estado: "ANULADO" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchData();
      Swal.fire({
        title: "Cheque anulado",
        icon: "success",
        confirmButtonColor: "#86C394",
      });
    } catch (error) {
      console.error("Error al anular cheque", error);
      Swal.fire({
        title: "Error al anular",
        text: error.response?.data?.message || "Ocurrió un error inesperado",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    }
  };
  return (
    <div className="space-y-1 pt-2">
      <div className="flex w-full justify-between ">
        <Titulo text="CHEQUES EMITIDOS" />
        <Link to="/banco" className="boton_verde">
          VER CARTERA DE CHEQUES
        </Link>
      </div>
      <div className="w-full scrollbar overflow-auto bg-white-bg">
        <div className="h-[800px] max-h-[70dvh] min-w-[648px]">
          <table className="border-separate text-lg w-full relative">
            <thead className="sticky top-0 bg-white-bg3 z-10">
              <tr className="bg-white-bg3 text-white-bg text-center">
                <td>Fecha emision</td>
                <td>Fecha pago</td>
                <td>Banco</td>
                <td>N° cheque</td>
                <td>Importe</td>
                <td>Destino</td>
                <td>Detalle</td>
                <td>Estado</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(cheques) && cheques.length ? (
                cheques.map((cheque) => (
                  <tr key={cheque.id} className="bg-white-bg2 text-center">
                    <td className="px-1">
                      {cheque.fecha_emision
                        ? formatearFecha(cheque.fecha_emision)
                        : "-"}
                    </td>
                    <td className="px-1">
                      {cheque.fecha_pago
                        ? formatearFecha(cheque.fecha_pago)
                        : "-"}
                    </td>
                    <td className="px-1">{cheque.banco || "-"}</td>
                    <td className="px-1">{cheque.numero_cheque || "-"}</td>
                    <td className="px-1">$ {cheque.importe || "-"}</td>
                    <td className="px-1">{cheque.destino || "-"}</td>
                    <td className="px-1">{cheque.detalle || "-"}</td>
                    <td className="px-1">{cheque.estado || "-"}</td>
                    <td className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8">
                      <FaPlus
                        onClick={() => handleAnular(cheque.id)}
                        className="m-auto rotate-45"
                      />
                    </td>
                  </tr>
                ))
                
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Aun no hay cheques cargadas
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

export default TablaChequesEmitidos;
