import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { url } from "../../common/URL_SERVER";
import axios from "axios";
//?COMPONENTS
import Titulo from "../../common/Titulo";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import Modal from "../../common/Modal";
import TablaChequesEmitidos from "./components/chequera/TablaChequera";
import EmitirCheque from "./components/chequera/EmitirCheque";
import TablaAnulados from "./components/chequera/TablaAnulados";

const Chequera = ({ token }) => {
  const [chequesEmitidos, setChequesEmitidos] = useState([]);
  const [emitirCheque, setEmitirCheque] = useState(false);
  const [showAnulados, setShowAnulados] = useState(false);
  const [chequesAnulados, setChequesAnulados] = useState([]);
  const [mesFiltro, setMesFiltro] = useState(""); // Nuevo estado para el filtro de mes
  const [sumaTotal, setSumaTotal] = useState(0);
  const [sumaMes, setSumaMes] = useState(0);

  //?GET de cheques
  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${url}caja/cheque`);
      setChequesAnulados(data.filter((cheque) => cheque.estado === "ANULADO"));
      setChequesEmitidos(
        data.filter((cheque) => cheque.estado === "ENTREGADO")
      );
    } catch (error) {
      console.log("Error al traer los datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const total = chequesEmitidos.reduce(
      (acc, cheque) => acc + Number(cheque.importe || 0),
      0
    );
    setSumaTotal(total);

    if (mesFiltro) {
      const sumaMes = chequesEmitidos
        .filter(
          (cheque) =>
            cheque.fecha_emision && cheque.fecha_emision.startsWith(mesFiltro)
        )
        .reduce((acc, cheque) => acc + Number(cheque.importe || 0), 0);
      setSumaMes(sumaMes);
    } else {
      setSumaMes(0);
    }
  }, [chequesEmitidos, mesFiltro]);

  const handleFiltrarMes = (e) => {
    setMesFiltro(e.target.value);
  };

  const handleAnulados = () => {
    setShowAnulados(true);
  };

  return (
    <ContenedorGeneral navText="CAJA">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="CAJA | CHEQUERA" />

        <div className="flex gap-4">
          <Link to="/caja" className="boton_rojo flex justify-end">
            VOLVER
          </Link>
        </div>
      </div>
      <div className="h-screen scrollbar overflow-y-auto px-2 pb-4">
        <div className="h-full w-full flex flex-col md:flex-row gap-2 md:gap-0">
          <div className="w-full md:grow scrollbar overflow-y-auto">
            <TablaChequesEmitidos
              cheques={chequesEmitidos}
              fetchData={fetchData}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 -mt-12">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <button
              onClick={() => setEmitirCheque(true)}
              className="boton_verde"
            >
              EMITIR CHEQUE
            </button>
            <button onClick={handleAnulados} className="boton_rojo">
              VER CHEQUES ANULADOS
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2">
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
      </div>

      {emitirCheque && (
        <Modal>
          <EmitirCheque
            setShowModal={setEmitirCheque}
            token={token}
            fetchData={fetchData}
          />
        </Modal>
      )}

      {showAnulados && (
        <Modal>
          <TablaAnulados cheques={chequesAnulados} onClose={setShowAnulados} />
        </Modal>
      )}
    </ContenedorGeneral>
  );
};

export default Chequera;
