import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { url } from "../../common/URL_SERVER";
//?COMPONENTS
import Titulo from "../../common/Titulo";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import TablaEfectivo from "./components/efectivo/TablaEfectivo";
import Modal from "../../common/Modal";
import AñadirEfectivo from "./components/efectivo/AñadirEfectivo";
import HistorialAnulados from "./components/efectivo/HistorialAnulados";

const Efectivo = () => {
  const [efectivo, setEfectivo] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [onModal, setOnModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sector, setSector] = useState([]);

  const handleHistorialAnulados = () => setShowModal(true);
  const onOpenModal = () => setOnModal(true);

  const fetchSector = async () => {
    try {
      const { data } = await axios.get(`${url}sector`);
      setSector(data);
    } catch (error) {
      console.log("Error al traer los sectors:", error);
    }
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${url}caja/efectivo`);
      setEfectivo(data);
    } catch (error) {
      console.log("Error al traer los datos:", error);
    }
  };

  useEffect(() => {
    fetchSector();
    fetchData();
  }, []);

  const efectivoAceptado = efectivo.filter((d) => d.estado === "ACEPTADO");
  const efectivoAnulado = efectivo.filter((d) => d.estado === "ANULADO");

  useEffect(() => {
    const total = efectivoAceptado.reduce((acc, item) => {
      const monto = Number(item.monto);
      return acc + (isNaN(monto) ? 0 : monto);
    }, 0);
    setSaldo(total);
  }, [efectivoAceptado]);

  return (
    <ContenedorGeneral navText="CAJA">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="CAJA | EFECTIVO" />

        <div className="flex gap-4">
          <Link to="/caja" className="boton_rojo flex justify-end">
            VOLVER
          </Link>
        </div>
      </div>
      <div className="h-full w-full flex flex-col md:flex-row gap-2 md:gap-0 overflow-auto">
        <div className="w-full md:grow bg-white-bg scrollbar overflow-x-auto">
          <TablaEfectivo
            datosEfectivo={[...efectivoAceptado].reverse()}
            fetchData={fetchData}
            sector={sector}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onOpenModal}
            className="boton_verde w-full sm:w-auto"
          >
            AÑADIR EFECTIVO
          </button>
          <button
            onClick={handleHistorialAnulados}
            className="boton_rojo w-full sm:w-auto"
          >
            HISTORIAL DE TRANSFERENCIAS ANULADAS
          </button>
        </div>
        <div className="bg-white-bg2 flex flex-col sm:flex-row p-2 gap-2 sm:gap-2 items-end sm:items-center text-sm sm:text-lg w-full sm:w-auto border border-gray-500">
          <p className="font-bold text-end sm:text-left w-full sm:w-auto ">
            SALDO TOTAL:
          </p>
          <strong>$ {saldo.toLocaleString("es-AR")}</strong>
        </div>
      </div>

      {onModal && (
        <Modal>
          <AñadirEfectivo
            onClose={setOnModal}
            fetchData={fetchData}
            sectores={sector}
          />
        </Modal>
      )}

      {showModal && (
        <Modal>
          <HistorialAnulados
            closeModal={setShowModal}
            anuladas={[...efectivoAnulado].reverse()}
            sector={sector}
          />
        </Modal>
      )}
    </ContenedorGeneral>
  );
};

export default Efectivo;
