import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";

const AñadirOEditar = ({
  setCloseModal,
  arrayNombreRollos,
  setContadores,
  data,
  setMovimientos,
}) => {
  const [loader, setLoader] = useState(false);
  const [formLote, setFormLote] = useState(data);
  const [errorNombre, setErrorNombre] = useState("");

  const handleForm = (e) => {
    const { name, value } = e.target;

    if (name === "tipo") {
      if (arrayNombreRollos.includes(value.toUpperCase())) {
        setErrorNombre("¡Ya existe un tipo de rollo con este nombre!");
      } else {
        setErrorNombre("");
      }
    }

    if (name === "tipo") {
      setFormLote({ ...formLote, [name]: value.toUpperCase() });
    } else {
      setFormLote({ ...formLote, [name]: value });
    }
  };

  const handleCarga = () => {
    if (!formLote.tipo) {
      return Swal.fire({
        title: "Complete los campos necesarios para cargar el lote",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        iconColor: "#D64747",
        icon: "warning",
      });
    }

    if (errorNombre) {
      return Swal.fire({
        title: errorNombre,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        iconColor: "#D64747",
        icon: "error",
      });
    }

    if (
      formLote.tipo === data.tipo &&
      formLote.cantidad === data.cantidad &&
      formLote.precio === data.precio
    ) {
      return setCloseModal(false);
    }

    setLoader(true);
    
    axios
      .put(url + "agricultura/rollo", formLote)
      .then((res) => {
        setLoader(false);
        Swal.fire({
          title: "¡Nuevo tipo de rollo cargado con exito!",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
          iconColor: "#86C394",
        }).then(() => {
          axios(url + "agricultura/rollo").then(({ data }) => {
            setContadores(data);
          });

          axios(url + "agricultura/movimiento-rollo").then(({ data }) => {
            const dataFormat = data.map((d) => {
              const fechaFinal = d.fecha
                .split("T")[0]
                .split("-")
                .reverse()
                .join("/");
              return {
                ...d,
                fechaFormt: fechaFinal,
              };
            });
            setMovimientos(dataFormat.reverse());
          });
          setCloseModal(false);
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
              : error,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#D64747",
          iconColor: "#D64747",
          icon: "error",
        });
      });
  };

  return (
    <div className="flex flex-col space-y-2 items-start">
      <div className="w-full flex justify-between">
        <Titulo text="EDITAR DATOS MANUALMENTE" />
      </div>

      <div className="w-full space-y-3">
        <div className="flex flex-col w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Tipo<strong className="text-red-400">*</strong>
          </label>
          <input
            type="text"
            onChange={handleForm}
            name="tipo"
            value={formLote.tipo}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Peso<strong className="text-red-400">*</strong>
          </label>
          <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow w-full">
            <p className="text-xl text-white-bg3">KG</p>
            <input
              type="text"
              onChange={handleForm}
              name="cantidad"
              value={formLote.cantidad}
              className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Precio por kilogramos<strong className="text-red-400">*</strong>
          </label>
          <div className="w-full flex bg-white-bg2 items-center">
            <p className="text-2xl px-3 text-white-bg3">$</p>
            <input
              onChange={handleForm}
              type="number"
              value={formLote.precio ? formLote.precio : ""}
              name="precio"
              className="bg-white-bg2 text-black-comun py-2 pl-2 text-xl w-full"
            />
          </div>
        </div>

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

export default AñadirOEditar;
