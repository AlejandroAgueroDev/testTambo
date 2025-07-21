import Titulo from "../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";

const EditarCuenta = ({ setCloseModal, data, fetchCuentas }) => {
  const [loader, setLoader] = useState(false);
  const [form, setForm] = useState(data);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCarga = async () => {
    if (!form.nombre_cuenta || !form.alias_cbu) {
      Swal.fire({
        title: "Error",
        text: "Nombre y CBU/ALIAS son campos obligatorios",
        icon: "error",
      });
      return;
    }

    setLoader(true);
    try {
      const response = await axios.put(`${url}cuenta`, {
        id: form.id,
        nombre_cuenta: form.nombre_cuenta,
        alias_cbu: form.alias_cbu,
        saldo: form.saldo,
      });

      if (response.data.message) {
        Swal.fire({
          title: `Cuenta editada con éxito!`,
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
          iconColor: "#86C394",
        });

        await fetchCuentas();

        setCloseModal(false);
      }
    } catch (error) {
      console.error("Error al actualizar la cuenta:", error);
      Swal.fire({
        title: `Error al crear la cuenta`,
        text: error.response?.data?.message || "Algo salió mal",
        confirmButtonText: "Aceptar",
        icon: "error",
        confirmButtonColor: "#D64747",
        iconColor: "#D64747",
      });
    } finally {
      setLoader(false);
    }
  };

  const cancelar = () => {
    setCloseModal(false);
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[380px] sm:w-[500px]">
      <div className="w-full flex justify-between">
        <Titulo text="EDITAR DATOS DE CUENTA" />
      </div>

      <div className="w-full space-y-3">
        <div className="containerInput">
          <label className="labelInput block mb-1">
            Nombre del propietario<strong className="text-red-400">*</strong>
          </label>
          <input
            placeholder="Nombre del propietario"
            type="text"
            onChange={handleForm}
            value={form.nombre_cuenta}
            name="nombre_cuenta"
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput block mb-1">
            CBU o ALIAS <strong className="text-red-400">*</strong>
          </label>
          <input
            placeholder="Alias / CBU / ..."
            type="text"
            value={form.alias_cbu}
            onChange={handleForm}
            name="alias_cbu"
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput block mb-1">Saldo inicial</label>
          <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow w-full">
            <p className="text-xl text-white-bg3">$</p>
            <input
              value={form.saldo}
              type="number"
              onChange={handleForm}
              name="saldo"
              className="input"
            />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end space-x-3 pt-2">
        <button onClick={cancelar} className="boton_rojo">
          CANCELAR
        </button>
        <button onClick={handleCarga} className="boton_verde">
          {loader ? (
            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
          ) : (
            "EDITAR"
          )}
        </button>
      </div>
    </div>
  );
};

export default EditarCuenta;
