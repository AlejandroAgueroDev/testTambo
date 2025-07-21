import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";

const NuevoProveedor = ({
  setCloseModal,
  setNuevoProv,
  id_sector,
  isTamboProveedor = false,
}) => {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    nombre_empresa: "",
    localidad: "",
    contacto_1: "",
    saldo: 0,
    id_sector: id_sector,
    isTamboProveedor: isTamboProveedor,
  });

  const handleForm = (e) => {
    const v = e.target.value;
    const p = e.target.name;

    setFormData({ ...formData, [p]: v });
  };

  const handleCarga = () => {
    if (
      !formData.nombre_empresa ||
      !formData.localidad ||
      !formData.contacto_1 ||
      !formData.saldo === ""
    ) {
      return Swal.fire({
        title: "Complete los campos necesarios para cargar el proveedor",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
      });
    }

    const dataModificated = {
      ...formData,
      ultimo_ingreso: obtenerFechaActual("fecha"),
      proveedor: formData.proveedor || "-",
    };

    setLoader(true);
    axios
      .post(url + "proveedor", dataModificated)
      .then((res) => {
        setNuevoProv(true);
        setLoader(false);
        Swal.fire({
          title: "¡Nuevo proveedor cargado con exito!",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
        }).then(() => setCloseModal(false));
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
        Swal.fire({
          title: "Ocurrio un error inesperado, intente nuevamente",
          text:
            error.message === "Network Error"
              ? "Contacte con el servicio técnico"
              : error,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#D64747",
          icon: "error",
        });
      });
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[400px]">
      <div className="w-full flex justify-between">
        <Titulo text={`AGREGAR PROVEEDOR`} />
      </div>

      <div className="w-full space-y-3">
        <div className="flex space-x-3 items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Nombre <strong className="text-red-400">*</strong>
          </label>
          <input
            placeholder="Nombre proveedor"
            type="text"
            onChange={handleForm}
            name="nombre_empresa"
            value={formData.nombre_empresa}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
          />
        </div>

        <div className="flex space-x-3 items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Localidad <strong className="text-red-400">*</strong>
          </label>
          <input
            placeholder="Dirección, Ciudad, Provincia"
            type="text"
            onChange={handleForm}
            name="localidad"
            value={formData.localidad}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
          />
        </div>

        <div className="flex space-x-3 items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Contacto 1 <strong className="text-red-400">*</strong>
          </label>
          <input
            placeholder="+54 123456789"
            type="text"
            onChange={handleForm}
            name="contacto_1"
            value={formData.contacto_1}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">
            Saldo<strong className="text-red-400">*</strong>
          </label>
          <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow">
            <p className="labelInput">$</p>
            <input
              placeholder="0"
              type="number"
              name="saldo"
              onChange={handleForm}
              value={formData.saldo || ""}
              className="bg-white-bg2 text-black-comun py-2 px-2 text-xl grow"
            />
          </div>
        </div>

        <p className="text-white-bg3 w-full">
          Los campos marcados con <strong className="text-red-400">*</strong>{" "}
          son oblicatorios para crear el proveedor.
        </p>

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
      </div>
    </div>
  );
};

export default NuevoProveedor;
