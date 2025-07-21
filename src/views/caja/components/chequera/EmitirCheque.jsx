import React, { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
//?COMPONENTS
import { Validation } from "../../../../common/Validation";
import Titulo from "../../../../common/Titulo";

const EmitirCheque = ({ setShowModal, token, fetchData }) => {
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    importe: "",
    estado: "ENTREGADO",
    detalle: "",
    destino: "",
    banco: "",
    numero_cheque: "",
    fecha_emision: "",
    fecha_pago: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const errorMsg = Validation(name, value);

    if (name === "importe" && value === "0") {
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const requiredFields = [
      "banco",
      "numero_cheque",
      "fecha_emision",
      "fecha_pago",
      "importe",
      "destino",
    ];
    const newErrors = {};

    requiredFields.forEach((field) => {
      const value = formData[field];
      const errorMsg = Validation(field, value);
      if (errorMsg) {
        newErrors[field] = errorMsg;
      }
    });

    const hayCamposVacios = requiredFields.some((campo) => !formData[campo]);

    if (hayCamposVacios) {
      setErrors({});
      return Swal.fire({
        title: "No puedes dejar campos vacíos",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

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

    setLoader(true);
    try {
      await axios.post(
        `${url}caja/cheque`,
        {
          ...formData,
          importe: Number(formData.importe),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        importe: "",
        estado: "",
        detalle: "",
        destino: "",
        banco: "",
        numero_cheque: "",
        fecha_emision: "",
        fecha_pago: "",
      });

      Swal.fire({
        icon: "success",
        title: "Cheque emitido correctamente",
        showConfirmButton: false,
        timer: 2000,
      });
      fetchData()
      setShowModal(false);
    } catch (error) {
      console.error("Error al emitir cheque:", error);
      Swal.fire({
        icon: "error",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
        title: "Error al emitir el cheque",
        text: error?.response?.data?.message || "Intente nuevamente.",
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 items-start max-h-[80dvh]">
      <Titulo text="EMITIR CHEQUE" />
      <form
        className="text-xl flex flex-col space-y-3 mx-auto w-[380px] sm:w-full scrollbar overflow-y-auto overflow-x-hidden"
        onSubmit={handleSave}
      >
        <div className="containerInput">
          <label className="labelInput">
            Nombre del Banco<strong className="text-red-400">*</strong>
          </label>
          <Tippy
            content={errors.banco || ""}
            visible={!!errors.banco}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              onChange={handleInputChange}
              type="text"
              placeholder="Ej: Banco Galicia"
              name="banco"
              className={`input ${
                errors.banco ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Tippy>
        </div>

        <div className="containerInput">
          <label className="labelInput">
            N° de cheque<strong className="text-red-400">*</strong>
          </label>
          <Tippy
            content={errors.numero_cheque || ""}
            visible={!!errors.numero_cheque}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              onChange={handleInputChange}
              type="text"
              placeholder="Ej: 123432124431123"
              name="numero_cheque"
              className={`input ${
                errors.numero_cheque ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Tippy>
        </div>

        <div className="containerInput">
          <label className="labelInput">
            Fecha de emisión<strong className="text-red-400">*</strong>
          </label>
          <input
            onChange={handleInputChange}
            type="date"
            name="fecha_emision"
            value={formData.fecha_emision}
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">
            Fecha de pago<strong className="text-red-400">*</strong>
          </label>
          <input
            onChange={handleInputChange}
            type="date"
            name="fecha_pago"
            value={formData.fecha_pago}
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">
            Importe<strong className="text-red-400">*</strong>
          </label>
          <Tippy
            content={errors.importe || ""}
            visible={!!errors.importe}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <div className="flex items-center bg-white-bg2 pl-3 space-x-2 w-full grow">
              <p className="text-xl text-white-bg3">$</p>
              <input
                placeholder="1000"
                type="number"
                onChange={handleInputChange}
                name="importe"
                value={formData.importe}
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
                className={`input  ${
                  errors.importe ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
          </Tippy>
        </div>

        <div className="containerInput">
          <label className="labelInput">
            Destino<strong className="text-red-400">*</strong>
          </label>
          <Tippy
            content={errors.destino || ""}
            visible={!!errors.destino}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              onChange={handleInputChange}
              type="text"
              placeholder="ingrese el CBU/CVU del destinatario"
              name="destino"
              className={`input ${
                errors.destino ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Tippy>
        </div>

        <div className="containerInput">
          <label className="labelInput">Concepto</label>
          <textarea
            onChange={handleInputChange}
            placeholder="Concepto de la transferencia"
            type="text"
            name="detalle"
            className="bg-white-bg2 text-black-comun py-2 px-3 text-xl max-h-20 min-h-20 w-full grow"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-5">
          <button className="boton_rojo" onClick={() => setShowModal(false)}>
            CANCELAR
          </button>
          <button type="submit" className="boton_verde">
            {loader ? (
              <BiLoaderAlt className="animate-spin text-black-comun text-center grow" />
            ) : (
              "EMITIR CHEQUE"
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

export default EmitirCheque;
