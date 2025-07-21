import ContenedorGeneral from "../../common/ContenedorGeneral";
import Titulo from "../../common/Titulo";
import TablaPagos from "./components/TablaPagos.jsx";
import { useState, useEffect } from "react";
import Modal from "../../common/Modal.jsx";
import AñadirCheque from "./components/AñadirCheque.jsx";
import axios from "axios";
import { url } from "../../common/URL_SERVER";
import Swal from "sweetalert2";
import EditarCheque from "./components/EditarCheque.jsx";
import TablaHistorialCobrados from "./components/TablaHistorialCobrados.jsx";
import TablaHistorialEntregados from "./components/TablaHistorialEntregados.jsx";
import TablaHistorialAnulados from "./components/TablaHistorialAnulados.jsx";

const Banco = () => {
  const [showModal, setShowModal] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [chequeEditando, setChequeEditando] = useState(null);
  const [showModalHistorial, setShowModalHistorial] = useState(false);
  const [showEntregados, setShowEntregados] = useState(false);
  const [showAnulados, setShowAnulados] = useState(false);
  const [chequesCobrados, setChequesCobrados] = useState([]);
  const [chequesEntregados, setChequesEntregados] = useState([]);
  const [chequesAnulados, setChequesAnulados] = useState([]);

  const [mesFiltro, setMesFiltro] = useState("");
  const [sumaTotal, setSumaTotal] = useState(0);
  const [sumaMes, setSumaMes] = useState(0);

  const handleEditCheque = (cheque) => {
    setChequeEditando(cheque);
    setEditModalOpen(true);
  };

  const handleAnulados = () => {
    setShowAnulados(true);
  };

  const handleEntregados = () => {
    setShowEntregados(true);
  };

  const obtenerCheques = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${url}banco/cheques`);      
      setPagos(data.filter((cheque) => cheque.estado === "PENDIENTE"));
      setChequesCobrados(data.filter((cheque) => cheque.estado === "COBRADO"));
      setChequesEntregados(
        data.filter((cheque) => cheque.estado === "ENTREGADO")
      );
      setChequesAnulados(data.filter((cheque) => cheque.estado === "ANULADO"));
    } catch (error) {
      console.error("Error al obtener los cheques:", error);
      Swal.fire({
        title: "Error al cargar los cheques",
        text: error.response?.data?.message || "Ocurrió un error inesperado",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCheques();
  }, []);

  useEffect(() => {
    const total = pagos.reduce(
      (acc, cheque) => acc + Number(cheque.importe || 0),
      0
    );
    setSumaTotal(total);

    if (mesFiltro) {
      const sumaMes = pagos
        .filter(
          (cheque) =>
            cheque.fecha_emision && cheque.fecha_emision.startsWith(mesFiltro)
        )
        .reduce((acc, cheque) => acc + Number(cheque.importe || 0), 0);
      setSumaMes(sumaMes);
    } else {
      setSumaMes(0);
    }
  }, [pagos, mesFiltro]);

  const handleFiltrarMes = (e) => {
    setMesFiltro(e.target.value);
  };

  const handleAgregarCheque = () => {
    setShowModal(true);
  };

  const hanldeHistorialCobrados = () => {
    setShowModalHistorial(true);
  };

  const agregarNuevoCheque = (nuevoCheque) => {
    setPagos([...pagos, nuevoCheque]);
  };

  return (
    <ContenedorGeneral navText="BANCO">
      <div className="w-full flex flex-col md:flex-row justify-between items-center px-4 md:px-0 mb-4">
        <Titulo text="CHEQUES EN CARTERA" />
      </div>

      <div className="h-full w-screen scrollbar overflow-auto pr-4 md:pr-0 md:w-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Cargando cheques...</p>
          </div>
        ) : (
          <TablaPagos
            pagos={pagos}
            onChequeUpdated={obtenerCheques}
            onEditCheque={handleEditCheque}
          />
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 px-2 mt-4">
        {/* BOTONES */}
        <div className="flex flex-col md:flex-row gap-2">
          <button onClick={handleAgregarCheque} className="boton_verde">
            AÑADIR CHEQUE
          </button>
          <div className="flex flex-col md:flex-row gap-2">
            <button onClick={hanldeHistorialCobrados} className="boton_verde">
              HISTORIAL COBRADOS
            </button>
            <button onClick={handleEntregados} className="boton_cian">
              HISTORIAL ENTREGADOS
            </button>
            <button onClick={handleAnulados} className="boton_rojo">
              HISTORIAL ANULADOS
            </button>
          </div>
        </div>

        {/* FILTRO Y TOTALES */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <label className="labelInput">Filtrar por mes:</label>
          <input
            type="month"
            value={mesFiltro}
            onChange={handleFiltrarMes}
            className="input uppercase"
          />
          <span className="labelInput">
            Suma total:{" "}
            <span className="text-green-700">
              ${sumaTotal.toLocaleString()}
            </span>
          </span>
          {mesFiltro && (
            <span className="labelInput">
              Suma {mesFiltro}:{" "}
              <span className="text-light-blue-600">
                ${sumaMes.toLocaleString()}
              </span>
            </span>
          )}
        </div>
      </div>

      {editModalOpen && chequeEditando && (
        <Modal>
          <EditarCheque
            cheque={chequeEditando}
            setShowModal={setEditModalOpen}
            onChequeUpdated={obtenerCheques}
          />
        </Modal>
      )}

      {showModal && (
        <Modal>
          <AñadirCheque
            setShowModal={setShowModal}
            agregarNuevoCheque={agregarNuevoCheque}
            obtenerCheques={obtenerCheques}
          />
        </Modal>
      )}

      {showModalHistorial && (
        <Modal>
          <TablaHistorialCobrados
            cheques={chequesCobrados}
            setShowModalHistorial={setShowModalHistorial}
          />
        </Modal>
      )}

      {showEntregados && (
        <Modal>
          <TablaHistorialEntregados
            cheques={chequesEntregados}
            onClose={setShowEntregados}
          />
        </Modal>
      )}

      {showAnulados && (
        <Modal>
          <TablaHistorialAnulados
            cheques={chequesAnulados}
            onClose={setShowAnulados}
          />
        </Modal>
      )}
    </ContenedorGeneral>
  );
};

export default Banco;
