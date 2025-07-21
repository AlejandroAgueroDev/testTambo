import Titulo from "../../../../common/Titulo";
import Paginador from "../../../../common/Paginador";
import { FaNewspaper, FaMagnifyingGlass } from "react-icons/fa6";
import axios from "axios";
import { useState, useEffect } from "react";
import { url } from "../../../../common/URL_SERVER";
import LoaderDatos from "../../../../common/LoaderDatos";
import Modal from "../../../../common/Modal";

const HistorialDeInseminaciones = ({
  setCloseModal,
  title,
  placeHolder,
  showPaginate = false,
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [cantidadDePaginas, setCantidadDePaginas] = useState(0);
  const arrayHeader = [
    "Fecha",
    "Caravana",
    "Sexado",
    "Pajuela",
    "Inseminador",
    "Aclaraciones",
    "",
  ];
  const [arrayContent, setArrayContent] = useState([]);
  const [arrayContentOriginal, setArrayContentOriginal] = useState([]);
  const [loader, setLoader] = useState(true);
  const [showModalDoc, setShowModalDoc] = useState(false);
  const [urlDoc, setUrlDoc] = useState("");
  const [filtroCaravana, setFiltroCaravana] = useState("");

  const handleShowDoc = (urlDocument) => {
    setUrlDoc(urlDocument);
    setShowModalDoc(true);
  };

  // Función para filtrar por caravana
  const filtrarPorCaravana = (datos, filtro) => {
    if (!filtro.trim()) {
      return datos;
    }
    return datos.filter(item => 
      item[1].toString().toLowerCase().includes(filtro.toLowerCase())
    );
  };

  // Efecto para filtrar cuando cambie el filtro
  useEffect(() => {
    const datosFiltrados = filtrarPorCaravana(arrayContentOriginal, filtroCaravana);
    setArrayContent(datosFiltrados);
  }, [filtroCaravana, arrayContentOriginal]);

  useEffect(() => {
    setLoader(true);
    axios(
      url + "tambo/ganado/inseminacion" + `?page=${paginaActual}&limit=14`
    ).then(({ data }) => {      
      setLoader(false);
      setCantidadDePaginas(data.totalPages);
      setPaginaActual(data.currentPage);
      const ordeñes = data.data.map((ordeñe) => {
        const fecha = ordeñe.fecha.split("T")[0];
        const arrayFecha = fecha.split("-");
        const fechaFinal = `${arrayFecha[2]}/${arrayFecha[1]}/${arrayFecha[0]}`;
        return [
          fechaFinal,
          ordeñe.caravana,
          ordeñe.sexado,
          ordeñe.pajuela,
          ordeñe.inseminador,
          ordeñe.aclaracion,
          ordeñe.url_image,
        ];
      });
      setArrayContentOriginal(ordeñes);
      // Aplicar filtro actual a los nuevos datos
      const datosFiltrados = filtrarPorCaravana(ordeñes, filtroCaravana);
      setArrayContent(datosFiltrados);
    });
  }, [paginaActual]);

  return (
    <div className="flex flex-col space-y-2 items-start w-[95vw] md:w-[85vw]">
      <div className="w-full flex justify-between">
        <Titulo text={title} />
        <button onClick={() => setCloseModal(false)} className="boton_rojo">
          VOLVER
        </button>
      </div>
      
      {/* Campo de búsqueda */}
      <div className="w-full flex justify-center mb-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={filtroCaravana}
            onChange={(e) => setFiltroCaravana(e.target.value)}
            placeholder="Buscar por caravana..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
          />
          <FaMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {loader ? (
        <LoaderDatos textLoader="Cargando historial de inseminaciones" />
      ) : (
        <div className="w-full scrollbar overflow-auto">
          <div className="h-full max-h-[80dvh] min-w-[648px]">
            <table className="border-separate text-lg w-full relative">
              <thead className="sticky top-0 bg-white-bg3 z-10">
                <tr className="bg-white-bg3 text-center">
                  {arrayHeader.map((ah) => (
                    <td key={ah}>{ah}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {arrayContent.length ? (
                  arrayContent.map((ac, index) => (
                    <tr key={index} className="bg-white-bg2 text-center">
                      {ac.map((c, index) => (
                        <td
                          onClick={() =>
                            index === 6
                              ? c !== null
                                ? handleShowDoc(c)
                                : null
                              : null
                          }
                          className={
                            index !== 6
                              ? ""
                              : c !== null
                              ? "hover:bg-button-green_hover bg-button-green text-white-bg text-xl cursor-pointer  w-6 px-1"
                              : " bg-white-bg3 text-white-bg text-xl  w-6 px-1"
                          }
                          key={index}
                        >
                          {index === 6 ? <FaNewspaper /> : c}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-white-bg3 text-md text-center"
                    >
                      {filtroCaravana.trim() ? 
                        `No se encontraron resultados para "${filtroCaravana}"` : 
                        placeHolder
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {showPaginate ? (
            <div className="pt-1 w-full mx-auto">
              <Paginador
                cantidadPaginas={cantidadDePaginas}
                paginaActual={paginaActual}
                setPagina={setPaginaActual}
              />
            </div>
          ) : null}

          {showModalDoc ? (
            <Modal>
              <div className="w-full flex justify-between pb-2">
                <Titulo text="DOCUMENTO DE INSEMINACION" />
                <button
                  onClick={() => setShowModalDoc(false)}
                  className="boton_rojo"
                >
                  VOLVER
                </button>
              </div>
              <img
                src={urlDoc}
                alt="Imagen cargada en liquidación"
                className="w-[450px] lg:w-[450px] aspect-[16/16] object-cover scrollbar overflow-auto"
              />
            </Modal>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default HistorialDeInseminaciones;