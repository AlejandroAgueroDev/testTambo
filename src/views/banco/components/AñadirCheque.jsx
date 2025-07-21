import { useState, useEffect } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../common/URL_SERVER";
import Titulo from "../../../common/Titulo";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Validation } from "../../../common/Validation";

const AñadirCheque = ({ setShowModal, agregarNuevoCheque }) => {
  const [nuevoCheque, setNuevoCheque] = useState({
    importe: "",
    id_sector: "",
    origen: "",
    destino: "",
    banco: "",
    numero_cheque: "",
    fecha_emision: "",
    fecha_pago: "",
  });
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [sectores, setSectores] = useState([]);

  //?GET sectores
  const fetchSector = async () => {
    try {
      const { data } = await axios(`${url}sector`);
      const sectoresOrdenados = data.sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );

      setSectores(sectoresOrdenados);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchSector();
  }, []);

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

  const handleSave = async (e) => {
    e.preventDefault();

    if (nuevoCheque.importe <= 0) {
      setErrors({});
      return Swal.fire({
        title: "El importe debe ser mayor a cero",
        icon: "warning",
        confirmButtonColor: "#D64747",
      });
    }

    const camposRequeridos = [
      "banco",
      "numero_cheque",
      "fecha_emision",
      "fecha_pago",
      "importe",
      "origen",
    ];

    const newErrors = {};

    camposRequeridos.forEach((field) => {
      const error = Validation(field, nuevoCheque[field]);
      if (error) newErrors[field] = error;
    });

    // Validación específica para sector
    if (!nuevoCheque.id_sector) {
      newErrors.id_sector = "Debés seleccionar un sector";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setErrors({});
      return Swal.fire({
        title: "Campos incompletos o inválidos",
        text: "Revisá los datos ingresados.",
        icon: "warning",
        confirmButtonColor: "#D64747",
      });
    }

    try {
      setLoader(true);

      const { data } = await axios.post(`${url}banco/cheque`, nuevoCheque);

      Swal.fire({
        title: "Cheque registrado exitosamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#86C394",
      }).then((result) => {
        if (result.isConfirmed) {
          setShowModal(false);
          agregarNuevoCheque(data);
        }
      });

      setNuevoCheque({
        importe: "",
        id_sector: "",
        origen: "",
        destino: "",
        banco: "",
        numero_cheque: "",
        fecha_emision: "",
        fecha_pago: "",
      });
    } catch (error) {
      console.error("Error al registrar el cheque:", error);
      Swal.fire({
        title: "Error al registrar el cheque",
        text:
          error.response?.data?.message ||
          "Ocurrió un error inesperado al procesar el cheque.",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSave}
        className="flex flex-col space-y-4 items-start max-h-[80dvh]"
      >
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
                placeholder="Ingrese CBU o ALIAS"
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
              Destino
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
                placeholder="Ingrese CBU o ALIAS"
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

          <div className="containerInput">
            <label htmlFor="id_sector" className="labelInput">
              Sector
            </label>
            <select
              id="id_sector"
              name="id_sector"
              value={nuevoCheque.id_sector}
              onChange={handleInputChange}
              className="input"
            >
              <option value="">Seleccioná un sector</option>
              {sectores.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-5 mb-2">
            <button
              type="button"
              className="boton_rojo"
              onClick={() => setShowModal(false)}
            >
              CANCELAR
            </button>
            <button type="submit" className="boton_verde">
              {loader ? (
                <BiLoaderAlt className="animate-spin text-black-comun text-center grow" />
              ) : (
                "AÑADIR CHEQUE"
              )}
            </button>
          </div>
        </div>
      </form>

      <p className="text-white-bg3 mt-2">
        - Los campos marcados con <strong className="text-red-400">*</strong>{" "}
        son obligatorios.
      </p>
    </>
  );
};

export default AñadirCheque;
