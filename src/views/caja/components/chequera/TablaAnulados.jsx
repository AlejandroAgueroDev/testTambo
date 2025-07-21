import { useEffect, useState } from "react";
import { formatearFecha } from "../../../../common/fornatearFecha";
import Titulo from "../../../../common/Titulo";

const TablaAnulados = ({ cheques, onClose }) => {
  const [mesFiltro, setMesFiltro] = useState("");   // "YYYY‑MM"
  const [sumaTotal, setSumaTotal] = useState(0);
  const [sumaMes, setSumaMes] = useState(0);

  useEffect(() => {
    // Suma total de todos los cheques anulados
    const total = cheques.reduce(
      (acc, cheque) => acc + Number(cheque.importe || 0),
      0
    );
    setSumaTotal(total);

    // Suma filtrada por mes (si hay filtro)
    if (mesFiltro) {
      const sumaMesCalculada = cheques
        .filter(
          (cheque) =>
            cheque.fecha_emision && cheque.fecha_emision.startsWith(mesFiltro)
        )
        .reduce((acc, cheque) => acc + Number(cheque.importe || 0), 0);
      setSumaMes(sumaMesCalculada);
    } else {
      setSumaMes(0);
    }
  }, [cheques, mesFiltro]);
  
  const handleFiltrarMes = (e) => setMesFiltro(e.target.value);

  return (
    <div className="h-full sm:min-w-[800px] w-[380px]">
      {/* Título */}
      <div className="w-full flex justify-between">
        <Titulo text="HISTORIAL CHEQUES ANULADOS" />
      </div>

      {/* Tabla */}
      <div className="max-h-[400px] scrollbar overflow-auto mt-4">
        <table className="border-separate text-lg w-full relative">
          <thead className="sticky top-0 bg-white-bg3 z-10">
            <tr className="bg-white-bg3 text-white-bg text-center">
              <td>Banco</td>
              <td>N° Cheque</td>
              <td>Fecha Emisión</td>
              <td>Fecha Pago</td>
              <td>Detalle</td>
              <td>Destino</td>
              <td>Importe ($)</td>
            </tr>
          </thead>
          <tbody>
            {cheques.length ? (
              cheques.map((cheque, index) => (
                <tr key={index} className="bg-white-bg2 text-center">
                  <td className="px-1">{cheque.banco}</td>
                  <td className="px-1">{cheque.numero_cheque}</td>
                  <td className="px-1">
                    {cheque.fecha_emision
                      ? formatearFecha(cheque.fecha_emision)
                      : "-"}
                  </td>
                  <td className="px-1">
                    {cheque.fecha_pago
                      ? formatearFecha(cheque.fecha_pago)
                      : "-"}
                  </td>
                  <td className="px-1">{cheque.detalle}</td>
                  <td className="px-1">{cheque.destino}</td>
                  <td className="px-1">$ {cheque.importe}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-black-hover">
                  Aún no hay cheques anulados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Resumen y filtro */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
        <div className="flex items-center gap-2">
          <label className="labelInput">Filtrar por mes:</label>
          <input
            type="month"
            value={mesFiltro}
            onChange={handleFiltrarMes}
            className="input uppercase"
          />
        </div>
        <div className="flex flex-wrap gap-4 mt-2 sm:mt-0">
          <span className="labelInput">
            Suma total:&nbsp;
            <span className="text-green-700">
              ${sumaTotal.toLocaleString()}
            </span>
          </span>
          {mesFiltro && (
            <span className="labelInput">
              Suma {mesFiltro}:&nbsp;
              <span className="text-light-blue-600">
                ${sumaMes.toLocaleString()}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Botón cerrar */}
      <div className="mt-4 flex justify-end">
        <button onClick={() => onClose(false)} className="boton_rojo">
          CERRAR
        </button>
      </div>
    </div>
  );
};

export default TablaAnulados;
