import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import BarraSeparadora from "../../../../common/BarraSeparadora";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";

const CrearLote = ({
  setCloseModal,
  setLotesName,
  lotesName,
  setLotes,
  lotes,
  setActual,
  lotesActuales,
}) => {
  const [nuevoLote, setNuevoLote] = useState({
    nombre_lote: "",
    conformado_por: "",
  });

  const [animales, setAnimales] = useState([]);

  useEffect(() => {
    axios(url + "tambo/ganado?limit=99999999999").then(({ data }) => {
      setAnimales(data.data);
    });
  }, []);

  const handleCreate = () => {
    if (!nuevoLote.nombre_lote || !nuevoLote.conformado_por) {
      return Swal.fire({
        title: "Complete los campos necesarios para crear el lote",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
      });
    }

    if (lotesActuales.includes(nuevoLote.nombre_lote)) {
      return Swal.fire({
        title: `Ya tienes un lote con el nombre ${nuevoLote.nombre_lote}`,
        text: "No puede haber lotes con el mismo nombre",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
      });
    }

    if (nuevoLote.conformado_por !== "SIN ESPECIFICAR") {
      const animalesFiltrados = animales.filter(
        (a) => a.tipo === nuevoLote.conformado_por.slice(0, -1)
      );

      const controlesArray = animalesFiltrados.map((af, index) => {
        return {
          id: index + 1,
          caravana: af.caravana,
          litros_ordeñe1: "",
          litros_ordeñe2: "",
          total: "",
          observacion: "",
        };
      });

      const dataLote = {
        nombre_lote: nuevoLote.nombre_lote,
        hora_inicio_ordeñe1: "",
        hora_fin_ordeñe1: "",
        hora_inicio_ordeñe2: "",
        hora_fin_ordeñe2: "",
        controlesArray: controlesArray,
      };

      setLotesName([...lotesName, nuevoLote.nombre_lote]);
      setLotes({ ...lotes, [nuevoLote.nombre_lote]: dataLote });
      setActual(dataLote.nombre_lote);
      setCloseModal(false);
    } else {
      const controlesArray = Array.from({ length: 250 }, (_, index) => ({
        id: index + 1,
        caravana: "",
        litros_ordeñe1: "",
        litros_ordeñe2: "",
        total: "",
        observacion: "",
      }));

      const dataLote = {
        nombre_lote: nuevoLote.nombre_lote,
        hora_inicio_ordeñe1: "",
        hora_fin_ordeñe1: "",
        hora_inicio_ordeñe2: "",
        hora_fin_ordeñe2: "",
        controlesArray: controlesArray,
      };

      setLotesName([...lotesName, nuevoLote.nombre_lote]);
      setLotes({ ...lotes, [nuevoLote.nombre_lote]: dataLote });
      setActual(dataLote.nombre_lote);
      setCloseModal(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[350px] sm:w-[500px]">
      <div className="w-full flex justify-between">
        <Titulo text="CREAR LOTE" />
      </div>

      <div className="w-full space-y-3">
        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Nombre de lote
          </label>
          <input
            onChange={(e) =>
              setNuevoLote({ ...nuevoLote, nombre_lote: e.target.value })
            }
            placeholder="LOTE 1 ..."
            type="text"
            value={nuevoLote.nombre_lote}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Lote conformado por
          </label>
          <select
            onChange={(e) =>
              setNuevoLote({ ...nuevoLote, conformado_por: e.target.value })
            }
            value={nuevoLote.conformado_por}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            <option value="VACAS">Vacas</option>
            <option value="VAQUILLONAS">Vaquillonas</option>
            <option value="SIN ESPECIFICAR">Sin especificar</option>
          </select>
        </div>

        <p className="text-white-bg3">
          <strong>Aclaración:</strong> si selecciona la opcion{" "}
          <strong>"Vacas"</strong> o <strong>"Vaquillonas"</strong> en la
          conformación del lote, se le proveera del listado completo de animales
          del tipo seleccionado. En cambio, si selecciona{" "}
          <strong>"Sin especificar"</strong>, debera cargar los animales
          manualmente.
        </p>

        <div className="w-full flex justify-between sm:justify-end space-x-3">
          <button onClick={() => setCloseModal(false)} className="boton_rojo">
            CANCELAR
          </button>
          <button onClick={handleCreate} className="boton_verde">
            AGREGAR LOTE
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearLote;
