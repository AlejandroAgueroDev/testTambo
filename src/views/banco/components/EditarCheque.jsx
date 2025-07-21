import { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../common/URL_SERVER";
import Titulo from "../../../common/Titulo";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Validation } from "../../../common/Validation";

const EditarCheque = ({ cheque, setShowModal, onChequeUpdated }) => {
  const toLocalDateInputFormat = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [nuevoCheque, setNuevoCheque] = useState({
    ...cheque,
    fecha_emision: toLocalDateInputFormat(cheque.fecha_emision),
    fecha_pago: toLocalDateInputFormat(cheque.fecha_pago),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const errorMsg = Validation(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    if (name === "importe" && value === "0") {
      return;
    }

    setNuevoCheque((prevState) => ({
      ...prevState,
      [name]: name === "importe" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSave = async () => {
    const campos = [
      "banco",
      "origen",
      "numero_cheque",
      "fecha_emision",
      "fecha_pago",
      "importe",
      "destino",
    ];

    const nuevosErrores = {};
    campos.forEach((campo) => {
      const error = Validation(campo, nuevoCheque[campo]);
      if (error) nuevosErrores[campo] = error;
    });

    if (Object.keys(nuevosErrores).length) {
      setErrors(nuevosErrores);
      return;
    }

    try {
      setLoader(true);    
      await axios.put(`${url}banco/cheque`, nuevoCheque); 
      Swal.fire({
        title: `El cheque fue editado con exito.`,
        icon: "success",
        confirmButtonColor: "#86C394",
      });
      setShowModal(false);
      onChequeUpdated();
    } catch (error) {
      console.error("Error al editar cheque:", error);
      Swal.fire("Error", "No se pudo actualizar el cheque", "error");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4 items-start max-h-[80dvh]">
        <Titulo text="EMITIR CHEQUE" />
        <div className="text-xl flex flex-col space-y-3 mx-auto w-[400px] scrollbar overflow-y-auto overflow-x-hidden">
          <div className="containerInput">
            <label htmlFor="banco" className="labelInput">
              Banco <strong className="text-red-400">*</strong>
            </label>
            <Tippy
              content={errors.banco || ""}
              visible={!!errors.banco}
              placement="top-end"
              arrow={true}
              theme="custom"
            >
              <input
                id="banco"
                placeholder="Ej: BBVA"
                onChange={handleInputChange}
                type="text"
                name="banco"
                value={nuevoCheque.banco}
                className={`input ${
                  errors.banco ? "border-red-500" : "border-gray-300"
                }`}
              />
            </Tippy>
          </div>

          <div className="containerInput">
            <label htmlFor="origen" className="labelInput">
              Origen <strong className="text-red-400">*</strong>
            </label>
            <Tippy
              content={errors.origen || ""}
              visible={!!errors.origen}
              placement="top-end"
              arrow={true}
              theme="custom"
            >
              <input
                id="origen"
                placeholder="Ej: Cuenta corriente"
                onChange={handleInputChange}
                type="text"
                name="origen"
                value={nuevoCheque.origen}
                className={`input ${
                  errors.origen ? "border-red-500" : "border-gray-300"
                }`}
              />
            </Tippy>
          </div>

          <div className="containerInput">
            <label htmlFor="numero_cheque" className="labelInput">
              N° de cheque <strong className="text-red-400">*</strong>
            </label>
            <Tippy
              content={errors.numero_cheque || ""}
              visible={!!errors.numero_cheque}
              placement="top-end"
              arrow={true}
              theme="custom"
            >
              <input
                id="numero_cheque"
                placeholder="00001"
                onChange={handleInputChange}
                type="number"
                name="numero_cheque"
                value={nuevoCheque.numero_cheque}
                className={`input ${
                  errors.numero_cheque ? "border-red-500" : "border-gray-300"
                }`}
              />
            </Tippy>
          </div>

          <div className="containerInput">
            <label htmlFor="fecha_emision" className="labelInput">
              Fecha de emisión <strong className="text-red-400">*</strong>
            </label>
            <input
              id="fecha_emision"
              onChange={handleInputChange}
              type="date"
              name="fecha_emision"
              value={nuevoCheque.fecha_emision}
              className="input"
            />
          </div>

          <div className="containerInput">
            <label htmlFor="fecha_pago" className="labelInput">
              Fecha de pago <strong className="text-red-400">*</strong>
            </label>
            <input
              id="fecha_pago"
              onChange={handleInputChange}
              type="date"
              name="fecha_pago"
              value={nuevoCheque.fecha_pago}
              className="input"
            />
          </div>

          <div className="containerInput">
            <label htmlFor="importe" className="labelInput">
              Importe <strong className="text-red-400">*</strong>
            </label>
            <Tippy
              content={errors.importe || ""}
              visible={!!errors.importe}
              placement="top-end"
              arrow={true}
              theme="custom"
            >
              <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow">
                <p className="text-xl text-white-bg3">$</p>
                <input
                  id="importe"
                  placeholder="1000"
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
                  type="number"
                  onChange={handleInputChange}
                  name="importe"
                  value={nuevoCheque.importe}
                  className={`input ${
                    errors.importe ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
            </Tippy>
          </div>

          <div className="containerInput">
            <label htmlFor="destino" className="labelInput">
              Destino <strong className="text-red-400">*</strong>
            </label>
            <Tippy
              content={errors.destino || ""}
              visible={!!errors.destino}
              placement="top-end"
              arrow={true}
              theme="custom"
            >
              <input
                id="destino"
                placeholder="Ej: Proveedor X"
                onChange={handleInputChange}
                type="text"
                name="destino"
                value={nuevoCheque.destino}
                className={`input ${
                  errors.destino ? "border-red-500" : "border-gray-300"
                }`}
              />
            </Tippy>
          </div>

          {/* <div className="containerInput">
            <label
              htmlFor="detalle"
              className="text-xl font-semibold text-white-bg3"
            >
              Detalle
            </label>
            <textarea
              id="detalle"
              onChange={handleInputChange}
              placeholder="Detalle del cheque"
              type="text"
              name="detalle"
              value={nuevoCheque.detalle}
              className="bg-white-bg2 text-black-comun py-2 px-3 text-xl max-h-20 min-h-20 grow"
            />
          </div> */}

          <div className="flex justify-end space-x-3 pt-5 mb-2">
            <button
              type="button"
              className="boton_rojo"
              onClick={() => setShowModal(false)}
            >
              CANCELAR
            </button>
            <button onClick={handleSave} className="boton_verde">
              {loader ? (
                <BiLoaderAlt className="animate-spin text-black-comun text-center grow" />
              ) : (
                "EDITAR CHEQUE"
              )}
            </button>
          </div>
        </div>
      </div>

      <p className="text-white-bg3 mt-2">
        - Los campos marcados con <strong className="text-red-400">*</strong>{" "}
        son obligatorios.
      </p>
    </>
  );
};
export default EditarCheque;
