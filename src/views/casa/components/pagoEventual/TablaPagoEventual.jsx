import { useState, useEffect } from "react";
import Titulo from "../../../../common/Titulo";
import { MdDelete, MdEdit } from "react-icons/md";
import Modal from "../../../../common/Modal";
import AñadirServicioEventual from "./AñadirServicioEventual";
import EditarServicio from "../EditarServicio";
import InsertarMontoEventual from "./InsertarMontoEventual";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import { HiOutlineBanknotes } from "react-icons/hi2";

const TablaPagoEventual = ({
  servicios,
  selectedCasa,
  fetchCasas,
  setSelectedCasa,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [cuotaParaPagar, setCuotaParaPagar] = useState(null);
  const [showInsertarMonto, setShowInsertarMonto] = useState(false);
  const [cuotasLocales, setCuotasLocales] = useState([]);

  useEffect(() => {
    const cuotas = servicios || [];
    const cuotasOrdenadas = [...cuotas].sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );
    setCuotasLocales(cuotasOrdenadas);
  }, [servicios]);

  const handleEstadoPago = (cuota) => {
    const estaPagado =
      cuota.MesesCompromisos?.length > 0 &&
      cuota.MesesCompromisos[0].estado_pago === "PAGADO";

    if (!estaPagado) {
      setCuotaParaPagar(cuota);
      setShowInsertarMonto(true);
    }
  };

  const handleDelete = (cuota) => {
    Swal.fire({
      title: `¿Quieres eliminar el servicio "${cuota.nombre_servicio}" definitivamente?`,
      showDenyButton: true,
      confirmButtonText: "Sí",
      denyButtonText: "No",
      confirmButtonColor: "#86C394",
      denyButtonColor: "#D64747",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}casa/compromiso/${cuota.id}`);
          Swal.fire({
            title: "Servicio eventual eliminado",
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

  const openEditModal = (servicio) => {
    setServicioSeleccionado(servicio);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setModalType("add");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setServicioSeleccionado(null);
    setModalType(null);
  };

  return (
    <div className="w-full flex flex-col space-y-4 pt-2 px-2 sm:px-4 md:px-8 bg-white-bg sm:h-full sm:overflow-auto scrollbar">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <Titulo text="PAGO EVENTUAL" />
        <button onClick={openAddModal} className="boton_verde w-full sm:w-auto">
          AÑADIR SERVICIO EVENTUAL
        </button>
      </div>

      <div className="w-full overflow-x-auto overflow-y-auto max-h-[200px] scrollbar">
        <table className="border-separate text-sm sm:text-base w-full relative">
          <thead className="sticky top-0 bg-white-bg3 z-10">
            <tr className="bg-white-bg3 text-white-bg text-center font-semibold">
              <td>Servicio</td>
              <td>Monto pagado</td>
              <td>N° de Cuota</td>
              <td>Estado del pago</td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {cuotasLocales.length > 0 ? (
              cuotasLocales.map((cuota) => (
                <tr key={cuota.id} className="bg-white-bg2 text-center">
                  <td className="px-4 py-1">
                    {cuota.nombre_servicio}
                  </td>
                  <td className="px-4 py-1">
                    {cuota.MesesCompromisos?.length > 0 &&
                    cuota.MesesCompromisos[0].monto
                      ? `$ ${cuota.MesesCompromisos[0].monto}`
                      : "-"}
                  </td>
                  <td className="px-4 py-1">
                    {cuota.cuotaActual || 1}/
                    {cuota.cuotas || cuota.totalCuotas || 1}
                  </td>
                  <td
                    onClick={() => handleEstadoPago(cuota)}
                    className="px-4 py-1 flex items-center justify-center gap-2 cursor-pointer hover:underline"
                  >
                    <HiOutlineBanknotes
                      className={`text-xl ${
                        cuota.MesesCompromisos?.length > 0 &&
                        cuota.MesesCompromisos[0].estado_pago
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-semibold text-sm ${
                        cuota.MesesCompromisos?.length > 0 &&
                        cuota.MesesCompromisos[0].estado_pago === "PAGADO"
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {cuota.MesesCompromisos?.length > 0 &&
                      cuota.MesesCompromisos[0].estado_pago === "PAGADO"
                        ? "PAGADO"
                        : "PENDIENTE"}
                    </span>
                  </td>
                  <td
                    onClick={() => openEditModal(cuota)}
                    className="hover:bg-button-green_hover bg-button-green text-white-bg text-xl cursor-pointer w-8"
                  >
                    <MdEdit className="mx-auto" />
                  </td>
                  <td
                    onClick={() => handleDelete(cuota)}
                    className="hover:bg-button-red_hover bg-button-red text-white-bg text-xl cursor-pointer w-8"
                  >
                    <MdDelete className="mx-auto" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-4 uppercase font-bold text-red-700"
                >
                  No hay cuotas cargadas para los servicios eventuales
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal>
          {modalType === "add" ? (
            <AñadirServicioEventual
              idPropietario={selectedCasa.id}
              closeModal={closeModal}
              fetchCasas={fetchCasas}
              setSelectedCasa={setSelectedCasa}
            />
          ) : (
            <EditarServicio
              servicio={servicioSeleccionado}
              closeModal={closeModal}
              servicioEventual={true}
              fetchCasas={fetchCasas}
            />
          )}
        </Modal>
      )}

      {showInsertarMonto && (
        <Modal>
          <InsertarMontoEventual
            fetchCasas={() => {
              fetchCasas();
            }}
            onCancelar={() => {
              setShowInsertarMonto(false);
              setServicioParaPagar(null);
            }}
            servicios={cuotaParaPagar}
          />
        </Modal>
      )}
    </div>
  );
};

export default TablaPagoEventual;
