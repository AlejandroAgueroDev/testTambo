import { useState, useEffect } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { url } from "../../../../common/URL_SERVER";
import axios from "axios";
import Swal from "sweetalert2";
//? COMPONENTS
import Titulo from "../../../../common/Titulo";
import AñadirServicio from "./AñadirServicio";
import EditarServicio from "../EditarServicio";
import InsertarMontoCompromiso from "./InsertarMontoCompromiso";
import Modal from "../../../../common/Modal";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";

const TablaCompromisoPagos = ({
  servicios,
  selectedCasa,
  fetchCasas,
  setSelectedCasa,
  selectedPeriodo,
  handlePeriodoChange,
}) => {
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  const [showInsertarMonto, setShowInsertarMonto] = useState(false);
  const [servicioParaPagar, setServicioParaPagar] = useState(null);
  const [serviciosLocales, setServiciosLocales] = useState([]);

  useEffect(() => {
    if (servicios) {
      const serviciosOrdenados = [...servicios].sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );
      setServiciosLocales(serviciosOrdenados);
    }
  }, [servicios]);

  const handleToggleEstadoPago = (servicio) => {
    const estaPagado =
      servicio.MesesCompromisos?.length > 0 &&
      servicio.MesesCompromisos[0].estado_pago === "PAGADO";

    if (!estaPagado) {
      setServicioParaPagar(servicio);
      setShowInsertarMonto(true);
    }
  };

  const handleDelete = (servicio) => {
    Swal.fire({
      title: `¿Quieres eliminar el servicio "${servicio.nombre_servicio}" definitivamente?`,
      showDenyButton: true,
      confirmButtonText: "Sí",
      denyButtonText: "No",
      confirmButtonColor: "#86C394",
      denyButtonColor: "#D64747",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}casa/compromiso/${servicio.id}`);
          Swal.fire({
            title: "Compromiso de pago eliminado",
            confirmButtonText: "Aceptar",
            icon: "success",
            confirmButtonColor: "#86C394",
          });
          fetchCasas();
        } catch (error) {
          console.error("Error eliminando el servicio:", error);
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

  const openEditModal = (servicio, data, isEventual) => {
    setModal({
      open: true,
      type: "edit",
      data: { ...data, nombre: servicio, eventual: isEventual },
    });
  };

  const openAddModal = () => {
    setModal({ open: true, type: "add", data: null });
  };

  const closeModal = () => {
    setModal({ open: false, type: null, data: null });
  };

  return (
    <div className="w-full flex flex-col space-y-4 pt-2 px-2 sm:px-4 md:px-8 bg-white-bg sm:h-full sm:overflow-auto scrollbar">
      {/* Filtro Periodo */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-2">
        <div className="containerInput w-full sm:w-auto">
          <label className="labelInput">SELECCIONE PERIODO</label>
          <input
            type="month"
            max={`${obtenerFechaActual("mes")}`}
            value={selectedPeriodo}
            onChange={handlePeriodoChange}
            className="bg-white-bg2 text-black-comun py-2 px-2 text-base sm:text-xl w-full sm:w-[240px] uppercase"
          />
        </div>
      </div>

      {/* Titulo + Boton */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <Titulo text="COMPROMISOS DE PAGO" />
        <button onClick={openAddModal} className="boton_verde w-full sm:w-auto">
          AÑADIR SERVICIO
        </button>
      </div>

      {/* Tabla */}
      <div className="w-full overflow-x-auto overflow-y-auto max-h-[200px] scrollbar">
        <table className="border-separate text-sm sm:text-base w-full relative">
          <thead className="sticky top-0 bg-white-bg3 z-10">
            <tr className="bg-white-bg3 text-white-bg text-center font-semibold">
              <td className="p-2">Servicio</td>
              <td className="p-2">Monto Pagado</td>
              <td className="p-2">Estado del Pago</td>
              <td className="p-2"></td>
              <td className="p-2"></td>
            </tr>
          </thead>
          <tbody>
            {serviciosLocales.length > 0 ? (
              serviciosLocales.map((servicio) => (
                <tr key={servicio.id} className="bg-white-bg2 text-center">
                  <td className="px-2 sm:px-4 py-2">
                    {servicio.nombre_servicio}
                  </td>
                  <td className="px-2 sm:px-4 py-2">
                    $
                    {servicio.MesesCompromisos?.length > 0
                      ? servicio.MesesCompromisos[0].monto
                      : "-"}
                  </td>
                  <td
                    onClick={() => handleToggleEstadoPago(servicio)}
                    className="px-2 sm:px-4 py-2 flex items-center justify-center gap-2 cursor-pointer hover:underline"
                  >
                    <HiOutlineBanknotes
                      className={`text-xl ${
                        servicio.MesesCompromisos?.length > 0 &&
                        servicio.MesesCompromisos[0].estado_pago
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-semibold text-xs sm:text-sm ${
                        servicio.MesesCompromisos?.length > 0 &&
                        servicio.MesesCompromisos[0].estado_pago === "PAGADO"
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {servicio.MesesCompromisos?.length > 0 &&
                      servicio.MesesCompromisos[0].estado_pago === "PAGADO"
                        ? "PAGADO"
                        : "PENDIENTE"}
                    </span>
                  </td>
                  <td
                    onClick={() =>
                      openEditModal(
                        servicio.nombre_servicio,
                        servicio,
                        servicio.eventual
                      )
                    }
                    className="hover:bg-button-green_hover bg-button-green text-white-bg text-xl cursor-pointer w-8"
                  >
                    <MdEdit className="mx-auto" />
                  </td>
                  <td
                    onClick={() => handleDelete(servicio)}
                    className="hover:bg-button-red_hover bg-button-red text-white-bg text-xl cursor-pointer w-8"
                  >
                    <MdDelete className="mx-auto" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 uppercase font-bold text-red-700 text-sm sm:text-base"
                >
                  No hay servicios para este período
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {modal.open && (
        <Modal>
          {modal.type === "add" ? (
            <AñadirServicio
              closeModal={closeModal}
              idPropietario={selectedCasa.id}
              fetchCasas={fetchCasas}
              setSelectedCasa={setSelectedCasa}
            />
          ) : (
            <EditarServicio
              servicio={modal.data}
              closeModal={closeModal}
              servicioEventual={modal.data?.eventual || false}
              fetchCasas={fetchCasas}
            />
          )}
        </Modal>
      )}

      {showInsertarMonto && (
        <Modal>
          <InsertarMontoCompromiso
            fetchCasas={fetchCasas}
            onCancelar={() => {
              setShowInsertarMonto(false);
              setServicioParaPagar(null);
            }}
            servicios={servicioParaPagar}
          />
        </Modal>
      )}
    </div>
  );
};

export default TablaCompromisoPagos;
