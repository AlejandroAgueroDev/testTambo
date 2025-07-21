import { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import Titulo from "../../../../common/Titulo";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";

const CargarNotasCreditoDebito = ({
  setCloseModal,
  tipo_destinatario,
  id_afectado,
  fetch,
}) => {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    tipo_destinatario: tipo_destinatario,
    detalle: "",
    importe: 0,
    fecha_emision: new Date().toISOString(),
    id_afectado: id_afectado,
  });

  const handleChangeForm = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSelectedTipo = (e) => {
    if (formData.tipo === e.target.value) return;
    setFormData({ ...formData, tipo: e.target.value });
  };

  const cargarNota = async () => {
    if (!formData.tipo || !formData.importe) {
      return Swal.fire({
        title: "Competa los datos para agregar el efectivo",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

    const resNotas = await axios(url + "cliente/nota/todo");

    const dataParaEnviar = {
      ...formData,
      descripcion: `Nota de ${formData.tipo.toLowerCase()} N°${
        resNotas.data.length + 1
      } | ${formData.detalle}`,
    };

    setLoader(true);
    axios
      .post(url + "cliente/nota", dataParaEnviar)
      .then((res) => {
        setLoader(false);
        Swal.fire({
          title: `Nota de ${formData.tipo.toLowerCase()} creada con exito`,
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
        }).then(() => {
          fetch();
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
              : error.response.data.message,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#D64747",
          icon: "error",
        });
      });
  };

  return (
    <div className="flex flex-col space-y-2 items-start">
      <div className="w-full flex justify-between">
        <Titulo text="NOTA DE CREDITO/DEBITO" />
      </div>

      <div className="space-y-3">
        <div className="flex flex-col">
          <label className="labelInput">
            Tipo<strong className="text-red-400">*</strong>
          </label>
          <div className="flex space-x-5 mx-auto">
            <button
              onClick={handleSelectedTipo}
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
          <label className="labelInput">
            Detalle<strong className="text-red-400">*</strong>
          </label>
          <textarea
            onChange={handleChangeForm}
            name="detalle"
            cols="30"
            rows="10"
            placeholder="Detalle de la nota."
            className="bg-white-bg2 text-black py-2 px-5 text-lg min-h-[100px] max-h-[100px] w-[460px]"
          ></textarea>
        </div>

        <div className="flex flex-col">
          <label className="labelInput">
            Importe<strong className="text-red-400">*</strong>
          </label>
          <div className="bg-white-bg2 text-black pl-5 flex items-center space-x-2">
            <p className="text-white-bg3 text-xl font-semibold">$</p>
            <input
              onChange={handleChangeForm}
              type="number"
              name="importe"
              placeholder="Ej: 1000"
              className="input"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={() => setCloseModal(false)} className="boton_rojo">
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
        <p className="text-white-bg3 w-full">
          - Los campos marcados con<strong className="text-red-400">*</strong>{" "}
          son obligatorios.
        </p>
      </div>
    </div>
  );
};

export default CargarNotasCreditoDebito;
