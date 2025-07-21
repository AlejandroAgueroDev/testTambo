import Titulo from "../../../../common/Titulo";
import { formatearFecha } from "../../../../common/FornatearFecha";

const TablaAnulada = ({ setCloseModal, anuladas, cuentas }) => {
  return (
    <div className="h-full sm:min-w-[800px] w-[380px]">
      <div className="flex mb-4">
        <Titulo text="TODAS LAS ANULACIONES" />
      </div>

      <div className="h-full max-h-[70dvh] overflex-x-auto scrollbar overflow-auto bg-white-bg">
        <table className="border-separate text-lg w-full relative">
          <thead className="sticky top-0 bg-white-bg3 z-10">
            <tr className="bg-white-bg3 text-white-bg text-center">
              <td>Tipo</td>
              <td>Fecha</td>
              <td>Cuenta origen</td>
              <td>Cuenta destino</td>
              <td>Importe</td>
            </tr>
          </thead>
          <tbody>
            {anuladas.length ? (
              anuladas.map((anulada) => (
                <tr key={anulada.id} className="bg-white-bg2 text-center">
                  <td className="px-1">{anulada.tipo}</td>
                  <td className="px-1 w-28">{formatearFecha(anulada.fecha)}</td>
                  <td className="px-1">
                    {
                      cuentas.find((cuenta) => cuenta.id === anulada.nombre_origen)
                        ?.nombre_cuenta || anulada.nombre_origen // fallback por si no encuentra la cuenta
                    }
                  </td>
                  <td className="px-1">
                    {cuentas.find(
                      (cuenta) => cuenta.id === anulada.nombre_destino
                    )?.nombre_cuenta || anulada.nombre_destino}
                  </td>
                  <td className="px-1">$ {anulada.importe}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Aun no hay transferencias anuladas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-end mt-4">
        <button onClick={() => setCloseModal(false)} className="boton_rojo">
          CERRAR
        </button>
      </div>
    </div>
  );
};

export default TablaAnulada;
