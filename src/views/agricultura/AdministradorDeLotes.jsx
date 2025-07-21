import Titulo from "../../common/Titulo";
import Modal from "../../common/Modal";
import { useEffect, useState } from "react";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import { Link } from "react-router-dom";
import axios from "axios";
import NuevoLote from "./components/AdministradorDeLotes/NuevoLote";
import { useNavigate } from "react-router-dom";
import { url } from "../../common/URL_SERVER";
import LoaderDatos from "../../common/LoaderDatos";

const AdministradorDeLotes = () => {
  const [lotes, setLotes] = useState([]);
  const [arrayNombreLotes, setArrayNombreLotes] = useState([]);
  const [loader, setLoader] = useState(true);

  const getDatos = () => {
    setLoader(true);
    axios(url + "agricultura/").then(({ data }) => {
      setLoader(false);
      const formatData = [];
      data.map((d) => {
        formatData.push({ ...d, EstadoSiembras: d.EstadoSiembras.reverse() });
      });

      setLotes(formatData);

      // extraigo los nombres en minusculas
      const arrayNombres = [];
      data.map((d) => {
        arrayNombres.push(d.nombre.toLowerCase());
      });
      setArrayNombreLotes(arrayNombres);
    });
  };

  const handleNuevoLoteSuccess = () => {
    getDatos(); // Vuelve a cargar los datos
  };

  useEffect(() => {
    getDatos();
  }, []);

  const [addNew, setAddNew] = useState(false);
  const nav = useNavigate();
  return (
    <ContenedorGeneral navText="AGRICULTURA">
      <div className="w-screen md:w-full hidden sm:flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="AGRICULTURA | ADMINISTRADOR DE LOTES" />
        <Link to="/agricultura" className="boton_rojo">
          VOLVER
        </Link>
      </div>
      <div className="w-screen md:w-full sm:hidden flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="ADMINISTRADOR DE LOTES" />
        <Link to="/agricultura" className="boton_rojo">
          VOLVER
        </Link>
      </div>

      {loader ? (
        <LoaderDatos textLoader="Cargando lotes" />
      ) : (
        <div className="h-[100%] w-full scrollbar overflow-auto pr-4 md:p-2 md:w-auto bg-white-bg2 space-y-5 p-2">
          <div className="w-full scrollbar overflow-auto">
            <div className="h-full max-h-[400px] min-w-[648px]">
              <table className="border-separate text-lg w-full relative">
                <thead className="sticky top-0 bg-white-bg3 z-10">
                  <tr className="bg-white-bg3 text-center">
                    <td>Lote</td>
                    <td>Hectareas</td>
                    <td>Ubicación</td>
                    <td>Propiedad</td> {/* ALQUILADO / PROPIO */}
                    <td>Estado</td>{" "}
                    {/* SEMBRADO / COSEÑADO / FUMIGADO / PASTURA */}
                  </tr>
                </thead>
                <tbody>
                  {lotes.length ? (
                    lotes.map((l) => (
                      <tr
                        onClick={() => nav(`/agricultura/lotes/${l.id}`)}
                        className="bg-white-bg hover:bg-white-bg_hover cursor-pointer"
                      >
                        <td className="px-1">{l.nombre}</td>
                        <td className="px-1">{l.hectareas}</td>
                        <td className="px-1">{l.ubicacion}</td>
                        <td className="px-1">{l.propiedad}</td>
                        <td className="px-1">
                          {l.EstadoSiembras && l.EstadoSiembras.length > 0
                            ? l.EstadoSiembras[0].estado
                            : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <td colSpan="7" className="text-center text-white-bg3">
                      No se encontraron lotes cargados
                    </td>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <div
        className={
          loader
            ? "hidden"
            : "w-full flex justify-between pr-4 md:pr-0 sm:hidden md:flex"
        }
      >
        <button onClick={() => setAddNew(true)} className="boton_verde">
          NUEVO LOTE
        </button>
      </div>

      {addNew ? (
        <Modal>
          <NuevoLote
            setCloseModal={setAddNew}
            arrayNombreLotes={arrayNombreLotes}
            onSuccess={handleNuevoLoteSuccess}
          />
        </Modal>
      ) : null}
    </ContenedorGeneral>
  );
};

export default AdministradorDeLotes;
