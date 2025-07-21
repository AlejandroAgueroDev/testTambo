import Titulo from "../../../common/Titulo";
import { obtenerFechaActual } from "../../../common/obtenerFecha";

const TablaHistorialEntregados = ({ cheques, onClose }) => {
  return (
    <div className="h-full sm:min-w-[800px] w-[380px]">
      <div className="w-full flex justify-between">
        <Titulo text="HISTORIAL CHEQUES ENTREGADOS" />
      </div>
      <div className="max-h-[400px] scrollbar overflow-auto mt-4">
        <table className="border-separate text-lg w-full relative">
          <thead className="sticky top-0 bg-white-bg3 z-10">
            <tr className="bg-white-bg3 text-white-bg text-center">
              <td>Banco</td>
              <td>N° Cheque</td>
              <td>Fecha Emisión</td>
              <td>Origen</td>
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
                    {new Date(cheque.fecha_pago).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-1">{cheque.origen}</td>
                  <td className="px-1">{cheque.destino}</td>
                  <td className="px-1">$ {cheque.importe}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-black-hover">
                  Aún no hay cheques ENTREGADOS.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={() => onClose(false)} className="boton_rojo">
          CERRAR
        </button>
      </div>
    </div>
  );
};

export default TablaHistorialEntregados;
