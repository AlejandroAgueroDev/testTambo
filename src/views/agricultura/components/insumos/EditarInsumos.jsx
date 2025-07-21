import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";

const EditarInsumo = ({ setCloseModal, data, fetchData }) => {
  const [dataInsumo, setDataInsumo] = useState(data);
  const [cantidadIngresa, setCantidadIngresa] = useState(0);
  const [loader, setLoader] = useState(false);

  const handleModificar = () => {
    const dataModificated = {
      ...dataInsumo,
      stock: Number(data.stock) + Number(cantidadIngresa),
      ultimo_ingreso: new Date().toISOString(),
    };

    setLoader(true);

    axios
      .put(url + "insumo/", dataModificated)
      .then((res) => {
        setLoader(false);
        Swal.fire({
          title: "¡Ingreso de insumo cargado con éxito!",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
        }).then(() => {
          fetchData();
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
          icon: "error",
        });
      });
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[90vw] sm:w-[500px]">
      <div className="w-full flex justify-between">
        <Titulo text={`CARGAR INSUMO | ${data.tipo}`} />
      </div>

      <div className="w-full space-y-3">
        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">Nombre</label>
          <input
            placeholder="Nombre insumo"
            type="text"
            onChange={(e) =>
              setDataInsumo({ ...dataInsumo, nombre: e.target.value })
            }
            value={dataInsumo.nombre}
            name="nombre"
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl w-full grow"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">Precio</label>
          <div className="flex items-center bg-white-bg2 px-3 w-full grow">
            <p className="text-xl text-white-bg3">$</p>
            <input
              placeholder="1000"
              type="number"
              onChange={(e) =>
                setDataInsumo({ ...dataInsumo, precio: e.target.value })
              }
              value={dataInsumo.precio}
              name="precio"
              className="bg-white-bg2 text-black-comun py-2 px-2 text-xl"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Stock actual
          </label>
          <p className="bg-white-bg text-black-comun py-2 px-5 text-xl ">
            {data.stock}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Cantidad ingresada
          </label>
          <input
            type="number"
            placeholder="Ej: 200"
            value={cantidadIngresa || ""}
            onChange={(e) => setCantidadIngresa(e.target.value)}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
          />
        </div>

        <div className="w-full flex justify-end space-x-3">
          <button onClick={() => setCloseModal(false)} className="boton_rojo">
            CANCELAR
          </button>
          <button onClick={handleModificar} className="boton_verde">
            {loader ? (
              <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
            ) : (
              "MODIFICAR"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarInsumo;
