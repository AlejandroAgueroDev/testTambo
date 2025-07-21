import { FiX } from "react-icons/fi";
import { useState } from "react";
import Swal from "sweetalert2";
import Modal from "../../../../common/Modal";
import MotivoDeAnulacion from "./MotivoDeAnulacion";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";

const TablaPagos = ({ gastosIngreso, fetchData }) => {
  const [showMotivoModal, setShowMotivoModal] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [gastoSeleccionado, setGastoSeleccionado] = useState(null);

  const handleAnularGasto = (index) => {
    Swal.fire({
      title: `¿Estás seguro que desea anular el gasto: ${gastosIngreso[index].detalle}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, anular",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#D64747",
      cancelButtonColor: "#A3A3A3",
    }).then((result) => {
      if (result.isConfirmed) {
        setGastoSeleccionado(index);
        setShowMotivoModal(true);
      }
    });
  };

  return (
    <div className="h-full min-w-[648px] scrollbar overflow-x-auto overflow-auto bg-white-bg">
      <table className="border-separate text-lg w-full relative">
        <thead className="sticky top-0 bg-white-bg3 z-10">
          <tr className="bg-white-bg3 text-white-bg text-center">
            <td className="w-40">Tipo</td>
            <td className="w-40">Fecha</td>
            <td>Detalle</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {gastosIngreso.length ? (
            gastosIngreso.map((gastoIngreso, index) => (
              <tr key={index} className="bg-white-bg2">
                <td className="text-center">{gastoIngreso.tipo}</td>
                <td className="text-center">
                  {new Date(
                    obtenerFechaActual(gastoIngreso.fecha)
                  ).toLocaleDateString("es-AR")}
                </td>

                <td className="text-center">{gastoIngreso.detalle}</td>

                <td
                  className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8"
                  onClick={() => handleAnularGasto(index)}
                >
                  <FiX className="mx-auto" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Aún no hay gastos o ingresos.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showMotivoModal && (
        <Modal>
          <MotivoDeAnulacion
            motivo={motivo}
            setMotivo={setMotivo}
            onCancelar={() => {
              setShowMotivoModal(false);
              setMotivo("");
              setGastoSeleccionado(null);
            }}
            onAceptar={async () => {
              if (!motivo.trim()) {
                Swal.fire({
                  icon: "warning",
                  title: "Motivo requerido",
                  text: "Por favor, ingresá un motivo para la anulación.",
                  confirmButtonColor: "#86C394",
                });
                return;
              }

              try {
                const gasto = gastosIngreso[gastoSeleccionado];

                if (!gasto || !gasto.id) {
                  Swal.fire({
                    title: "Error",
                    text: "No se encontró el ID del gasto/ingreso.",
                    icon: "error",
                    confirmButtonColor: "#D64747",
                  });
                  return;
                }

                await axios.put(`${url}gasto-ingreso/anular?id=${gasto.id}`, {
                  motivo,
                });

                setShowMotivoModal(false);
                setMotivo("");
                setGastoSeleccionado(null);

                Swal.fire({
                  title: "Gasto anulado",
                  text: "El gasto ha sido anulado correctamente.",
                  icon: "success",
                  confirmButtonColor: "#86C394",
                });

                fetchData();
              } catch (error) {
                console.log("Error al anular:", error);

                Swal.fire({
                  title: "Error",
                  text: "No se pudo anular el gasto.",
                  icon: "error",
                  confirmButtonColor: "#D64747",
                });
              }
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default TablaPagos;
