import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
//?COMPONENTS
import { url } from "../../../../common/URL_SERVER";
import Titulo from "../../../../common/Titulo";
import { Validation } from "../../../../common/Validation";

const AddMovimientos = ({
  setCloseModal,
  arrayNombreRollos,
  setMovimientos,
  setContadores,
  setArrayTipos,
}) => {
  const [loader, setLoader] = useState(false);
  const [formMov, setFormMov] = useState({
    archivo: "",
    nombre: "",
    cantidad: "",
    tipo_movimiento: "",
  });
  const [errors, setErrors] = useState({});

  const handleSelectFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        setFormMov({ ...formMov, archivo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormMov = (e) => {
    const { name, value } = e.target;

    const errorMsg = Validation(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));

    if (name === "cantidad" && (value === "0" || value === 0)) {
      return;
    }

    setFormMov((prev) => ({
      ...prev,
      [name]: name === "cantidad" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleCargar = () => {
    if (!formMov.nombre || !formMov.cantidad || !formMov.tipo_movimiento) {
      setErrors({});
      return Swal.fire({
        title: "Complete los campos necesarios para cargar el movimiento.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
        iconColor: "#D64747",
      });
    }

    setLoader(true);
    axios
      .post(url + "agricultura/movimiento-rollo", {
        ...formMov,
        rollos_afectados: [
          { tipo: formMov.nombre, cantidad: formMov.cantidad },
        ],
      })
      .then((res) => {
        setLoader(false);
        Swal.fire({
          title: "Movimiento cargado con éxito",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
          iconColor: "#86C394",
        }).then(() => {
          Promise.all([
            axios(url + "agricultura/movimiento-rollo"),
            axios(url + "agricultura/rollo"),
          ]).then(([{ data: movimientos }, { data: rollos }]) => {
            const dataFormat = movimientos.map((d) => ({
              ...d,
              fechaFormt: d.fecha.split("T")[0].split("-").reverse().join("/"),
            }));
            setMovimientos(dataFormat.reverse());
            setContadores(rollos);
            const arrayTiposNombre = rollos.map((d) => d.tipo);
            setArrayTipos(arrayTiposNombre);
            setCloseModal(false);
          });
        });
      })
      .catch((error) => {
        setLoader(false);
        setErrors({});
        Swal.fire({
          title: "Ocurrió un error inesperado, intente nuevamente",
          text:
            error.message === "Network Error"
              ? "Contacte con el servicio técnico"
              : error.message || "Error desconocido",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#D64747",
          icon: "error",
          iconColor: "#D64747",
        });
      });
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[380px] sm:[560px]">
      <div className="w-full flex justify-between">
        <Titulo text="NUEVO MOVIMIENTO O ACLARACION" />
      </div>

      <div className="w-full space-y-3">
        <div>
          <label className="text-xl font-semibold text-white-bg3">
            Adjuntar documento (solo imagen)
          </label>
          <input
            onChange={handleSelectFile}
            type="file"
            name="documento"
            className="bg-white-bg2 text-black-comun p-[5px] text-xl w-full cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xl font-semibold text-white-bg3">
            Tipo de movimiento <strong className="text-red-400">*</strong>
          </label>
          <select
            onChange={(e) =>
              setFormMov({ ...formMov, tipo_movimiento: e.target.value })
            }
            className="bg-white-bg2 text-black-comun py-2 px-2 text-xl w-full"
          >
            <option selected disabled>
              Seleccionar tipo
            </option>
            <option value="VENTA">Venta</option>
            <option value="CONSUMO">Consumo</option>
            <option value="INGRESO">Ingreso</option>
            <option value="ELIMINARON">Eliminaron</option>
          </select>
        </div>

        <div>
          <label className="text-xl font-semibold text-white-bg3">
            Tipo de rollo <strong className="text-red-400">*</strong>
          </label>
          <select
            onChange={(e) => setFormMov({ ...formMov, nombre: e.target.value })}
            className="bg-white-bg2 text-black-comun py-2 px-2 text-xl w-full"
          >
            <option selected disabled>
              Seleccionar tipo
            </option>
            {arrayNombreRollos.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xl font-semibold text-white-bg3">
            Cantidad de rollos afectados{" "}
            <strong className="text-red-400">*</strong>
          </label>
          <Tippy
            content={errors.cantidad || ""}
            visible={!!errors.cantidad}
            placement="top-end"
            arrow
            theme="custom"
          >
            <input
              type="number"
              name="cantidad"
              value={formMov.cantidad}
              onChange={handleFormMov}
              onKeyDown={(e) =>
                ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
              }
              className={`input ${
                errors.cantidad ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: 500"
            />
          </Tippy>
        </div>

        <div className="w-full flex justify-end space-x-3">
          <button onClick={() => setCloseModal(false)} className="boton_rojo">
            CANCELAR
          </button>
          <button onClick={handleCargar} className="boton_verde">
            {loader ? (
              <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
            ) : (
              "AÑADIR"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMovimientos;
