import { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import { obtenerFechaActual } from "../../../../common/obtenerFecha";
import SeleccionarAnimales from "./SeleccionarAnimales";
import Modal from "../../../../common/Modal";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";

const CargarComprolVeterinario = () => {
  const [formProduccion, setFormProduccion] = useState({
    fecha: "",
    fecha_carga: "",
    hora_carga: "",
    detalle: "",
    veterinario: "",
    actaBase64: "",
  });
  const [animales, setAnimales] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showSeleccionar, setShowSeleccionar] = useState(false);

  const handleChangeForm = (e) => {
    const p = e.target.name;
    const v = e.target.value;

    setFormProduccion({ ...formProduccion, [p]: v });
  };

  const handleCancel = () => {
    setFormProduccion({
      fecha: "",
      fecha_carga: "",
      hora_carga: "",
      detalle: "",
      veterinario: "",
      actaBase64: "",
    });
  };

  useEffect(() => {
    // console.log(formProduccion);
  }, [formProduccion]);

  const handleSubmit = (e) => {
    if (
      !formProduccion.fecha ||
      !formProduccion.veterinario ||
      !animales.length
    ) {
      return Swal.fire({
        title: "Complete los campos necesarios para cargar el control",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
        iconColor: "#D64747",
      });
    }
    e.preventDefault();
    const formSub = {
      ...formProduccion,
      fecha_carga: obtenerFechaActual("fecha"),
      hora_carga: obtenerFechaActual("hora"),
      arrayCaravanas: animales,
    };
    setLoader(true);
    axios
      .post(url + "tambo/controlveterinario/upload", formSub)
      .then((res) => {
        setLoader(false);
        Swal.fire({
          title: "Control cargado con éxito",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
        }).then(() => window.location.reload());
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

  const handleSelectFile = (event) => {
    const file = event.target.files[0]; // Toma el primer archivo seleccionado
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        setFormProduccion({ ...formProduccion, actaBase64: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 pt-2 xl:px-2 xl:pt-1 bg-white-bg h-full scrollbar lg:overflow-auto">
      <div className="flex w-full">
        <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">
          CARGAR CONTROL
        </h2>
      </div>

      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">
          Fecha <strong className="text-red-400">*</strong>
        </label>
        <input
          onChange={handleChangeForm}
          type="date"
          value={formProduccion.fecha}
          name="fecha"
          className="bg-white-bg2 text-black-comun py-2 px-5 text-xl w-full"
        />
      </div>

      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">
          Nombre de veterinario <strong className="text-red-400">*</strong>
        </label>
        <input
          onChange={handleChangeForm}
          placeholder="Nombre del veterinario"
          type="text"
          value={formProduccion.veterinario}
          name="veterinario"
          className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
        />
      </div>

      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">
          Aclaraciones
        </label>
        <textarea
          onChange={handleChangeForm}
          placeholder="Aclaraciones sobre esta producción"
          type="number"
          value={formProduccion.detalle}
          name="detalle"
          className="bg-white-bg2 text-black-comun py-2 px-5 text-xl max-h-20 min-h-20"
        />
      </div>

      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">
          Animales afectados <strong className="text-red-400">*</strong>
        </label>
        <div className="bg-white-bg2 text-black-comun p-2 flex text-lg max-h-20  flex-wrap scrollbar overflow-auto">
          {animales.length ? (
            animales.map((a, index) => (
              <p className="px-1">
                {a}
                {animales.length === index + 1 ? "" : ","}
              </p>
            ))
          ) : (
            <p>Seleccione los animales afectados</p>
          )}
        </div>
        <div className="w-full flex pt-2">
          <button
            onClick={() => setShowSeleccionar(true)}
            className="boton_verde"
          >
            SELECCIONAR ANIMALES
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <label className="text-xl font-semibold text-white-bg3">
          Acta emitida por el veterinario
        </label>
        <input
          onChange={handleSelectFile}
          type="file"
          // name="actaBase64"
          className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
        />
      </div>

      <p className="text-white-bg3 w-full">
        - Los campos marcados con <strong className="text-red-400">*</strong>{" "}
        son oblicatorios para cargar la producción.
      </p>

      <div className="space-x-2 flex justify-end w-full">
        <button onClick={handleCancel} className="boton_rojo">
          CANCELAR
        </button>
        <button onClick={handleSubmit} className="boton_verde w-32">
          {loader ? (
            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
          ) : (
            "CARGAR"
          )}
        </button>
      </div>

      {showSeleccionar ? (
        <Modal>
          <SeleccionarAnimales
            setCloseModal={setShowSeleccionar}
            setAnimales={setAnimales}
            animales={animales}
          />
        </Modal>
      ) : null}
    </div>
  );
};

export default CargarComprolVeterinario;
