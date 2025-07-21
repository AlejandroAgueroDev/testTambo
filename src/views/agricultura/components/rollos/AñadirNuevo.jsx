import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
//? COMPONENTS
import { url } from "../../../../common/URL_SERVER";
import Titulo from "../../../../common/Titulo";
import { Validation } from "../../../../common/Validation";

const AgregarNuevo = ({
  setCloseModal,
  arrayNombreRollos,
  setContadores,
  setMovimientos,
  setArrayTipos,
}) => {
  const [loader, setLoader] = useState(false);
  const [formLote, setFormLote] = useState({
    tipo: "",
    cantidad: "",
    precio: "",
    archivo: "",
  });
  const [errorNombre, setErrorNombre] = useState("");
  const [errors, setErrors] = useState({});

  const handleSelectFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        setFormLote((prev) => ({ ...prev, archivo: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleForm = (e) => {
    const { name, value } = e.target;

    // Validaciones generales
    const errorMsg = Validation(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));

    // Si escriben 0 en cantidad o precio, no actualizar
    if (
      (name === "cantidad" || name === "precio") &&
      (value === "0" || value === 0)
    ) {
      return;
    }

    // Validar duplicado en 'tipo'
    if (name === "tipo") {
      if (arrayNombreRollos.includes(value.toUpperCase())) {
        setErrorNombre("¡Ya existe un tipo de rollo con este nombre!");
      } else {
        setErrorNombre("");
      }
    }

    setFormLote((prev) => ({
      ...prev,
      [name]:
        name === "tipo"
          ? value.toUpperCase()
          : name === "cantidad" || name === "precio"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleCarga = () => {
    if (!formLote.tipo || !formLote.cantidad) {
      setErrors({});
      return Swal.fire({
        title: "Complete los campos necesarios para cargar el lote",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        iconColor: "#D64747",
        icon: "warning",
      });
    }

    if (errorNombre) {
      setErrors({});
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
      .post(url + "agricultura/rollo", formLote)
      .then(() => {
        setLoader(false);
        Swal.fire({
          title: "¡Nuevo tipo de rollo cargado con éxito!",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
          iconColor: "#86C394",
        }).then(() => {
          Promise.all([
            axios(url + "agricultura/rollo"),
            axios(url + "agricultura/movimiento-rollo"),
          ]).then(([{ data: rollos }, { data: movimientos }]) => {
            setContadores(rollos);
            const arrayTiposNombre = rollos.map((d) => d.tipo);
            setArrayTipos(arrayTiposNombre);

            const dataFormat = movimientos.map((d) => ({
              ...d,
              fechaFormt: d.fecha.split("T")[0].split("-").reverse().join("/"),
            }));
            setMovimientos(dataFormat.reverse());
            setCloseModal(false);
          });
        });
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
        setErrors({});
        Swal.fire({
          title: "Ocurrió un error inesperado, intente nuevamente",
          text:
            error.message === "Network Error"
              ? "Contacte con el servicio técnico"
              : error.message || "Error desconocido",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#D64747",
          iconColor: "#D64747",
          icon: "error",
        });
      });
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[380px] sm:w-[560px]">
      <div className="w-full flex justify-between">
        <Titulo text="NUEVO TIPO DE ROLLO" />
      </div>

      <div className="w-full space-y-3">
        {/* Tipo */}
        <div className="containerInput">
          <label className="labelInput">
            Tipo<strong className="text-red-400">*</strong>
          </label>
          <Tippy
            content={errors.tipo || ""}
            visible={!!errors.tipo}
            placement="top-end"
            arrow
            theme="custom"
          >
            <input
              type="text"
              name="tipo"
              value={formLote.tipo}
              onChange={handleForm}
              placeholder="Ingrese tipo del rollo"
              className={`input ${
                errors.tipo ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Tippy>
        </div>

        {/* Cantidad */}
        <div className="containerInput">
          <label className="labelInput">
            Peso<strong className="text-red-400">*</strong>
          </label>
          <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow w-full">
            <p className="text-xl text-white-bg3">KG</p>
            <Tippy
              content={errors.cantidad || ""}
              visible={!!errors.cantidad}
              placement="top-end"
              arrow
              theme="custom"
            >
              <input
                type="number"
                name="cantidad"
                value={formLote.cantidad}
                onChange={handleForm}
                placeholder="Ej: 500"
                className={`input ${
                  errors.cantidad ? "border-red-500" : "border-gray-300"
                }`}
              />
            </Tippy>
          </div>
        </div>

        {/* Precio */}
        <div className="containerInput">
          <label className="labelInput">
            Precio por kilogramo<strong className="text-red-400">*</strong>
          </label>
          <Tippy
            content={errors.precio || ""}
            visible={!!errors.precio}
            placement="top-end"
            arrow
            theme="custom"
          >
            <div className="w-full flex bg-white-bg2 items-center">
              <p className="text-2xl px-3 text-white-bg3">$</p>
              <input
                type="number"
                name="precio"
                value={formLote.precio}
                onChange={handleForm}
                placeholder="Ej: 1000"
                onKeyDown={(e) =>
                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                }
                className={`input ${
                  errors.precio ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
          </Tippy>
        </div>

        {/* Archivo */}
        <div className="containerInput">
          <label className="labelInput">Adjuntar documento (solo imagen)</label>
          <input type="file" onChange={handleSelectFile} className="input" />
        </div>

        {/* Botones */}
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

export default AgregarNuevo;
