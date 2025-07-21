import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import axios from "axios";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
//?COMPONENTS
import Titulo from "../../../common/Titulo";
import { url } from "../../../common/URL_SERVER";
import { Validation } from "../../../common/Validation";

const AñadirEmpleado = ({ setCloseModal, token, getEmpleados }) => {
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  //? DESPAZAMIENTO CON LA FLECHA
  const inputRefs = Array.from({ length: 9 }, () => useRef(null));

  const handleKeyDown = (e, nextRef, prevRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      return;
    }

    if (e.key === "ArrowDown" && nextRef) {
      e.preventDefault();
      nextRef.current.focus();
    } else if (e.key === "ArrowUp" && prevRef) {
      e.preventDefault();
      prevRef.current.focus();
    }
  };

  //?-------------------------------
  const [newEmpleado, setNewEmpleado] = useState({
    nombre: "",
    contacto: "",
    dni: "",
    saldo: "",
    cuit_cuil: "",
    sector: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorMsg = Validation(name, value);

    if (name === "cuit_cuil") {
      if (value.length > 11) return;
    }

    if (name === "dni") {
      if (value.length > 9) return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    setNewEmpleado({ ...newEmpleado, [name]: value });
  };

  const crearUsuarioParaEmpleado = async (empleadoId) => {
    try {
      const { data } = await axios.post(
        `${url}empleado/usuario?id_empleado=${empleadoId}`
      );

      // Mostrar los datos del usuario creado
      Swal.fire({
        title: "Usuario creado exitosamente",
        html: `
          <div class="text-left">
            <p><strong>Email:</strong> ${data.datosUsuario.email}</p>
            <p><strong>Contraseña:</strong> ${data.datosUsuario.pass}</p>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#86C394",
      });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      Swal.fire({
        title: "Error al crear usuario",
        text: error.response?.data?.message || "Error desconocido",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    }
  };

  const handleNewEmpleado = async (e) => {
    e.preventDefault();

    const requiredFields = ["nombre", "dni", "saldo", "sector"];
    const newErrors = {};

    requiredFields.forEach((field) => {
      const value = newEmpleado[field];
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
    if (!newEmpleado.nombre || !newEmpleado.dni || !newEmpleado.sector) {
      setErrors({});

      return Swal.fire({
        title: "No puedes dejar campos vacios",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

    setLoader(true);

    //? LOGICA DE ENVIO
    try {
      const { data: empleadoCreado } = await axios.post(
        `${url}empleado`,
        newEmpleado,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //Limpiar formulario después del envío exitoso
      setNewEmpleado({
        nombre: "",
        contacto: "",
        dni: "",
        saldo: "",
        cuit_cuil: "",
        sector: "",
      });

      // Preguntar si se desea crear un usuario
      const { isConfirmed } = await Swal.fire({
        title: "Empleado agregado exitosamente",
        text: "¿Desea crear un usuario para este empleado?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Sí, crear usuario",
        cancelButtonText: "No, gracias",
        confirmButtonColor: "#86C394",
        cancelButtonColor: "#D64747",
      });

      if (isConfirmed) {
        await crearUsuarioParaEmpleado(empleadoCreado.newEmpelado.id);
      }

      // Cerrar el modal y actualizar la lista de empleados
      setCloseModal(false);
      getEmpleados();
    } catch (error) {
      console.error("Error al añadir empleado:", error);
      setErrors({});
      Swal.fire({
        title: "Error al añadir empleado",
        text: error.response?.data?.message || "Error desconocido",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[350px] md:w-[480px]">
      <div className="w-full flex justify-between">
        <Titulo text="AÑADIR EMPLEADO" />
      </div>
      <form
        onSubmit={handleNewEmpleado}
        className="w-full max-h-[60dvh] sm:max-h-[70dvh] overflow-y-auto overflow-x-hidden space-y-3 scrollbar sm:h-full"
      >
        <div className="w-full space-y-3">
          <div className="containerInput">
            <label htmlFor="nombre" className="labelInput">
              Nombre<strong className="text-red-400">*</strong>
            </label>
            <Tippy
              content={errors.nombre || ""}
              visible={!!errors.nombre}
              placement="top-end"
              arrow={true}
              theme="custom"
            >
              <input
                id="nombre"
                placeholder="Nombre del nuevo empleado"
                ref={inputRefs[0]}
                onKeyDown={(e) => handleKeyDown(e, inputRefs[1], null)}
                onChange={handleChange}
                type="text"
                name="nombre"
                className={`input ${
                  errors.nombre ? "border-red-500" : "border-gray-300"
                }`}
              />
            </Tippy>
          </div>

          <div className="containerInput">
            <label htmlFor="contacto" className="labelInput">
              Contacto
            </label>

            <input
              id="contacto"
              placeholder="+543865123456"
              ref={inputRefs[1]}
              onKeyDown={(e) => handleKeyDown(e, inputRefs[2], inputRefs[0])}
              onChange={handleChange}
              type="text"
              name="contacto"
              className="input"
            />
          </div>

          <div className="containerInput">
            <label htmlFor="dni" className="labelInput">
              DNI<strong className="text-red-400">*</strong>
            </label>
            <Tippy
              content={errors.dni || ""}
              visible={!!errors.dni}
              placement="top-end"
              arrow={true}
              theme="custom"
            >
              <input
                id="dni"
                placeholder="123456789"
                ref={inputRefs[2]}
                onChange={handleChange}
                type="number"
                name="dni"
                onKeyDown={(e) => {
                  if (
                    e.key === "e" ||
                    e.key === "E" ||
                    e.key === "+" ||
                    e.key === "-"
                  ) {
                    e.preventDefault();
                    return;
                  }
                  handleKeyDown(e, inputRefs[3], inputRefs[1]);
                }}
                value={newEmpleado.dni}
                className={`input ${
                  errors.dni ? "border-red-500" : "border-gray-300"
                }`}
              />
            </Tippy>
          </div>
          <div className="containerInput">
            <label htmlFor="saldo" className="labelInput">
              Saldo
            </label>

            <input
              id="saldo"
              placeholder="Ej: 1000"
              ref={inputRefs[3]}
              onKeyDown={(e) => {
                if (
                  e.key === "e" ||
                  e.key === "E" ||
                  e.key === "+" ||
                  e.key === "-"
                ) {
                  e.preventDefault();
                }
                handleKeyDown(e, inputRefs[4], inputRefs[2]);
              }}
              onChange={handleChange}
              type="number"
              name="saldo"
              value={newEmpleado.saldo}
              className="input"
            />
          </div>

          <div className="containerInput">
            <label htmlFor="cuit" className="labelInput">
              CUIT/CUIL
            </label>

            <input
              id="cuit"
              placeholder="23-123456789-12"
              ref={inputRefs[4]}
              onKeyDown={(e) => {
                if (
                  e.key === "e" ||
                  e.key === "E" ||
                  e.key === "+" ||
                  e.key === "-"
                ) {
                  e.preventDefault();
                }
                handleKeyDown(e, inputRefs[5], inputRefs[3]);
              }}
              onChange={handleChange}
              type="number"
              name="cuit_cuil"
              value={newEmpleado.cuit_cuil}
              className="input"
            />
          </div>

          <div className="containerInput">
            <label className="labelInput">
              Sector<strong className="text-red-400">*</strong>
            </label>
            <select
              ref={inputRefs[5]}
              onKeyDown={(e) => handleKeyDown(e, null, inputRefs[4])}
              name="sector"
              onChange={handleChange}
              className="input"
              value={newEmpleado.sector || ""}
            >
              <option value="" disabled>
                Seleccionar sector
              </option>
              <option value="ADMINISTRACION">ADMINISTRACION</option>
              <option value="AGRICULTURA">AGRICULTURA</option>
              <option value="FABRICA">FABRICA</option>
              <option value="RECRIA">RECRIA</option>
              <option value="TAMBO">TAMBO</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button className="boton_rojo" onClick={() => setCloseModal(false)}>
            CANCELAR
          </button>
          <button type="submit" className="boton_verde">
            {loader ? (
              <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
            ) : (
              "AÑADIR NUEVO EMPLEADO"
            )}
          </button>
        </div>
      </form>
      <p className="text-white-bg3 w-full">
        - Los campos marcados con<strong className="text-red-400">*</strong> son
        obligatorios.
      </p>
    </div>
  );
};

export default AñadirEmpleado;
