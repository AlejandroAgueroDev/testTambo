import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Validation } from "../../../../common/Validation";

const CargarInsumo = ({ setCloseModal, data, getInsumos, isTambo = false }) => {
  const [dataInsumo, setDataInsumo] = useState(data);
  const [cantidadIngresa, setCantidadIngresa] = useState(0);
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cantidadIngresa") {
      // Si el valor es vacío, se permite para que el usuario pueda borrar el campo
      if (value === "") {
        setCantidadIngresa("");
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
        return;
      }

      const numericValue = Number(value);

      // No permitir escribir 0 o valores negativos
      if (numericValue <= 0) {
        return; // evita actualizar el input con valor inválido
      }

      setCantidadIngresa(numericValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    } else {
      const errorMsg = Validation(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMsg,
      }));
      setDataInsumo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleModificar = async () => {
    const dataModificated = {
      ...dataInsumo,
      stock: Number(dataInsumo.stock) + Number(cantidadIngresa),
      ultimo_ingreso: new Date().toISOString(),
    };

    setLoader(true);

    //?PUT para editar insumo
    try {
      const { data } = await axios.put(url + "insumo/", dataModificated);

      setLoader(false);
      Swal.fire({
        title: "Insumo editado con éxito!",
        confirmButtonText: "Aceptar",
        icon: "success",
        confirmButtonColor: "#86C394",
      }).then(() => {
        setCloseModal(false);
        getInsumos();
      });
    } catch (error) {
      setLoader(false);
      console.log("Error al editar insumo", error);
      setErrors({});
      Swal.fire({
        title: "Ocurrió un error inesperado, intente nuevamente",
        text:
          error.message === "Network Error"
            ? "Contacte con el servicio técnico"
            : error.response?.data?.error || error.message,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[380px] sm:w-full">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0 mb-3">
        <Titulo text={`EDITAR INSUMO | ${data.tipo}`} />
      </div>

      <div className="flex flex-col space-y-4 scrollbar overflow-y-auto max-h-[70dvh]">
        <div className="flex items-center space-x-4">
          <label className="labelInput">Nombre</label>
          <input
            placeholder="Nombre insumo"
            type="text"
            onChange={handleInputChange}
            value={dataInsumo.nombre}
            name="nombre"
            className="input"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:items-center w-full">
          <label className="labelInput">Precio</label>
          <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow">
            <p className="text-xl text-white-bg3">$</p>
            <input
              placeholder="1000"
              type="number"
              onChange={handleInputChange}
              value={dataInsumo.precio || ""}
              name="precio"
              className="input"
            />
          </div>
        </div>

        <div className="p-2 bg-white-bg space-y-2">
          <div className="flex items-center space-x-4">
            <label className="labelInput">Stock actual</label>
            <p className="input">{dataInsumo.stock}</p>
          </div>

          <div className="flex items-center space-x-4">
            <label className="labelInput">Cantidad ingresada</label>
            <Tippy
              content={errors.cantidadIngresa || ""}
              visible={!!errors.cantidadIngresa}
              placement="top-end"
              arrow={true}
              theme="custom"
            >
              <input
                type="number"
                name="cantidadIngresa"
                placeholder="0"
                value={cantidadIngresa || ""}
                onChange={handleInputChange}
                className={`input ${
                  errors.cantidadIngresa ? "border-red-500" : "border-gray-300"
                }`}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                }}
              />
            </Tippy>
          </div>
        </div>

        <div className={isTambo ? "flex items-center space-x-4" : "hidden"}>
          <label className="labelInput">Tipo de insumo</label>
          <select onChange={handleInputChange} name="tipo" className="input">
            <option
              value="MEDICAMENTO"
              selected={dataInsumo.tipo === "MEDICAMENTO"}
            >
              Medicamento
            </option>
            <option value="ALIMENTO" selected={dataInsumo.tipo === "ALIMENTO"}>
              Alimento
            </option>
            <option value="OTROS" selected={dataInsumo.tipo === "OTROS"}>
              Otros
            </option>
          </select>
        </div>

        <div className="w-full flex justify-end space-x-3">
          <button onClick={() => setCloseModal(false)} className="boton_rojo">
            CANCELAR
          </button>
          <button onClick={handleModificar} className="boton_verde">
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

export default CargarInsumo;
