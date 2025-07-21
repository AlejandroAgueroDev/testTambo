import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import BarraSeparadora from "../../../../common/BarraSeparadora";
import axios from "axios";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import { useNavigate } from "react-router-dom";
import { url } from "../../../../common/URL_SERVER";

const GenerarInforme = ({ setCloseModal, lotesArray, claveLocalStorage }) => {
  const nav = useNavigate();
  const [datos, setDatos] = useState("");
  const [loader, setLoader] = useState(false);
  const [datosExtras, setDatosExtras] = useState({
    litros_medidos: 0,
    cantidad_vacas_enOrdeñe: 0,
    promedio_tambo: 0,
    datos_por_lote: [],
  });

  const [litrosTanque, setLitrosTanque] = useState([]);

  const fetchLitros = async () => {
    try {
      const { data } = await axios.get(
        `${url}tambo/produccionleche/equipofrio`
      );
      const tanqueTambo = data.find((item) => item.nombre === "Tambo");
      if (tanqueTambo) {
        setLitrosTanque(tanqueTambo.litros);
      }
    } catch (error) {
      console.log("Error al traer los datos:", error);
    }
  };

  useEffect(() => {
    fetchLitros();
  }, []);
  useEffect(() => {
    let litrosMedidos = 0;
    let cantidadVacasEnOrdeñe = 0;
    const datosPorLote = [];

    lotesArray.map((l) => {
      //!cantidad de animales total
      cantidadVacasEnOrdeñe += l.controlesArray.length;

      //! cantidad de animales y litros por lote
      const cantidadPorLote = l.controlesArray.length;
      let litrosPorLote = 0;
      l.controlesArray.map((c) => {
        litrosMedidos += c.total;
        litrosPorLote += c.total;
      });

      datosPorLote.push({
        cantidad_animales_lote: cantidadPorLote,
        litros_por_lote: litrosPorLote,
        promedio_lote: litrosPorLote / cantidadPorLote,
        nombre_lote: l.nombre_lote,
      });
    });

    setDatosExtras({
      litros_medidos: litrosMedidos,
      cantidad_vacas_enOrdeñe: cantidadVacasEnOrdeñe,
      promedio_tambo: litrosMedidos / cantidadVacasEnOrdeñe,
      datos_por_lote: datosPorLote,
    });
  }, []);

  const handleCreateInforme = () => {
    if (!litrosTanque) {
      return Swal.fire({
        title: "Indica los litros en el tanque para generar el informe",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
      });
    }

    const dataBody = {
      litros_tanque: litrosTanque,
      hora_carga: obtenerFechaActual("hora"),
      fecha: obtenerFechaActual("fecha"),
      lotesArray: lotesArray,
    };

    setLoader(true);
    axios
      .post(url + "tambo/control", dataBody)
      .then((res) => {
        setLoader(false);
        Swal.fire({
          title: "Informe de control lechero cargado con éxito",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
          allowOutsideClick: false,
        }).then(() => {
          localStorage.removeItem(claveLocalStorage);
          nav("/tambo/control-produccion");
        });
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
        Swal.fire({
          title: "Ocurrio un error inesperado, intente nuevamente",
          text:
            error.message === "Network Error"
              ? "Contacte con el servicio técnico"
              : error,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#D64747",
          allowOutsideClick: false,
          icon: "error",
        });
      });
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[95vw] sm:w-[500px]">
      <div className="w-full flex justify-between">
        <Titulo text="GENERANDO INFORME" />
      </div>

      <div className="w-full space-y-2 max-h-[70dvh] scrollbar overflow-auto">
        <div className="flex space-x-3 items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Litros en tanque <strong className="text-red-400">*</strong>
          </label>
          <input
            onChange={(e) => setDatos(e.target.value)}
            placeholder="0000"
            type="number"
            value={litrosTanque}
            className="bg-white-bg2 text-black-comun py-1 px-5 text-xl grow"
          />
        </div>

        <div className="flex space-x-3 items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Litros medidos
          </label>
          <p className="bg-white-bg2 text-black-comun py-1 px-5 text-xl grow">
            {datosExtras.litros_medidos}
          </p>
        </div>

        <div className="flex space-x-3 items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Cantidad de vacas en ordeñe
          </label>
          <p className="bg-white-bg2 text-black-comun py-1 px-5 text-xl grow">
            {datosExtras.cantidad_vacas_enOrdeñe}
          </p>
        </div>

        <div className="flex space-x-3 items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Promedio tambo
          </label>
          <p className="bg-white-bg2 text-black-comun py-1 px-5 text-xl grow">
            {datosExtras.promedio_tambo.toFixed(2)}
          </p>
        </div>

        {datosExtras.datos_por_lote.map((dpl) => (
          <div className="flex space-x-3 items-center w-full">
            <label className="text-xl font-semibold text-white-bg3">
              Litros lote: {dpl.nombre_lote}
            </label>
            <p className="bg-white-bg2 text-black-comun py-1 px-5 text-xl grow">
              {dpl.litros_por_lote.toFixed(2)}
            </p>
          </div>
        ))}

        {datosExtras.datos_por_lote.map((dpl) => (
          <div className="flex space-x-3 items-center w-full">
            <label className="text-xl font-semibold text-white-bg3">
              Vacas lote: {dpl.nombre_lote}
            </label>
            <p className="bg-white-bg2 text-black-comun py-1 px-5 text-xl grow">
              {dpl.cantidad_animales_lote}
            </p>
          </div>
        ))}

        {datosExtras.datos_por_lote.map((dpl) => (
          <div className="flex space-x-3 items-center w-full">
            <label className="text-xl font-semibold text-white-bg3">
              Promedio lote: {dpl.nombre_lote}
            </label>
            <p className="bg-white-bg2 text-black-comun py-1 px-5 text-xl grow">
              {dpl.promedio_lote.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end space-x-3">
        <button onClick={() => setCloseModal(false)} className="boton_rojo">
          CANCELAR
        </button>
        <button onClick={handleCreateInforme} className="boton_verde">
          {loader ? (
            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
          ) : (
            "FINALIZAR INFORME"
          )}
        </button>
      </div>
    </div>
  );
};

export default GenerarInforme;
