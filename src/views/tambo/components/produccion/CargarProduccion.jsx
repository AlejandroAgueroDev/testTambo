import { useEffect } from "react";
import { useState, useRef } from "react";
import axios from "axios";
import { BiLoaderAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import { url } from "../../../../common/URL_SERVER";

const CargarProduccion = ({ produccionCargada }) => {
  const [formProduccion, setFormProduccion] = useState({
    litros: 0,
    fecha: "",
    hora_recoleccion: "",
    hora_carga: "",
    id_empleado: "test",
    cantidad_animales: 0,
    aclaracion: "",
    estado: "ACTIVO",
  });
  const [loader, setLoader] = useState(false);

  const handleChangeForm = (e) => {
    const { name, value } = e.target;

    if((["litros", "cantidad_animales"].includes(name)) && value === "0")return

    setFormProduccion({ ...formProduccion, [name]: value });
  };

  //? OBTENER FECHA ACTUAL
  function obtenerFechaActual(tipo) {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, "0"); // Asegura 2 dígitos
    const mes = String(hoy.getMonth() + 1).padStart(2, "0"); // Mes empieza en 0
    const anio = hoy.getFullYear();
    const hora = String(hoy.getHours()).padStart(2, "0");
    const min = String(hoy.getMinutes()).padStart(2, "0");

    if (tipo === "fecha") {
      return `${anio}-${mes}-${dia}`;
    } else {
      return `${hora}:${min}`;
    }
  }

  const handleCancel = () => {
    setFormProduccion({
      litros: 0,
      fecha: "",
      hora_recoleccion: "",
      hora_carga: "",
      id_empleado: "",
      cantidad_animales: 0,
      aclaracion: "",
      estado: "ACTIVO",
    });
  };

  const handleSubmit = (e) => {
    if (
      formProduccion.litros <= 0 ||
      !formProduccion.hora_recoleccion ||
      formProduccion.cantidad_animales <= 0
    ) {
      return Swal.fire({
        title: "Complete los campos necesarios para cargar la producción",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
        iconColor: "#D64747",
      });
    }

    e.preventDefault();

    const id_usuario = localStorage.getItem("user_id");

    const formSub = {
      ...formProduccion,
      fecha: obtenerFechaActual("fecha"),
      hora_carga: obtenerFechaActual("hora"),
      id_empleado: id_usuario,
    };
    setLoader(true);
    axios
      .post(url + "tambo/produccionleche", formSub)
      .then((res) => {
        setLoader(false);
        Swal.fire({
          title: "Produción cargada con éxito",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
        }).then(() => {
          //   window.location.reload();
          if (produccionCargada) produccionCargada(); // 🔁 Notifica al padre
          handleCancel(); // Limpiar formulario si querés
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
              : error.response.data.message,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#D64747",
          icon: "error",
        });
      });
  };

  //? DESPAZAMIENTO CON LA FLECHA
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);

  const handleKeyDown = (e, nextRef, prevRef) => {
    if (e.key === "ArrowDown" && nextRef) {
      e.preventDefault();
      nextRef.current.focus();
    } else if (e.key === "ArrowUp" && prevRef) {
      e.preventDefault();
      prevRef.current.focus();
    }
  };

  return (
    <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full scrollbar lg:overflow-auto">
      <div className="flex w-full">
        <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">
          CARGAR PRODUCCION
        </h2>
      </div>
      <div className="flex w-full justify-between">
        <div className="flex flex-col w-[48%]">
          <label className="text-xl font-semibold text-white-bg3">
            Hora de ordeñe <strong className="text-red-400">*</strong>
          </label>
          <input
            ref={input1Ref}
            onKeyDown={(e) => handleKeyDown(e, input2Ref, null)}
            onChange={handleChangeForm}
            placeholder="00:00 hs"
            type="time"
            value={formProduccion.hora_recoleccion}
            name="hora_recoleccion"
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label className="text-xl font-semibold text-white-bg3">
            Hora de carga
          </label>
          <p className="bg-white-bg2 text-black-comun py-2 px-5 text-xl">
            {obtenerFechaActual("hora")}
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">
          Litros <strong className="text-red-400">*</strong>
        </label>
        <input
          ref={input2Ref}
          onKeyDown={(e) => handleKeyDown(e, input3Ref, input1Ref)}
          onChange={handleChangeForm}
          placeholder="1000 lts"
          type="number"
          value={formProduccion.litros ? formProduccion.litros : ""}
          name="litros"
          className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
        />
      </div>

      <div className="flex w-full justify-between">
        <div className="flex flex-col w-[48%]">
          <label className="text-xl font-semibold text-white-bg3 truncate">
            Cantidad animales <strong className="text-red-400">*</strong>
          </label>
          <input
            ref={input3Ref}
            onKeyDown={(e) => handleKeyDown(e, input4Ref, input2Ref)}
            onChange={handleChangeForm}
            placeholder="100"
            type="number"
            value={
              formProduccion.cantidad_animales
                ? formProduccion.cantidad_animales
                : ""
            }
            name="cantidad_animales"
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label className="text-xl font-semibold text-white-bg3 truncate">
            Promedio por animal
          </label>
          <p className="bg-white-bg2 text-black-comun py-2 px-5 text-xl">
            {formProduccion.litros && formProduccion.cantidad_animales
              ? (
                  formProduccion.litros / formProduccion.cantidad_animales
                ).toFixed(2)
              : "-"}{" "}
            Litros
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">
          Aclaraciones
        </label>
        <textarea
          ref={input4Ref}
          onKeyDown={(e) => handleKeyDown(e, null, input3Ref)}
          onChange={handleChangeForm}
          placeholder="Aclaraciones sobre esta producción"
          type="text"
          value={formProduccion.aclaracion}
          name="aclaracion"
          className="bg-white-bg2 text-black-comun py-2 px-5 text-xl max-h-20 min-h-20"
        />
      </div>

      <p className="text-white-bg3 w-full">
        - Los campos marcados con <strong className="text-red-400">*</strong>{" "}
        son oblicatorios para cargar la producción.
      </p>

      <div className="space-x-2 flex justify-end w-full">
        <button onClick={handleCancel} className="boton_rojo">
          CANCELAR
        </button>
        <button onClick={handleSubmit} className="boton_verde w-32">
          {loader ? (
            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
          ) : (
            "CARGAR"
          )}
        </button>
      </div>
    </div>
  );
};

export default CargarProduccion;
