import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";

const NuevoLote = ({ setCloseModal, arrayNombreLotes, onSuccess }) => {
  const [loader, setLoader] = useState(false);
  const [formLote, setFormLote] = useState({
    nombre: "",
    hectareas: 0,
    ubicacion: "",
    propiedad: "",
    estado: "",
    fecha: new Date().toISOString(),
  });
  const [errorNombre, setErrorNombre] = useState("");

  const handleForm = (e) => {
    const { name, value } = e.target;

    if (name === "nombre") {
      if (arrayNombreLotes.includes(value.toLowerCase())) {
        setErrorNombre("Ya existe un lote con este nombre!");
      } else {
        setErrorNombre("");
      }
    }

    if (name === "hectareas" && value === "0") return;

    setFormLote({ ...formLote, [name]: value });
  };

  const handleCarga = () => {
    if (
      !formLote.nombre ||
      !formLote.hectareas ||
      !formLote.ubicacion ||
      !formLote.propiedad
    ) {
      return Swal.fire({
        title: "Complete los campos necesarios para cargar el lote",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        iconColor: "#D64747",
        icon: "warning",
      });
    }

    if (errorNombre) {
      return Swal.fire({
        title: errorNombre,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        iconColor: "#D64747",
        icon: "error",
      });
    }

    setLoader(true);
    axios
      .post(url + "agricultura", formLote)
      .then((res) => {
        setLoader(false);
        Swal.fire({
          title: "¡Nuevo lote cargado con exito!",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
          iconColor: "#86C394",
        }).then(() => {
          setCloseModal(false);
          if (onSuccess) onSuccess();
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
          iconColor: "#D64747",
          icon: "error",
        });
      });
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[380px] sm:w-[550px]">
      <div className="w-full flex justify-between">
        <Titulo text="NUEVO LOTE" />
      </div>

      <div className="w-full space-y-3">
        <div className="containerInput">
          <label className="labelInput">Lote<strong className="text-red-400">*</strong></label>
          <input
            placeholder="Identificador de lote"
            type="text"
            onChange={handleForm}
            name="nombre"
            value={formLote.nombre}
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">Hectareas<strong className="text-red-400">*</strong></label>
          <input
            placeholder="100"
            type="number"
            onChange={handleForm}
            name="hectareas"
            value={formLote.hectareas ? formLote.hectareas : ""}
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">Ubicación<strong className="text-red-400">*</strong></label>
          <input
            onChange={handleForm}
            name="ubicacion"
            value={formLote.ubicacion}
            placeholder="Ubicación del lote"
            type="text"
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">Propietario<strong className="text-red-400">*</strong></label>
          <input
            onChange={handleForm}
            name="propiedad"
            value={formLote.propiedad}
            placeholder="Nombre del propietario"
            type="text"
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">Estado<strong className="text-red-400">*</strong></label>
          <input
            onChange={handleForm}
            name="estado"
            value={formLote.estado}
            placeholder="Sembrado / Fumigado / ..."
            type="text"
            className="input"
          />
        </div>

        <div className="w-full flex justify-end space-x-3">
          <button onClick={() => setCloseModal(false)} className="boton_rojo">
            CANCELAR
          </button>
          <button onClick={handleCarga} className="boton_verde">
            {loader ? (
              <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
            ) : (
              "CARGAR"
            )}
          </button>
        </div>
        <p className="text-white-bg3 w-full">
          - Los campos marcados con<strong className="text-red-400">*</strong>{" "}
          son obligatorios.
        </p>
      </div>
    </div>
  );
};

export default NuevoLote;
