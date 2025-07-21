import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";

const EditarLote = ({ setCloseModal, arrayNombreLotes, data }) => {
  const [loader, setLoader] = useState(false);
  const [formLote, setFormLote] = useState(data);
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

    if (
      data.nombre === formLote.nombre &&
      data.hectareas === formLote.hectareas &&
      data.ubicacion === formLote.ubicacion &&
      data.propiedad === formLote.propiedad
    ) {
      return setCloseModal(false);
    }

        setLoader(true);
        axios
            .put(url + "agricultura", formLote)
            .then((res) => {
                setLoader(false);
                console.log(res);
                Swal.fire({
                    title: "¡Lote editado con exito!",
                    confirmButtonText: "Aceptar",
                    icon: "success",
                    confirmButtonColor: "#86C394",
                    iconColor: "#86C394",
                }).then(() => window.location.reload());
            })
            .catch((error) => {
                setLoader(false);
                console.log(error);
                Swal.fire({
                    title: "Ocurrio un error inesperado, intente nuevamente",
                    text: error.message === "Network Error" ? "Contacte con el servicio técnico" : error,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#D64747",
                    iconColor: "#D64747",
                    icon: "error",
                });
            });
    };


  return (
    <div className="flex flex-col space-y-2 items-start">
      <div className="w-full flex justify-between">
        <Titulo text="EDITAR DATOS DEL LOTE" />
      </div>

      <div className="w-full space-y-3">
        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">Lote</label>
          <input
            placeholder="Identificador de lote"
            type="text"
            onChange={handleForm}
            name="nombre"
            value={formLote.nombre}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Hectareas
          </label>
          <input
            placeholder="100"
            type="number"
            onChange={handleForm}
            name="hectareas"
            value={formLote.hectareas ? formLote.hectareas : ""}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Ubicación
          </label>
          <input
            onChange={handleForm}
            name="ubicacion"
            value={formLote.ubicacion}
            placeholder="Ubicación del lote"
            type="text"
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Propietario
          </label>
          <input
            onChange={handleForm}
            name="propiedad"
            value={formLote.propiedad}
            placeholder="Nombre del propietario"
            type="text"
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
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
              "EDITAR"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarLote;
