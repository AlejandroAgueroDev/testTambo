import { useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
//?COMPONENTS
import Titulo from "../../../../common/Titulo";
import { Validation } from "../../../../common/Validation";

const NuevaCuenta = ({ setCloseModal, fetchCuentas }) => {
  const [loader, setLoader] = useState(false);
  const [form, setForm] = useState({
    nombre_cuenta: "",
    alias_cbu: "",
    saldo: "",
  });
  const [errors, setErrors] = useState({});

  const handleForm = (e) => {
    const { name, value } = e.target;
    const errorMsg = Validation(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    setForm({ ...form, [name]: value });
  };

  const handleCarga = async () => {
    if (!form.nombre_cuenta || !form.alias_cbu) {
      return Swal.fire({
        title: `Complete los campos necesarios para crear la nueva cuenta`,
        confirmButtonText: "Aceptar",
        icon: "warning",
        confirmButtonColor: "#D64747",
        iconColor: "#D64747",
      });
    }

    try {
      setLoader(true);
      await axios.post(`${url}cuenta`, {
        ...form,
        saldo: Number(form.saldo),
      });

      Swal.fire({
        title: `Cuenta creada con éxito!`,
        confirmButtonText: "Aceptar",
        icon: "success",
        confirmButtonColor: "#86C394",
        iconColor: "#86C394",
      }).then(() => {
        fetchCuentas();
        setCloseModal(false);
      });
    } catch (error) {
      console.error("Error al crear la cuenta", error);
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
    <div className="flex flex-col space-y-2 items-start w-full font-NS">
      <div className="w-full flex justify-between">
        <Titulo text="NUEVA CUENTA" />
      </div>

      <div className="w-full space-y-3">
        <div className="containerInput">
          <label className="labelInput">
            Nombre del propietario<strong className="text-red-400">*</strong>
          </label>
          <Tippy
            content={errors.nombre_cuenta || ""}
            visible={!!errors.nombre_cuenta}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <input
              placeholder="Nombre del propietario"
              type="text"
              onChange={handleForm}
              name="nombre_cuenta"
              className={`input ${
                errors.nombre_cuenta ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Tippy>
        </div>

        <div className="containerInput">
          <label className="labelInput">
            CBU o ALIAS <strong className="text-red-400">*</strong>
          </label>
          <input
            placeholder="Alias / CBU / ..."
            type="text"
            onChange={handleForm}
            name="alias_cbu"
            className="input"
          />
        </div>

        <div className="containerInput">
          <label className="labelInput">Saldo inicial</label>
          <div className="bg-white-bg2 text-black-comun pl-3 text-xl w-full flex items-center space-x-2">
            <p className="text-xl text-white-bg3">$</p>
            <input
              value={form.saldo || ""}
              placeholder="Ej: 1000"
              type="number"
              onChange={handleForm}
              name="saldo"
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
              className="input"
            />
          </div>
        </div>
      </div>

      {/* botones */}
      <div className="w-full flex justify-end space-x-3 pt-2">
        <button onClick={cancelar} className="boton_rojo">
          CANCELAR
        </button>
        <button onClick={handleCarga} className="boton_verde">
          {loader ? (
            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
          ) : (
            "CREAR CUENTA"
          )}
        </button>
      </div>
    </div>
  );
};

export default NuevaCuenta;
