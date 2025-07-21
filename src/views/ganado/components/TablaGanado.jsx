import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../../common/URL_SERVER";
import Paginador from "../../../common/Paginador";
import LoaderDatos from "../../../common/LoaderDatos";

const TablaGanado = () => {
  const [ganado, setGanado] = useState([]);
  const [cantidadPaginas, setCantidadPaginas] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setLoader(true);
    axios(url + `tambo/ganado?page=${paginaActual}&limit=15`).then(
      ({ data }) => {
        setCantidadPaginas(data.totalPages);
        setPaginaActual(data.currentPage);
        setLoader(false);
        const ganadoCorregido = [];
        data.data.map((g) => {
          const fecha = g.fecha_ingreso.split("T")[0];
          const arrayFecha = fecha.split("-");
          const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
          ganadoCorregido.push({
            ...g,
            fecha_ingreso: fechaFinal,
          });
        });
        setGanado(ganadoCorregido);
      }
    );
  }, [paginaActual]);

  return (
    <div>
      <div className="h-full min-w-[648px] overflex-x-auto scrollbar overflow-auto relative">
        <table className="border-separate text-lg w-full relative ">
          <thead className="sticky top-0 bg-white-bg3 z-10">
            <tr className="bg-white-bg3 text-white-bg text-center">
              <td>Caravana</td>
              <td>Tipo</td>
              <td>Fecha de ingreso</td>
              <td>Estado</td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {loader ? (
              <LoaderDatos textLoader="Cargando ganado" />
            ) : ganado && ganado.length ? (
              ganado.map((g) => (
                <tr key={g.id} className="bg-white-bg2">
                  <td className="px-1">{g.caravana}</td>
                  <td className="px-1">{g.tipo}</td>
                  <td className="px-1">{g.fecha_ingreso}</td>
                  <td className="px-1">{g.estado}</td>
                  <td className="hover:bg-button-green_hover bg-button-green text-white-bg text-2xl cursor-pointer w-8">
                    <MdEdit className="mx-auto" />
                  </td>
                  <td className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8">
                    <MdDelete className="mx-auto" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Aun no hay animales cargados
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {loader || cantidadPaginas <= 1 ? null : (
          <div className="pt-1 ">
            <Paginador
              cantidadPaginas={cantidadPaginas}
              paginaActual={paginaActual}
              setPagina={setPaginaActual}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TablaGanado;
