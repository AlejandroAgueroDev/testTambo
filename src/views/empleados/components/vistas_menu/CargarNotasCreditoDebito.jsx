import { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import Titulo from "../../../../common/Titulo";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Validation } from "../../../../common/Validation";

const CargarNotasCreditoDebito = ({
  closeModal,
  id_afectado,
  fetchEmpleados,
}) => {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    tipo_destinatario: "EMPLEADO",
    descripcion: "",
    importe: "",
    fecha_emision: new Date().toISOString(), // ✅ corregido
    id_afectado: id_afectado,
  });

  const [errors, setErrors] = useState({});

  const handleChangeForm = (e) => {
    const { value, name } = e.target;
    const errorMsg = Validation(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    setFormData({ ...formData, [name]: value });
  };

  const handleSelectedTipo = (e) => {
    if (formData.tipo === e.target.value) return;
    setFormData({ ...formData, tipo: e.target.value });
  };

  const cargarNota = async () => {
    if (!formData.tipo || !formData.importe) {
      return Swal.fire({
        title:
          "Completa los datos para cargar la Nota de Credito o Nota de Debito",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }
    setLoader(true);

    const resNotas = await axios(`${url}empleado/nota/todo`);

    const dataParaEnviar = {
      ...formData,
      descripcion: `Nota de ${formData.tipo.toLowerCase()} N°${
        resNotas.data.length + 1
      } | ${formData.descripcion}`,
    };

    axios
      .post(`${url}empleado/nota/`, dataParaEnviar)
      .then((res) => {
        setLoader(false);
        Swal.fire({
          title: `Nota de ${formData.tipo.toLowerCase()} creada con exito`,
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
        }).then(() => {
          fetchEmpleados();
          closeModal(false);
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
              : error.response.data.message,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#D64747",
          icon: "error",
        });
      });
  };

  return (
    <div className="flex flex-col space-y-2 items-start mx-5 md:mx-0">
      <div className="w-full flex justify-between">
        <Titulo text="NOTA DE CREDITO/DEBITO" />
      </div>

      <div className="space-y-3">
        <div className="flex flex-col">
          <label className="labelInput">Tipo</label>
          <div className="flex space-x-5 mx-auto">
            <button
              onClick={handleSelectedTipo}
              type="button"
              value="CREDITO"
              className={`${
                formData.tipo === "CREDITO"
                  ? "bg-button-green"
                  : "bg-white-bg2 hover:bg-[#cbcbcb]"
              } text-black py-2 px-5 font-semibold`}
            >
              NOTA DE CREDITO
            </button>
            <button
              onClick={handleSelectedTipo}
              type="button"
              value="DEBITO"
              className={`${
                formData.tipo === "DEBITO"
                  ? "bg-button-green"
                  : "bg-white-bg2 hover:bg-[#cbcbcb]"
              } text-black py-2 px-5 font-semibold`}
            >
              NOTA DE DEBITO
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="labelInput">Descripcion</label>
          <textarea
            onChange={handleChangeForm}
            placeholder="Descripcion de la nota de credito o nota de debito."
            name="descripcion"
            cols="30"
            rows="10"
            className="bg-white-bg2 text-black py-2 px-5 text-lg min-h-[100px] max-h-[100px] w-full sm:w-[400px]"
          ></textarea>
        </div>

        <div className="flex flex-col">
          <label className="labelInput">Importe</label>
          <Tippy
            content={errors.importe || ""}
            visible={!!errors.importe}
            placement="top-end"
            arrow={true}
            theme="custom"
          >
            <div className="bg-white-bg2 text-black pl-5 flex items-center space-x-2">
              <p className="text-white-bg3 text-xl font-semibold">$</p>
              <input
                onChange={handleChangeForm}
                type="number"
                name="importe"
                className={`input ${
                  errors.efectivo ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: 1000"
              />
            </div>
          </Tippy>
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={() => closeModal(false)} className="boton_rojo">
            CANCELAR
          </button>
          <button onClick={cargarNota} className="boton_verde">
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

export default CargarNotasCreditoDebito;
