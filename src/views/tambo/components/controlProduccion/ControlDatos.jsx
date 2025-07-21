import { useEffect, useState } from "react";
import Titulo from "../../../../common/Titulo";

const ControlDatos = ({ setCloseModal, datos }) => {
  const [datosExtra, setDatosExtra] = useState({});
  useEffect(() => {
    const objDatosExtra = {};

    datos.Lotes.map((lote) => {
      // const datosExtraLote = {
      //     litrosTotal: 0,
      //     cantidadAnimales:0,
      //     promedio:0
      // }

      let litros = 0;
      lote.ControlLecheros.map((cl) => {
        litros += cl.total;
      });

      const cantdadAnimales = lote.ControlLecheros.length;

      const promedio = litros / cantdadAnimales;

      objDatosExtra[lote.nombre_lote] = {
        litrosTotal: litros,
        cantdadAnimales: cantdadAnimales,
        promedio: promedio,
      };
    });

    setDatosExtra(objDatosExtra);
  }, []);

  return (
    <div className="flex flex-col space-y-2 items-start w-[95vw] sm:w-[85vw] xl:w-[70vw]">
      <div className="w-full flex justify-between">
        <Titulo text={`CONTROL ${datos.createdAt}`} />
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
                <div className="flex flex-col sm:flex-row sm:space-x-3 sm:items-center w-[40rem]">
                  <label className="text-xl font-semibold text-white-bg3">
                    Litros en tanque
                  </label>
                  <p className="bg-white-bg text-black-comun py-1 px-5 text-xl grow">
                    {datos.litros_tanque}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-3 sm:items-center w-[40rem]">
                  <label className="text-xl font-semibold text-white-bg3">
                    Litros medidos
                  </label>
                  <p className="bg-white-bg text-black-comun py-1 px-5 text-xl  grow">
                    {datos.litros_medidos}
                  </p>
                </div>
              </div>
              <div className="flex space-x-10 items-end">
                <div className="flex flex-col sm:flex-row sm:space-x-3 sm:items-center w-[40rem]">
                  <label className="text-xl font-semibold text-white-bg3">
                    Total vacas en ordeñe
                  </label>
                  <p className="bg-white-bg text-black-comun py-1 px-5 text-xl  grow">
                    {datos.total_vacas_ordeñe}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-3 sm:items-center w-[40rem]">
                  <label className="text-xl font-semibold text-white-bg3">
                    Promedio tambo
                  </label>
                  <p className="bg-white-bg text-black-comun py-1 px-5 text-xl  grow">
                    {datos.promedio_tambo}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[90%]">
            <label className="text-xl font-semibold text-white-bg3">
              Lotes
            </label>
            <div className="space-y-4">
              {datos.Lotes.map((lote) => (
                <div className="bg-white-bg2 w-full space-y-4 p-2">
                  <div className="flex flex-col sm:flex-row sm:space-x-3">
                    <div className="flex flex-col w-full sm:w-80">
                      <label className="text-xl font-semibold text-white-bg3 truncate">
                        Nombre de lote
                      </label>
                      <p className="bg-white-bg text-black-comun py-1 px-5 text-xl grow truncate">
                        {lote.nombre_lote}
                      </p>
                    </div>

                    <div className="flex flex-col w-full sm:w-80">
                      <label className="text-xl font-semibold text-white-bg3 truncate">
                        Litros total
                      </label>
                      <p className="bg-white-bg text-black-comun py-1 px-5 text-xl grow">
                        {datosExtra[lote.nombre_lote]
                          ? datosExtra[lote.nombre_lote].litrosTotal
                          : null}
                      </p>
                    </div>

                    <div className="flex flex-col w-full sm:w-80">
                      <label className="text-xl font-semibold text-white-bg3">
                        Vacas
                      </label>
                      <p className="bg-white-bg text-black-comun py-1 px-5 text-xl grow">
                        {datosExtra[lote.nombre_lote]
                          ? datosExtra[lote.nombre_lote].cantdadAnimales
                          : null}
                      </p>
                    </div>

                    <div className="flex flex-col w-full sm:w-80">
                      <label className="text-xl font-semibold text-white-bg3">
                        Promedio
                      </label>
                      <p className="bg-white-bg text-black-comun py-1 px-5 text-xl grow">
                        {datosExtra[lote.nombre_lote]
                          ? datosExtra[lote.nombre_lote].promedio
                          : null}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <div className="flex flex-col w-[40rem]">
                      <label className="text-xl font-semibold text-white-bg3 truncate">
                        1° Ordeñe
                      </label>
                      <p className="bg-white-bg text-black-comun py-1 px-5 text-xl grow truncate">
                        De {lote.hora_inicio_ordeñe1} a {lote.hora_fin_ordeñe1}
                      </p>
                    </div>

                    <div className="flex flex-col w-[40rem]">
                      <label className="text-xl font-semibold text-white-bg3 truncate">
                        2° Ordeñe
                      </label>
                      <p className="bg-white-bg text-black-comun py-1 px-5 text-xl grow">
                        De {lote.hora_inicio_ordeñe2} a {lote.hora_fin_ordeñe2}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xl font-semibold text-white-bg3 truncate">
                      Datos por animal
                    </label>
                    <div className="w-full scrollbar overflow-auto">
                      <div className="max-h-[80dvh] min-w-[648px]">
                        <table className="border-separate text-lg w-full relative">
                          <thead className="sticky top-0 bg-white-bg3 z-10">
                            <tr className="bg-white-bg3 text-center">
                              <td>Caravana</td>
                              <td>1° Ordeñe</td>
                              <td>2° Ordeñe</td>
                              <td>Total</td>
                              <td>Observación</td>
                            </tr>
                          </thead>
                          <tbody>
                            {lote.ControlLecheros.length ? (
                              lote.ControlLecheros.map((control) => (
                                <tr className="bg-white-bg2 text-center">
                                  <td className="bg-[#d8c7bb]">
                                    {control.caravana}
                                  </td>
                                  <td className="bg-white-bg">
                                    {control.litros_ordeñe1}
                                  </td>
                                  <td className="bg-white-bg">
                                    {control.litros_ordeñe2}
                                  </td>
                                  <td className="bg-[#b5b6d7]">
                                    {control.total}
                                  </td>
                                  <td className="bg-[#d8c7bb]">
                                    {control.observacion}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <p>{placeHolder}</p>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlDatos;
