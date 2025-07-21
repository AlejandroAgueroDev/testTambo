import React, { useState } from "react";
import Titulo from "../../../../common/Titulo";
import { MdDelete, MdEdit } from "react-icons/md";
import Modal from "../../../../common/Modal";
import AñadirServicioEventual from "./AñadirServicioEventual";
import EditarServicioEventual from "./EditarServicioEventual";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import { HiOutlineBanknotes } from "react-icons/hi2";
import InsertarMontoEventual from "./InsertarMontoEventual";

const TablaPagoEventual = ({ pagos, fetchData, casaId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  // Filtrar solo servicios eventuales
  const serviciosEventuales = pagos
    .flatMap((casa) => casa.CompromisoDePagos || [])
    .filter((c) => c.eventual === true);
    

  const openAddModal = () => {
    setModalType("add");
    setIsModalOpen(true);
  };

  const openEditModal = (cuota) => {
    setServicioSeleccionado(cuota);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const openInsertarMontoModal = (cuota) => {
    setServicioSeleccionado(cuota);
    setModalType("insertarMonto");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setServicioSeleccionado(null);
    setModalType(null);
  };

  const handleDelete = async (cuota) => {
    Swal.fire({
      title: `¿Estás seguro que deseas eliminar este servicio?`,
      text: `"${cuota.nombre_servicio}" será eliminado permanentemente.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#D64747",
      cancelButtonColor: "#A3A3A3",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}casa/compromiso/${cuota.servicioId}`);
          Swal.fire({
            title: "Servicio eventual eliminado",
            confirmButtonText: "Aceptar",
            icon: "success",
            confirmButtonColor: "#86C394",
          });
          fetchData();
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el servicio",
            icon: "error",
            confirmButtonColor: "#D64747",
          });
        }
      }
    });
  };

  const calcularCuotasTranscurridas = (fechaInicio, totalCuotas) => {
    const inicio = new Date(fechaInicio);
    const hoy = new Date();

    let mesesPasados =
      (hoy.getFullYear() - inicio.getFullYear()) * 12 +
      (hoy.getMonth() - inicio.getMonth());

    // Si el día del mes actual es menor al de inicio, aún no pasó el mes completo
    if (hoy.getDate() < inicio.getDate()) {
      mesesPasados--;
    }

    // No mostrar más de las cuotas totales
    return Math.min(mesesPasados + 1, totalCuotas);
  };

  const cuotas = serviciosEventuales.flatMap((servicio) => {
    const totalCuotas = servicio.cuotas || servicio.totalCuotas || 1;
    const cuotasTranscurridas = calcularCuotasTranscurridas(
      servicio.fecha,
      totalCuotas
    );
    return Array.from({ length: cuotasTranscurridas }).map((_, idx) => {
      const cuotaPagada = (servicio.MesesCompromisos || []).find(
        (mc, i) => i === idx
      );
      return {
        ...cuotaPagada,
        nombre_servicio: servicio.nombre_servicio,
        servicioId: servicio.id,
        nroCuota: idx + 1,
        totalCuotas,
        monto: cuotaPagada ? cuotaPagada.monto : "-",
        estado_pago: cuotaPagada ? cuotaPagada.estado_pago : "PENDIENTE",
        fecha: cuotaPagada ? cuotaPagada.fecha : null,
        id: cuotaPagada ? cuotaPagada.id : `${servicio.id}-${idx + 1}`,
      };
    });
  });

  return (
    <div className="space-y-2 items-start w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <Titulo text="PAGO EVENTUAL" />
        <button
          onClick={openAddModal}
          className="boton_verde mt-3 sm:mt-0 sm:ml-4"
        >
          AÑADIR SERVICIO EVENTUAL
        </button>
      </div>

      <div className="w-full scrollbar overflow-x-auto bg-white-bg">
        <div className="h-[350px] sm:h-[240px] max-h-[70dvh] min-w-[648px]">
          <table className="border-separate text-lg w-full relative">
            <thead className="sticky top-0 bg-white-bg3 z-10">
              <tr className="bg-white-bg3 text-white-bg text-center">
                <td>Descripción</td>
                <td>Monto</td>
                <td>Cuota</td>
                <td>Estado</td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {cuotas.length > 0 ? (
                cuotas.map((cuota) => {
                  const estaPagado = cuota.estado_pago === "PAGADO";
                  return (
                    <tr key={cuota.id} className="bg-white-bg2 text-center">
                      <td className="px-4 py-1">{cuota.nombre_servicio}</td>
                      <td className="px-4 py-1">$ {cuota.monto || "-"}</td>
                      <td className="px-4 py-1">
                        {cuota.nroCuota}/{cuota.totalCuotas}
                      </td>
                      <td
                        onClick={() => {
                          if (!estaPagado) openInsertarMontoModal(cuota);
                        }}
                        className={`px-4 py-1 font-semibold hover:underline ${
                          estaPagado
                            ? "text-green-500 cursor-not-allowed"
                            : "text-gray-500 cursor-pointer"
                        }`}
                        style={estaPagado ? { pointerEvents: "none", opacity: 0.6 } : {}}
                      >
                        <span className="flex text-sm items-center justify-center gap-2">
                          <HiOutlineBanknotes
                            size={24}
                            className={`text-xl ${
                              estaPagado
                                ? "text-green-500"
                                : "text-gray-500"
                            }`}
                          />
                          {estaPagado ? "PAGADO" : "PENDIENTE"}
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No hay cuotas para el periodo seleccionado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {modalType === "add" ? (
            <AñadirServicioEventual
              closeModal={closeModal}
              casaId={casaId}
              fetchData={fetchData}
            />
          ) : modalType === "edit" ? (
            <EditarServicioEventual
              pago={servicioSeleccionado}
              closeModal={closeModal}
              servicioEventual={true}
              fetchData={fetchData}
            />
          ) : modalType === "insertarMonto" ? (
            <InsertarMontoEventual
              cuota={servicioSeleccionado}
              onCancelar={closeModal}
              fetchData={fetchData}
              casaId={casaId}
            />
          ) : null}
        </Modal>
      )}
    </div>
  );
};

export default TablaPagoEventual;
