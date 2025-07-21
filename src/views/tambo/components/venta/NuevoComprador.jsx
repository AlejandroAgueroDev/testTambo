import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";

const NuevoComprador = ({
  setCloseModal,
  setForm,
  form,
  setCompradorCreado,
  idSector,
  setCompradores,
}) => {
  const [loader, setLoader] = useState(false);
  const [formNewComprador, setFormNewComprador] = useState({
    nombre_empresa: "",
    cuit_cuil: "",
    contacto_1: "",
    localidad: "",
    saldo: "",
    id_sector: idSector,
  });

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormNewComprador({ ...formNewComprador, [name]: value });
  };

  const handleCarga = () => {
    if (
      !formNewComprador.nombre_empresa ||
      !formNewComprador.contacto_1 ||
      !formNewComprador.cuit_cuil
    ) {
      return Swal.fire({
        title: "Complete los campos necesarios para cargar el nuevo comprador",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
      });
    }

    setLoader(true);

    axios
      .post(url + "cliente/", formNewComprador)
      .then((res) => {
        const nuevo = res.data;
        setLoader(false);
        Swal.fire({
          title: "¡Nuevo comprador cargado con exito!",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
        }).then(() => {
          setCloseModal(false);
          axios(url + `cliente/${idSector}`).then(({ data }) => {
            setCompradores(data);
          });
          setCompradores((prev) => [...prev, nuevo]);
          setForm((prev) => ({ ...prev, id_cliente: 0 }));
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

  const cancelar = () => {
    setCloseModal(false);
    setForm({ ...form, comprador: 0 });
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[380px] sm:w-[500px]">
      <div className="w-full flex justify-between">
        <Titulo text={`NUEVO COMPRADOR`} />
      </div>

      <div className="w-full text-xl flex flex-col space-y-3 mx-auto">
        <div className="flex items-center space-x-4">
          <label className="text-xl font-semibold text-white-bg3">
            Nombre / Empresa<strong className="text-red-400">*</strong>
          </label>
          <input
            onChange={handleForm}
            type="text"
            placeholder="Nombre / Empresa"
            name="nombre_empresa"
            value={formNewComprador.nombre_empresa}
            className="bg-white-bg2 text-black py-2 px-5 grow"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-xl font-semibold text-white-bg3">
            Contacto<strong className="text-red-400">*</strong>
          </label>
          <input
            onChange={handleForm}
            type="text"
            placeholder="+55 9 45000000"
            name="contacto_1"
            value={formNewComprador.contacto_1}
            className="bg-white-bg2 text-black py-2 px-5 grow"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-xl font-semibold text-white-bg3">
            Localidad<strong className="text-red-400">*</strong>
          </label>
          <input
            onChange={handleForm}
            type="text"
            placeholder="Calchín, Córdoba"
            name="localidad"
            value={formNewComprador.localidad}
            className="bg-white-bg2 text-black py-2 px-5 grow"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-xl font-semibold text-white-bg3">
            CUIT/CUIL<strong className="text-red-400">*</strong>
          </label>
          <input
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 11);
              handleForm({ target: { name: "cuit_cuil", value } });
            }}
            type="text"
            placeholder="20-12345678-9"
            name="cuit_cuil"
            value={formNewComprador.cuit_cuil}
            maxLength={11}
            className="bg-white-bg2 text-black py-2 px-5 grow"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-xl font-semibold text-white-bg3">
            Saldo<strong className="text-red-400">*</strong>
          </label>

          <div className="bg-white-bg2 text-black-comun text-xl pl-3 flex items-center space-x-2 w-full">
            <p className="font-bold text-white-bg3">$</p>
            <input
              onChange={handleForm}
              type="number"
              placeholder="Ej: 1000"
              name="saldo"
              value={formNewComprador.saldo}
              className="bg-white-bg2 text-black-comun py-2 pl-3 text-xl grow"
            />
          </div>
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
        <p className="text-white-bg3 w-full">
          - Los campos marcados con<strong className="text-red-400">*</strong>{" "}
          son obligatorios.
        </p>
      </div>
    </div>
  );
};

export default NuevoComprador;
