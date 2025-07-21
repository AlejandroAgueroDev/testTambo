import ContenedorGeneral from "../../common/ContenedorGeneral";
import TablaSeguros from "./components/TablaSeguros";
import Titulo from "../../common/Titulo";
import Modal from "../../common/Modal";
import HistorialPolizasVencidas from "./components/HistorialPolizasVencidas";
import AñadirPolizaAseguradora from "./components/AñadirPolizaAseguradora";
import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../common/URL_SERVER";
import Swal from "sweetalert2";

const Seguros = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'añadir' o 'historial'
  const [DatoSeguros, setDatoSeguros] = useState([]);
  const [PolizasVencidas, setPolizasVencidas] = useState([]);

  //?GET de seguros
  const fetchSeguros = async () => {
  try {
    const { data } = await axios.get(`${url}poliza`);    
    const vigentes = data.filter((p) => p.estado === "VIGENTE");
    const vencidas = data.filter((p) => p.estado === "VENCIDA");
    setDatoSeguros(vigentes);
    setPolizasVencidas(vencidas);
  } catch (error) {
    console.error("Error fetching seguros:", error);
    Swal.fire({
      title: "Error",
      text: "No se pudieron cargar las polizas de seguros.",
      icon: "error",
      confirmButtonColor: "#D64747",
    });
  }
};


  useEffect(() => {
    fetchSeguros();
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };
  const closeModal = () => {
    setModalType(null);
    setShowModal(false);
  };
  return (
    <ContenedorGeneral navText="SEGUROS">
      <div className="w-screen md:w-full flex justify-between items-center pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="LISTA DE SEGUROS VIGENTES" />
      </div>
      <div className="h-full w-screen scrollbar overflow-auto pr-4 md:pr-0 md:w-auto">
        <TablaSeguros DatoSeguros={DatoSeguros} fetchSeguros={fetchSeguros} />
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <button onClick={() => openModal("añadir")} className="boton_verde">
          AÑADIR POLIZA ASEGURADORA
        </button>

        <button onClick={() => openModal("historial")} className="boton_rojo">
          HISTORIAL DE POLIZAS VENCIDAS
        </button>
      </div>

      {showModal && (
        <Modal>
          {modalType === "añadir" && (
            <AñadirPolizaAseguradora
              closeModal={closeModal}
              fetchSeguros={fetchSeguros}
            />
          )}

          {modalType === "historial" && (
            <HistorialPolizasVencidas
              PolizasVencidas={PolizasVencidas}
              closeModal={closeModal}
            />
          )}
        </Modal>
      )}
    </ContenedorGeneral>
  );
};

export default Seguros;