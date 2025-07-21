import Titulo from "../../../../common/Titulo";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
const TablaPagos = ({ anulados, onClose }) => {
  return (
    <div className="h-full sm:min-w-[800px] w-[380px]">
      <div className="flex mb-4">
        <Titulo text="HISTORIAL DE GASTOS E INGRESOS ANULADOS" />
      </div>
      <div className="h-full overflex-x-auto scrollbar overflow-auto">
        <table className="border-separate text-lg w-full relative">
          <thead className="sticky top-0 bg-white-bg3 z-10">
            <tr className="bg-white-bg3 text-white-bg text-center">
              <td>Tipo</td>
              <td>Fecha del Gasto/Ingreso</td>
              <td>Detalle</td>
              <td>Motivo de anulación</td>
            </tr>
          </thead>
          <tbody>
            {anulados.length ? (
              anulados.map((anulado, index) => (
                <tr key={index} className="bg-white-bg2">
                  <td className="text-center">{anulado.tipo || "-"}</td>
                  <td className="text-center">
                  {new Date(
                    obtenerFechaActual(anulado.fecha || "-")
                  ).toLocaleDateString("es-AR")}
                </td>
                  <td className="text-center">{anulado.detalle || "-"}</td>
                  <td className="text-center">{anulado.motivo || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Aún no hay anulados o ingresos anulados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-end mt-4">
        <button onClick={onClose} className="boton_rojo">
          CERAR
        </button>
      </div>
    </div>
  );
};

export default TablaPagos;
