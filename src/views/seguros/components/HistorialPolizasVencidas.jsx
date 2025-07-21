import Titulo from "../../../common/Titulo";
import { exportSegurosToExcel } from "../../../common/exportSeguros";
import { useState } from "react";
import Modal from "../../../common/Modal";
import AfectadosPoliza from "./AfectadosPoliza";
import { FaNewspaper } from "react-icons/fa6";

const HistorialPolizasVencidas = ({ closeModal, PolizasVencidas }) => {
  const [documento, setDocumento] = useState(false);
  const [showDocu, setShowDocu] = useState(false);
  const [showAfectadosModal, setShowAfectadosModal] = useState(false);
  const [afectadosText, setAfectadosText] = useState("");

  // const handleDownload = () => {

  //   const headers = [
  //     "Nombre de aseguradora",
  //     "Sección",
  //     "N° Poliza",
  //     "Vigencia Desde",
  //     "Vigencia Hasta",
  //   ];

  //   const data = PolizasVencidas.map((poliza) => ({
  //     nombre: poliza.nombre,
  //     seccion: poliza.seccion,
  //     numero_poliza: poliza.numero_poliza,
  //     vigencia_desde: poliza.desde,
  //     vigencia_hasta: poliza.hasta,
  //     cantidad_cuotas: poliza.cantidad_cuotas,
  //   }));

  //   exportSegurosToExcel("Historial_Polizas_Vencidas", headers, data);
  // };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "";
    const [anio, mes, dia] = fechaISO.split("T")[0].split("-");
    return `${dia}/${mes}/${anio}`;
  };

  const handleShowDoc = (doc) => {
    setDocumento(doc);
    setShowDocu(true);
  };

  const handleShowAfectados = (text) => {
    setAfectadosText(text);
    setShowAfectadosModal(true);
  };

  return (
    <div className="h-full sm:min-w-[800px] w-[380px]">
      <div className="w-full flex justify-between">
        <Titulo text="HISTORIAL DE POLIZAS VENCIDAS" />
      </div>
      <div className="max-h-[400px] scrollbar overflow-auto mt-4">
        <table className="border-separate text-lg w-full relative">
          <thead className="sticky top-0 bg-white-bg3 z-10">
            <tr className="bg-white-bg3 text-white-bg text-center">
              <td>Estado</td>
              <td>Nombre de aseguradora</td>
              <td>Sección</td>
              <td>N° Poliza</td>
              <td>Vigencia Desde</td>
              <td>Vigencia Hasta</td>
              <td>Cantidad de Cuotas</td>
              <td>Afectados</td>
              <td>Poliza</td>
            </tr>
          </thead>
          <tbody>
            {PolizasVencidas.length ? (
              PolizasVencidas.map((poliza, index) => (
                <tr key={index} className="bg-white-bg2 text-center">
                  <td className="px-1 font-semibold text-red-400">{poliza.estado}</td>                  
                  <td className="px-1">{poliza.nombre}</td>
                  <td className="px-1">{poliza.seccion}</td>
                  <td className="px-1">{poliza.numero_poliza}</td>
                  <td className="px-1">{formatearFecha(poliza.desde)}</td>
                  <td className="px-1">{formatearFecha(poliza.hasta)}</td>
                  <td className="px-1">{poliza.cantidad_cuotas}</td>
                  <td
                    onClick={() => handleShowAfectados(poliza.afectados)}
                    title="Haga click para ver por completo"
                    className="px-1 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap truncate cursor-pointer hover:bg-white-bg_hover pr-2"
                  >
                    {poliza.afectados}
                  </td>
                  <td
                    onClick={() => handleShowDoc(poliza.foto_factura)}
                    className="hover:bg-teal-300 bg-teal-400 text-white-bg text-2xl cursor-pointer w-12"
                  >
                    <FaNewspaper className="mx-auto" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-white-bg">
                  Aún no hay pólizas vencidas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        {/* <button
          onClick={handleDownload}
          disabled={!PolizasVencidas.length}
          className={`py-2 px-5 text-lg text-white-bg2 transition 
         ${
           !PolizasVencidas.length
             ? "bg-gray-400 cursor-not-allowed"
             : "bg-button-green hover:bg-button-green_hover cursor-pointer"
         }
        `}
        >
          DESCARGAR DATOS DE POLIZAS VENCIDAS
        </button> */}
        <button onClick={closeModal} className="boton_rojo">
          CERRAR
        </button>
      </div>

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

export default HistorialPolizasVencidas;
