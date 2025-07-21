import { HiOutlineBanknotes } from "react-icons/hi2";
import { MdDelete, MdEdit } from "react-icons/md";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Titulo from "../../../../common/Titulo";
import AñadirCompromisoPago from "./AñadirCompromisoPago";
import Modal from "../../../../common/Modal";
import InsertarMonto from "./InsertarMonto";
import EditarServicio from "./EditarServicio";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";

const TablaCompromisoPago = ({ pagos, fetchData, casaId }) => {
  const [estadoPagos, setEstadoPagos] = useState([]);
  const [modal, setModal] = useState({ tipo: null, data: null });
  const compromisos = pagos
    .flatMap((casa) => casa.CompromisoDePagos || [])
    .filter((casa) => !casa.eventual);

  useEffect(() => {
    setEstadoPagos(
      compromisos.map((c) => ({
        efectuado: c.MesesCompromisos?.[0]?.estado_pago === "PAGADO",
      }))
    );
  }, [JSON.stringify(compromisos)]);

  const abrirModal = (tipo, data = null) => {
    setModal({ tipo, data });
  };

  const cerrarModal = () => {
    setModal({ tipo: null, data: null });
  };

  const manejarConfirmacionMonto = (montoIngresado) => {
    const nuevosEstados = [...estadoPagos];
    if (modal.data !== null && nuevosEstados[modal.data]) {
      nuevosEstados[modal.data].efectuado = true;
      setEstadoPagos(nuevosEstados);
    }
    cerrarModal();

    Swal.fire({
      title: "Estado actualizado",
      text: `El pago fue marcado como 'Pagado'. Monto ingresado: $${montoIngresado}`,
      icon: "success",
      confirmButtonColor: "#86C394",
      confirmButtonText: "Aceptar",
    });
  };

  const togglePagoEfectuado = (index) => {
    if (!estadoPagos[index]) return;
    abrirModal("insertarMonto", compromisos[index]);
  };

  const eliminarServicio = (pago) => {
    Swal.fire({
      title: `¿Estás seguro que deseas eliminar este servicio?`,
      text: `"${pago.nombre_servicio}" será eliminado permanentemente.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#D64747",
      cancelButtonColor: "#A3A3A3",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}casa/compromiso/${pago.id}`);
          Swal.fire({
            title: "Eliminado",
            text: "El servicio fue eliminado correctamente.",
            icon: "success",
            confirmButtonColor: "#86C394",
            confirmButtonText: "Aceptar",
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

  return (
    <div className="space-y-2 items-start w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <Titulo text="COMPROMISO DE PAGO" />
        <button
          className="boton_verde mt-3 sm:mt-0 sm:ml-4"
          onClick={() => abrirModal("nuevoPago")}
        >
          AÑADIR COMPROMISO DE PAGO
        </button>
      </div>
      <div className="w-full scrollbar overflow-auto bg-white-bg">
        <div className="h-[350px] sm:h-[240px] max-h-[70dvh] min-w-[648px]">
          <table className="border-separate text-lg w-full relative">
            <thead className="sticky top-0 bg-white-bg3 z-10">
              <tr className="bg-white-bg3 text-white-bg text-center">
                <td>Descripcion</td>
                <td>Monto del pago</td>
                <td>Estado del pago</td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody className="">
              {compromisos.length ? (
                compromisos.map((pago, index) => {
                  const estaPagado = estadoPagos[index]?.efectuado;
                  return (
                    <tr key={index} className="bg-white-bg2">
                      <td className="text-center">{pago.nombre_servicio}</td>
                      <td className="text-center">
                        {pago.MesesCompromisos?.[0]?.monto
                          ? `$ ${pago.MesesCompromisos[0].monto}`
                          : "$ -"}
                      </td>
                      <td className="flex flex-row justify-center items-center gap-2">
                        <span
                          onClick={() => {
                            if (!estaPagado) togglePagoEfectuado(index);
                          }}
                          className={`cursor-pointer ${
                            estaPagado
                              ? "text-green-500 cursor-not-allowed"
                              : "text-gray-500"
                          }`}
                          style={
                            estaPagado
                              ? { pointerEvents: "none", opacity: 0.6 }
                              : {}
                          }
                        >
                          <HiOutlineBanknotes size={24} />
                        </span>
                        <span
                          onClick={() => {
                            if (!estaPagado) togglePagoEfectuado(index);
                          }}
                          className={`cursor-pointer text-sm font-semibold hover:underline ${
                            estaPagado
                              ? "text-green-500 cursor-not-allowed"
                              : "text-gray-500"
                          }`}
                          style={
                            estaPagado
                              ? { pointerEvents: "none", opacity: 0.6 }
                              : {}
                          }
                        >
                          {estaPagado ? "PAGADO" : "PENDIENTE"}
                        </span>
                      </td>
                      <td
                        className="hover:bg-button-green_hover bg-button-green text-white-bg text-xl cursor-pointer w-8"
                        onClick={() => abrirModal("editar", pago)}
                      >
                        <MdEdit className="mx-auto" />
                      </td>
                      <td
                        className="hover:bg-button-red_hover bg-button-red text-white-bg text-xl cursor-pointer w-8"
                        onClick={() => eliminarServicio(pago)}
                      >
                        <MdDelete className="mx-auto" />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Aún no hay pagos cargados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal.tipo === "nuevoPago" && (
        <Modal>
          <AñadirCompromisoPago
            closeModal={cerrarModal}
            fetchData={fetchData}
            casaId={casaId}
          />
        </Modal>
      )}

      {modal.tipo === "insertarMonto" && (
        <Modal>
          <InsertarMonto
            onAceptar={manejarConfirmacionMonto}
            onCancelar={cerrarModal}
            fetchData={fetchData}
            compromiso={modal.data}
          />
        </Modal>
      )}

      {modal.tipo === "editar" && modal.data && (
        <Modal>
          <EditarServicio
            pago={modal.data}
            closeModal={cerrarModal}
            servicioEventual={modal.data?.eventual || false}
            fetchData={fetchData}
          />
        </Modal>
      )}
    </div>
  );
};

export default TablaCompromisoPago;
