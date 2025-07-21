import { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import Titulo from "../../../../common/Titulo";
import { Validation } from "../../../../common/Validation";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const NuevoCliente = ({ setShowModal, id_sector, fetchClientes, titulo }) => {
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre_empresa: "",
    contacto_1: "",
    localidad: "",
    cuit_cuil: "",
    saldo: 0,
    id_sector: id_sector,
  });
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const errorMsg = Validation(name, value);

    if (name === "cuit_cuil") {
      if (value.length > 11) return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    setNuevoCliente((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const { nombre_empresa, contacto_1, localidad, cuit_cuil, saldo } =
      nuevoCliente;

    const requiredFields = [
      "nombre_empresa",
      "contacto_1",
      "localidad",
      "cuit_cuil",
      "saldo",
    ];
    const newErrors = {};

    requiredFields.forEach((field) => {
      const value = nuevoCliente[field];
      const errorMsg = Validation(field, value);
      if (errorMsg) {
        newErrors[field] = errorMsg;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors({});

      Swal.fire({
        title: "Campos inválidos",
        text: "Por favor, revisá los errores antes de continuar.",
        icon: "warning",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
      });
      return;
    }

    // Validar campos vacíos
    if (
      !nombre_empresa ||
      !contacto_1 ||
      !localidad ||
      !cuit_cuil ||
      saldo === ""
    ) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Por favor completá todos los campos.",
        icon: "warning",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
      });
      return;
    }

    // Validar que contacto_1 sea número
    if (isNaN(contacto_1)) {
      Swal.fire({
        title: "Contacto inválido",
        text: "El número de contacto debe ser numérico.",
        icon: "warning",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
      });
      return;
    }

    // Validar CUIT/CUIL (simple: que sea numérico y tenga al menos 11 dígitos)
    if (isNaN(cuit_cuil) || cuit_cuil.length < 8 || cuit_cuil.length > 11) {
      Swal.fire({
        title: "CUIT/CUIL inválido",
        text: "Debe contener entre 8 y 11 dígitos numéricos.",
        icon: "warning",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
      });
      return;
    }

    // Validar saldo como número
    const saldoNumero = parseFloat(saldo);
    if (isNaN(saldoNumero)) {
      Swal.fire({
        title: "Saldo inválido",
        text: "El saldo debe ser un número.",
        icon: "warning",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
      });
      return;
    }

    setLoader(true);
    try {
      const clienteAEnviar = { ...nuevoCliente, saldo: saldoNumero };
      await axios.post(`${url}cliente`, clienteAEnviar);
      Swal.fire({
        title: "¡Cliente agregado con éxito!",
        confirmButtonText: "Aceptar",
        icon: "success",
        confirmButtonColor: "#86C394",
      }).then(() => {
        setShowModal(false);
        fetchClientes(id_sector);
      });
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      Swal.fire({
        title: "Error al agregar cliente",
        text: error.message,
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
      });
    } finally {
      setLoader(false);
    }
  };

  const handleKeyDownEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Evita el comportamiento predeterminado
      handleSave();
    }
  };

  return (
    <div className="flex flex-col space-y-4 items-start sm:w-[450px] max-h-[80dvh] scrollbar overflow-y-auto overflow-x-hidden">
      <Titulo text={titulo ? `NUEVO ${titulo}` : "NUEVO CLIENTE"} />
      <div
        className="text-xl flex flex-col space-y-3 mx-auto"
        onKeyDown={handleKeyDownEnter}
      >
        <div className="containerInput">
          <label className="labelInput">
            Nombre / Empresa<strong className="text-red-400">*</strong>
          </label>
          <Tippy
            content={errors.nombre_empresa || ""}
            visible={!!errors.nombre_empresa}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              onChange={handleInputChange}
              type="text"
              placeholder="Nombre / Empresa"
              name="nombre_empresa"
              value={nuevoCliente.nombre_empresa}
              className={`input ${
                errors.nombre_empresa ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Tippy>
        </div>

        <div className="containerInput">
          <label className="labelInput">Contacto<strong className="text-red-400">*</strong></label>
          <Tippy
            content={errors.contacto_1 || ""}
            visible={!!errors.contacto_1}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              onChange={handleInputChange}
              type="number"
              placeholder="+55 9 45000000"
              name="contacto_1"
              onKeyDown={(e) => {
                if (e.key === "e" || e.key === "E" || e.key === "-") {
                  e.preventDefault();
                }
              }}
              value={nuevoCliente.contacto_1}
              className={`input ${
                errors.contacto_1 ? "border-red-500" : "border-gray-300"
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
            arrow={true}
            theme="custom"
          >
            <input
              onChange={handleInputChange}
              type="text"
              placeholder="Calchín, Córdoba"
              name="localidad"
              value={nuevoCliente.localidad}
              className={`input ${
                errors.localidad ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Tippy>
        </div>

        <div className="containerInput">
          <label className="labelInput">CUIT/CUIL<strong className="text-red-400">*</strong></label>
          <Tippy
            content={errors.cuit_cuil || ""}
            visible={!!errors.cuit_cuil}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              onChange={handleInputChange}
              type="number"
              placeholder="20-12345678-9"
              name="cuit_cuil"
              onKeyDown={(e) => {
                if (
                  e.key === "e" ||
                  e.key === "E" ||
                  e.key === "+" ||
                  e.key === "-"
                ) {
                  e.preventDefault();
                }
              }}
              value={nuevoCliente.cuit_cuil}
              className={`input ${
                errors.cuit_cuil ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Tippy>
        </div>

        <div className="containerInput">
          <label className="labelInput">Saldo<strong className="text-red-400">*</strong></label>
          <div className="bg-white-bg2 text-black-comun text-xl pl-3 flex items-center space-x-2 w-full">
            <p className="font-bold text-white-bg3">$</p>
            <input
              onChange={handleInputChange}
              type="number"
              name="saldo"
              value={nuevoCliente.saldo || ""}
              onKeyDown={(e) => {
                if (
                  e.key === "e" ||
                  e.key === "E" ||
                  e.key === "+" ||
                  e.key === "-"
                ) {
                  e.preventDefault();
                }
              }}
              placeholder="1000"
              className="input"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-5">
          <button className="boton_rojo" onClick={() => setShowModal(false)}>
            CANCELAR
          </button>
          <button onClick={handleSave} className="boton_verde">
            {loader ? (
              <BiLoaderAlt className="animate-spin text-black-comun text-center grow" />
            ) : (
              "AGREGAR"
            )}
          </button>
        </div>
        <p className="text-white-bg3 w-full">
        - Los campos marcados con<strong className="text-red-400">*</strong> son
        obligatorios.
      </p>
      </div>
    </div>
  );
};

export default NuevoCliente;
