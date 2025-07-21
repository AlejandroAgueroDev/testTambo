import Titulo from "../../common/Titulo";
import { useEffect, useState } from "react";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import { Link } from "react-router-dom";
import BarraSeparadora from "../../common/BarraSeparadora";
import Swal from "sweetalert2";

const ControlProduccion = () => {
  const [controlesSinGuardar, setControlesSinGuardar] = useState([]);

  useEffect(() => {
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("controlproduccion")) {
        // Filtra claves que comiencen con "produccion"
        const value = JSON.parse(localStorage.getItem(key)); // Convierte el valor de JSON si es necesario
        items.push({ key, value }); // Agrega un objeto con clave y valor al array
      }
    }
    setControlesSinGuardar(items);
  }, []);

  const descartarControl = (key, fecha) => {
    Swal.fire({
      title: `¿Borrar los datos del control de produccion de la fecha: ${fecha}`,
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
      confirmButtonColor: "#86C394",
      denyButtonColor: "#D64747",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(key);

        Swal.fire({
          title: "¡Datos de control borrado!",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
          allowOutsideClick: false,
        }).then(() => window.location.reload());
      } else if (result.isDenied) {
        return;
      }
    });
  };

  return (
    <ContenedorGeneral navText="TAMBO">
      <div className="w-screen md:w-full hidden sm:flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="TAMBO | CONTROL DE PRODUCCION" />
        <Link to="/tambo" className="boton_rojo">
          VOLVER
        </Link>
      </div>
      <div className="w-screen md:w-full sm:hidden flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="CONTROL PRODUCCION" />
        <Link to="/tambo" className="boton_rojo">
          VOLVER
        </Link>
      </div>

      <div className="w-full sm:w-[600px] flex space-x-5 sm:bg-white-bg mx-auto sm:mt-10 py-10">
        <Link to={`/tambo/control-produccion/cargar/${null}`} className="links">
          CARGAR CONTROL DE PRODUCCION
        </Link>
        <Link
          to="/tambo/control-produccion/historial-control"
          className="links"
        >
          HISTORIAL DE CONTROL DE PRODUCCION
        </Link>
      </div>

      <BarraSeparadora orientacion={"horizontal"} />

      <div className="w-screen md:w-full flex flex-col items-start space-y-4 pt-2">
        <Titulo text="CONTROLES SIN TERMINAR" />
        <div className="flex w-[95vw] sm:w-[90vw] xl:w-[85vw] scrollbar overflow-x-auto space-x-5 pb-4">
          {controlesSinGuardar.length ? (
            controlesSinGuardar.map((cp) => (
              <div
                key={cp.key}
                className="bg-white-bg2 sombra2 w-40 p-2 flex flex-col space-y-4"
              >
                <div className="flex flex-col">
                  <p className="font-bold">Fecha modificacion:</p>
                  <p className="text-xl pb-2">{cp.value.fecha}</p>
                  <p className="font-bold">Cantidad de lotes:</p>
                  <p className="text-xl">{cp.value.cantidad_lotes}</p>
                </div>

                <div className="flex flex-col space-y-3">
                  <Link
                    to={`/tambo/control-produccion/cargar/${cp.key}`}
                    className="boton_verde"
                  >
                    CONTINUAR
                  </Link>
                  <button
                    onClick={() => descartarControl(cp.key, cp.value.fecha)}
                    className="boton_rojo"
                  >
                    DESCARTAR
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white-bg3 text-xl">
              No hay controles sin terminar.
            </p>
          )}
        </div>
      </div>
    </ContenedorGeneral>
  );
};

export default ControlProduccion;
