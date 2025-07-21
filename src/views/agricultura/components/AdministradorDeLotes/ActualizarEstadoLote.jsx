import { useState, useRef } from "react";
import axios from "axios";
import { BiLoaderAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import { url } from "../../../../common/URL_SERVER";

const ActualizarEstadoLote = ({ estadoActual, getData, data }) => {
  const [formEstado, setFormEstado] = useState({
    estado: "",
    fecha: "",
    detalle: "",
  });
  const [loader, setLoader] = useState(false);

  const handleChangeForm = (e) => {
    const { name, value } = e.target;

    setFormEstado({ ...formEstado, [name]: value });
  };

  const handleSubmit = (e) => {
    if (!formEstado.estado || !formEstado.fecha) {
      return Swal.fire({
        title: "Complete los campos necesarios para actualizar el estado",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        iconColor: "#D64747",
        icon: "warning",
      });
    }

    const dataFinal = { ...formEstado, id_lote: data.id };
    setLoader(true);
    axios
      .post(url + "agricultura/estado", dataFinal)
      .then((res) => {
        setLoader(false);
        Swal.fire({
          title: "Estado actualizado con éxito",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
          iconColor: "#86C394",
        }).then(() => {
          getData();
          setFormEstado({
            estado: "",
            fecha: "",
            detalle: "",
          });
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
    <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 p-2 bg-white-bg2 h-full scrollbar lg:overflow-auto">
      <div className="flex w-full">
        <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">
          ACTUALIZAR ESTADO DE LOTE
        </h2>
      </div>
      <div className="flex w-full justify-between">
        <div className="flex flex-col w-[48%]">
          <label className="text-xl font-semibold text-white-bg3">
            Nuevo estado <strong className="text-red-400">*</strong>
          </label>
          <input
            ref={input1Ref}
            onKeyDown={(e) => handleKeyDown(e, input2Ref, null)}
            onChange={handleChangeForm}
            placeholder="Nuevo estado"
            type="text"
            value={formEstado.estado}
            name="estado"
            className="bg-white-bg text-black-comun py-2 px-5 text-xl"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label className="text-xl font-semibold text-white-bg3">
            Estado actual
          </label>
          <p className="bg-white-bg text-black-comun py-2 px-5 text-xl">
            {estadoActual || "Sin estado actual."}
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">
          Fecha actualizacion <strong className="text-red-400">*</strong>
        </label>
        <input
          ref={input2Ref}
          onKeyDown={(e) => handleKeyDown(e, input3Ref, input1Ref)}
          onChange={handleChangeForm}
          type="date"
          value={formEstado.fecha}
          name="fecha"
          className="bg-white-bg text-black-comun py-2 px-5 text-xl"
        />
      </div>

      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">
          Aclaraciones sobre la actualizacion
        </label>
        <textarea
          ref={input3Ref}
          onKeyDown={(e) => handleKeyDown(e, null, input2Ref)}
          onChange={handleChangeForm}
          placeholder="Aclaraciones sobre esta producción"
          type="number"
          value={formEstado.detalle}
          name="detalle"
          className="bg-white-bg text-black-comun py-2 px-5 text-xl max-h-40 min-h-40"
        />
      </div>

      <p className="text-white-bg3 w-full">
        - Los campos marcados con <strong className="text-red-400">*</strong>{" "}
        son oblicatorios para cargar la producción.
      </p>

      <div className="space-x-2 flex justify-end w-full">
        <button onClick={handleSubmit} className="boton_verde ">
          {loader ? (
            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
          ) : (
            "ACTUALIZAR"
          )}
        </button>
      </div>
    </div>
  );
};

export default ActualizarEstadoLote;
