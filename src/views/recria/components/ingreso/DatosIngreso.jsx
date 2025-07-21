import Titulo from "../../../../common/Titulo";

const DatosIngresos = ({ setCloseModal, datos }) => {
  return (
    <div className="flex flex-col space-y-2 items-start w-[85vw] xl:w-[70vw]">
      <div className="w-full flex justify-between">
        <Titulo text={`INSEMINACION | ${datos.fecha_carga}`} />
        <button onClick={() => setCloseModal(false)} className="boton_rojo">
          VOLVER
        </button>
      </div>

      <div className="w-full max-h-[75dvh] scrollbar overflow-auto">
        <div className="space-y-3 flex flex-col items-center">
          <div className="w-full md:w-[90%]">
            <label className="text-xl font-semibold text-white-bg3">
              Datos generales
            </label>
            <div className=" bg-white-bg2 p-2 space-y-2 mx-auto">
              <div className="flex space-x-10 ">
                <div className="flex space-x-3 items-center w-[40rem]">
                  <label className="text-xl font-semibold text-white-bg3">
                    Fecha de carga
                  </label>
                  <p className="bg-white-bg text-black-comun py-1 px-5 text-xl grow">
                    {datos.fecha_carga}
                  </p>
                </div>

                <div className="flex space-x-3 items-center w-[40rem]">
                  <label className="text-xl font-semibold text-white-bg3">
                    Tipo de ingreso
                  </label>
                  <p className="bg-white-bg text-black-comun py-1 px-5 text-xl  grow">
                    {datos.tipo}
                  </p>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <label className="text-xl font-semibold text-white-bg3">
                  Aclaraciones
                </label>
                <p className="bg-white-bg text-black-comun py-1 px-5 text-xl  grow">
                  {datos.aclaracion}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[90%]">
            <label className="text-xl font-semibold text-white-bg3">
              Datos por ternero
            </label>
            <div className="w-full scrollbar overflow-auto">
              <div className="h-full max-h-60">
                <table className="border-separate text-lg w-full relative">
                  <thead className="sticky top-0 align-bottom  bg-white-bg3 z-10 text-white-bg2">
                    <tr>
                      <th className="px-[2px]">
                        {datos.tipo === "Parto" ? "Caravana madre" : "Origen"}
                      </th>
                      <th className="px-[2px]">Caravana</th>
                      <th className="px-[2px]">Genero</th>
                      <th className="px-[2px]">Peso</th>
                      <th className="px-[2px]">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white-bg">
                    {datos.arrayTerneros.map((gan) => (
                      <tr key={gan.id}>
                        <td className="w-32 bg-[#b5b6d7]">{gan.origen}</td>
                        <td className="w-32 bg-[#b5b6d7]">{gan.caravana}</td>
                        <td className="w-32 bg-white-bg2">{gan.genero}</td>
                        <td className="w-32 bg-white-bg2">{gan.peso}</td>
                        <td className="w-32 bg-white-bg2">{gan.fecha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatosIngresos;
