import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";

const NuevoComprador = ({
  setCloseModal,
  setForm,
  form,
  setCompradorCreado,
}) => {
  const [loader, setLoader] = useState(false);
  const [formNewComprador, setFormNewComprador] = useState({
    nombre_tambo: "",
    propietario: "",
    cuit_cuil: 0,
    contacto_1: "",
    contacto_2: "",
    id_tambo: 1,
  });

  const handleForm = (e) => {
    const v = e.target.value;
    const p = e.target.name;

    setFormNewComprador({ ...formNewComprador, [p]: v });
  };

  const handleCarga = () => {
    if (
      !formNewComprador.propietario ||
      !formNewComprador.nombre_tambo ||
      !formNewComprador.contacto_1 ||
      !formNewComprador.cuit_cuil ||
      !formNewComprador.contacto_1
    ) {
      return Swal.fire({
        title: "Complete los campos necesarios para cargar el nuevo Comprador",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
      });
    }

    setLoader(true);

    axios
      .post(url + "cliente/", formNewComprador)
      .then((res) => {
        setCompradorCreado(true);
        setLoader(false);
        Swal.fire({
          title: "¡Nuevo comprador cargado con exito!",
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

  const cancelar = () => {
    setCloseModal(false);
    setForm({ ...form, Comprador: 0 });
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[380px] sm:w-[500px]">
      <div className="w-full flex justify-between">
        <Titulo text={`NUEVO COMPRADOR`} />
      </div>

      <div className="w-full space-y-3">
        <div className="flex flex-col sm:flex-row sm:space-x-3 items-start sm:items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Nombre tambo
          </label>
          <input
            placeholder="Nombre tambo"
            type="text"
            onChange={handleForm}
            name="nombre_tambo"
            value={formNewComprador.nombre_tambo}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl w-full sm:w-auto sm:grow"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-3 items-start sm:items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Nombre propietario
          </label>
          <input
            placeholder="Nombre propietario"
            type="text"
            onChange={handleForm}
            name="propietario"
            value={formNewComprador.propietario}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl  w-full sm:w-auto sm:grow"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-3 items-start sm:items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Cuit/Cuil
          </label>
          <input
            placeholder="xx-xxxxxxxxx-x"
            type="text"
            onChange={handleForm}
            name="cuit_cuil"
            value={formNewComprador.cuit_cuil}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl  w-full sm:w-auto sm:grow"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-3 items-start sm:items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Contacto 1
          </label>
          <input
            placeholder="+54 123456789"
            type="text"
            onChange={handleForm}
            name="contacto_1"
            value={formNewComprador.contacto_1}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl  w-full sm:w-auto sm:grow"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-3 items-start sm:items-center w-full">
          <label className="text-xl font-semibold text-white-bg3">
            Contacto 2
          </label>
          <input
            placeholder="+54 123456789"
            type="text"
            onChange={handleForm}
            name="contacto_2"
            value={formNewComprador.contacto_2}
            className="bg-white-bg2 text-black-comun py-2 px-5 text-xl  w-full sm:w-auto sm:grow"
          />
        </div>

        <div className="w-full flex justify-end space-x-3">
          <button onClick={cancelar} className="boton_rojo">
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

export default NuevoComprador;
