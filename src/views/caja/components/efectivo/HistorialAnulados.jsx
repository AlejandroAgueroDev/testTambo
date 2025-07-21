import Titulo from "../../../../common/Titulo";

const HistorialAnulados = ({ closeModal, anuladas, sector }) => {
  return (
    <div className="h-full sm:min-w-[800px] w-[380px]">
      <div className="flex mb-4">
        <Titulo text="TODAS LAS ANULACIONES" />
      </div>

      <div className="h-full max-h-[70dvh] scrollbar overflow-auto bg-white-bg">
        <table className="border-separate text-lg w-full relative">
          <thead className="sticky top-0 bg-white-bg3 z-10">
            <tr className="bg-white-bg3 text-white-bg text-center">
              <td>Fecha</td>
              <td>Método</td>
              <td>Importe</td>
              <td>Detalle</td>
              <td>Tipo Movimiento</td>
              <td>Origen/Destino</td>
            </tr>
          </thead>
          <tbody>
            {anuladas.length ? (
              anuladas.map((anulada) => (
                <tr key={anulada.id} className="bg-white-bg2 text-center">
                  <td className="px-1 w-28">
                    {anulada.createdAt?.split("T")[0].split("-").reverse().join("/")}
                  </td>
                  <td className="px-1">{anulada.metodo}</td>
                  <td className="px-1">$ {Number(anulada.monto).toLocaleString()}</td>
                  <td className="px-1">
                    {anulada.GastoIngreso?.detalle || "-"}
                  </td>
                  <td className="px-1">{anulada.GastoIngreso?.tipo || "-"}</td>
                  <td className="px-1">
                    {(() => {
                      const tipo = anulada.GastoIngreso?.tipo;
                      const nombreSector = sector.find(
                        (sector) =>
                          sector.id === anulada.GastoIngreso?.id_sector
                      )?.nombre;
                      if (!tipo || !nombreSector) return "-";
                      return `${nombreSector} (${
                        tipo === "EGRESO" ? "DESTINO" : "ORIGEN"
                      })`;
                    })()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Aún no hay transferencias anuladas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-end mt-4">
        <button onClick={() => closeModal(false)} className="boton_rojo">
          CERRAR
        </button>
      </div>
    </div>
  );
};

export default HistorialAnulados;
