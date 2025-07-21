import { MdDelete, MdEdit } from "react-icons/md";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { FaNewspaper } from "react-icons/fa6";
//?COMPONENTS
import Modal from "../../../common/Modal";
import { url } from "../../../common/URL_SERVER";
import EditarPolizas from "./EditarPolizas";
import AfectadosPoliza from "./AfectadosPoliza";
import Titulo from "../../../common/Titulo";

const TablaSeguros = ({ DatoSeguros, fetchSeguros }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedPoliza, setSelectedPoliza] = useState(null);
  const [showAfectadosModal, setShowAfectadosModal] = useState(false);
  const [afectadosText, setAfectadosText] = useState("");
  const [documento, setDocumento] = useState(false);
  const [showDocu, setShowDocu] = useState(false);

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "";
    const [anio, mes, dia] = fechaISO.split("T")[0].split("-");
    return `${dia}/${mes}/${anio}`;
  };

  //?DELETE de seguros
  const handleDelete = async (id) => {
    const poliza = DatoSeguros.find((p) => p.id === id);
    Swal.fire({
      title: `¿Estás seguro que deseas eliminar la póliza aseguradora "${poliza?.nombre}"?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D64747",
      cancelButtonColor: "#7C7C7C",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${url}poliza/${id}`);

          Swal.fire({
            title: "¡Eliminado!",
            text:
              response.data?.message ||
              "La póliza fue eliminada correctamente.",
            icon: "success",
            confirmButtonColor: "#86C394",
          }).then(() => {
            fetchSeguros();
          });
        } catch (error) {
          console.error("Error al eliminar:", {
            request: error.config,
            response: error.response,
            message: error.message,
          });

          Swal.fire({
            title: "Error",
            text:
              error.response?.data?.error || "No se pudo eliminar la póliza",
            icon: "error",
            confirmButtonColor: "#D64747",
          });
        }
      }
    });
  };

  const handleMarcarComoVencida = async (seguro) => {
    if (seguro.estado !== "VIGENTE") return;

    Swal.fire({
      title: "¿Está seguro de querer cambiar el estado de la poliza?",
      text: `¿Desea marcar la póliza "${seguro.nombre}" como vencida?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D64747",
      cancelButtonColor: "#7C7C7C",
      confirmButtonText: "Sí, marcar como vencida",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`${url}poliza/marcar-vencida?id=${seguro.id}`);
          Swal.fire({
            title: "¡Actualizado!",
            text: "La póliza fue marcada como vencida.",
            icon: "success",
            confirmButtonColor: "#86C394",
          });
          fetchSeguros(); // vuelve a traer los datos actualizados
        } catch (error) {
          console.error("Error al marcar como vencida:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo actualizar el estado de la póliza.",
            icon: "error",
            confirmButtonColor: "#D64747",
          });
        }
      }
    });
  };

  const handleShowDoc = (doc) => {
    setDocumento(doc);
    setShowDocu(true);
  };

  const handleShowAfectados = (text) => {
    setAfectadosText(text);
    setShowAfectadosModal(true);
  };

  const openModal = (type, seguro) => {
    setModalType(type);
    setSelectedPoliza(seguro);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPoliza(null);
    setShowModal(false);
  };

  return (
    <div className="h-full min-w-[648px] overflex-x-auto scrollbar overflow-auto">
      <table className="border-separate text-lg w-full relative">
        <thead className="sticky top-0 bg-white-bg3 z-10">
          <tr className="bg-white-bg3 text-white-bg text-center">
            <td>Nombre de aseguradora</td>
            <td>Sección</td>
            <td>N° de poliza</td>
            <td>Importe</td>
            <td>Vigencia Desde</td>
            <td>Vigencia Hasta</td>
            <td>N° de cuotas</td>
            <td>Estado</td>
            <td>Afectados por la Póliza</td>
            <td>Póliza</td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {DatoSeguros.length ? (
            DatoSeguros.map((seguro, index) => (
              <tr key={index} className="bg-white-bg2 text-center">
                <td className="px-1">{seguro.nombre}</td>
                <td className="px-1">{seguro.seccion}</td>
                <td className="px-1">{seguro.numero_poliza || "-"}</td>
                <td className="px-1">$ {seguro.importe}</td>
                <td className="px-1">{formatearFecha(seguro.desde)}</td>
                <td className="px-1">{formatearFecha(seguro.hasta)}</td>
                <td className="px-1">{seguro.cantidad_cuotas}</td>
                <Tippy
                  content="Cambiar estado de poliza"
                  placement="top"
                  arrow={true}
                  theme="custom_2"
                >
                  <td
                    onClick={() => handleMarcarComoVencida(seguro)}
                    className={`px-1 font-semibold ${
                      seguro.estado === "VIGENTE"
                        ? "text-green-600 hover:text-green-400 cursor-pointer"
                        : "text-gray-600"
                    }`}
                  >
                    {seguro.estado}
                  </td>
                </Tippy>
                <Tippy
                  content="Haga click para ver por completo"
                  placement="top"
                  arrow={true}
                  theme="custom_2"
                >
                  <td
                    onClick={() => handleShowAfectados(seguro.afectados)}
                    title="Haga click para ver por completo"
                    className="px-1 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap truncate cursor-pointer hover:bg-white-bg_hover pr-2"
                  >
                    {seguro.afectados}
                  </td>
                </Tippy>
                <Tippy
                  content="Ver imagen completa"
                  placement="top"
                  arrow={true}
                  theme="custom_2"
                >
                  <td
                    onClick={() => handleShowDoc(seguro.foto_factura)}
                    className="hover:bg-teal-300 bg-teal-400 text-white-bg text-2xl cursor-pointer w-12"
                  >
                    <FaNewspaper className="mx-auto" />
                  </td>
                </Tippy>
                <td
                  className="hover:bg-button-green_hover bg-button-green text-white-bg text-2xl cursor-pointer w-8"
                  onClick={() => openModal("editar", seguro)}
                >
                  <MdEdit className="mx-auto" />
                </td>
                <td
                  className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8"
                  onClick={() => handleDelete(seguro.id)}
                >
                  <MdDelete className="mx-auto" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-4 text-black-comun">
                Aún no se cargaron pólizas aseguradoras.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && modalType === "editar" && (
        <Modal>
          <EditarPolizas
            closeModal={closeModal}
            poliza={selectedPoliza}
            fetchSeguros={fetchSeguros}
          />
        </Modal>
      )}

      {showAfectadosModal && (
        <Modal>
          <AfectadosPoliza
            afectados={afectadosText}
            closeModal={() => setShowAfectadosModal(false)}
          />
        </Modal>
      )}

      {showDocu ? (
        <Modal>
          <div className="w-full flex justify-between pb-2">
            <Titulo text="FOTO DE POLIZA ASEGURADORA" />
            <button onClick={() => setShowDocu(false)} className="boton_rojo">
              VOLVER
            </button>
          </div>
          <img
            src={documento}
            alt="Imagen cargada en seguros"
            className="w-[300px] lg:w-[450px] sm:aspect-[10/12] aspect-[8/8] object-cover ml-10 sm:ml-0 scrollbar overflow-auto"
          />
        </Modal>
      ) : null}
    </div>
  );
};

export default TablaSeguros;
