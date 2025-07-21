import Titulo from "../../../common/Titulo";
import { useState } from "react";
import axios from "axios";
import { url } from "../../../common/URL_SERVER";
import { BiLoaderAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import { Validation } from "../../../common/Validation";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const AñadirPropietario = ({ closeModal, fetchPropietarios }) => {
  const [loader, setLoader] = useState(false);
  const [nuevoPropietario, setNuevoPropietario] = useState({
    nombre: "",
    localidad: "",
    contacto_1: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorMsg = Validation(name, value);

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));

    setNuevoPropietario({
      ...nuevoPropietario,
      [name]: value,
    });
  };

  const handleNuevoPropietario = async () => {
    if (
      !nuevoPropietario.nombre ||
      !nuevoPropietario.localidad ||
      !nuevoPropietario.contacto_1
    ) {
      return Swal.fire({
        title: "No puedes dejar campos vacios",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

    setLoader(true);

    try {
      const { data } = await axios.post(
        `${url}casa/propietario`,
        nuevoPropietario
      );
      console.log("Nuevo propietario agregado:", data);
      Swal.fire({
        title: "Propietario agregado exitosamente",
        confirmButtonText: "Aceptar",
        icon: "success",
        confirmButtonColor: "#86C394",
      }).then((result) => {
        if (result.isConfirmed) {
          fetchPropietarios();
          closeModal();
        }
      });
    } catch (error) {
      console.log("Error al agregar un nuevo propietario:", error);
      Swal.fire({
        title: "Error al añadir propietario",
        text: error.response?.data?.message || "Error desconocido",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[380px] sm:w-[560px]">
      <div className="w-full flex justify-between">
        <Titulo text="AÑADIR PROPIETARIO" />
      </div>
      <div className="w-full space-y-3">
        <div className="containerInput">
          <label className="labelInput">Nombre<strong className="text-red-400">*</strong></label>
          <Tippy
            content={errors.nombre || ""}
            visible={!!errors.nombre}
            placement="top-end"
            arrow
            theme="custom"
          >
            <input
              placeholder="Nombre del propietario"
              type="text"
              name="nombre"
              onChange={handleChange}
              className={`input ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Tippy>
        </div>

        <div className="containerInput">
          <label className="labelInput">Localidad<strong className="text-red-400">*</strong></label>
          <Tippy
            content={errors.localidad || ""}
            visible={!!errors.localidad}
            placement="top-end"
            arrow
            theme="custom"
          >
            <input
              placeholder="Calchin, Cordoba"
              type="text"
              name="localidad"
              className={`input ${
                errors.localidad ? "border-red-500" : "border-gray-300"
              }`}
              onChange={handleChange}
            />
          </Tippy>
        </div>

        <div className="containerInput">
          <label className="labelInput">Teléfono<strong className="text-red-400">*</strong></label>
          <Tippy
            content={errors.contacto_1 || ""}
            visible={!!errors.contacto_1}
            placement="top-end"
            arrow
            theme="custom"
          >
            <input
              placeholder="3573-125634"
              type="number"
              name="contacto_1"
              onKeyDown={(e) =>
                ["e", "E", "-"].includes(e.key) && e.preventDefault()
              }
              className={`input ${
                errors.contacto_1 ? "border-red-500" : "border-gray-300"
              }`}
              onChange={handleChange}
            />
          </Tippy>
        </div>

        <div className="flex justify-end space-x-3 pt-5">
          <button className="boton_rojo" onClick={closeModal}>
            CANCELAR
          </button>
          <button
            className="boton_verde"
            onClick={handleNuevoPropietario}
            disabled={loader}
          >
            {loader ? (
              <BiLoaderAlt className="animate-spin text-black-comun" />
            ) : (
              "AGREGAR"
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

export default AñadirPropietario;
