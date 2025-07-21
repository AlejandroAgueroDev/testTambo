import Titulo from "../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../common/URL_SERVER";
import { MdDelete } from "react-icons/md";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const EditarPolizas = ({ closeModal, poliza, fetchSeguros }) => {
  const [loader, setLoader] = useState(false);
  const isoToInputDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate;
    return date.toISOString().split("T")[0];
  };

  const [formPoliza, setFormPoliza] = useState({
    id: poliza?.id || "",
    nombre: poliza?.nombre || "",
    numero_poliza: poliza?.numero_poliza || "",
    seccion: poliza?.seccion || "",
    desde: poliza?.desde ? isoToInputDate(poliza.desde) : "",
    hasta: poliza?.hasta ? isoToInputDate(poliza.hasta) : "",
    importe: poliza?.importe || "",
    estado: poliza?.estado || "VIGENTE",
    cantidad_cuotas: poliza?.cantidad_cuotas || "",
    afectados: poliza?.afectados || "",
    foto_factura: poliza?.foto_factura || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormPoliza({ ...formPoliza, [name]: value });
  };

  const handleFileChange = ({ target: { files } }) => {
    const file = files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setFormPoliza((s) => ({ ...s, foto_factura: reader.result }));
    reader.readAsDataURL(file);
  };

  const removeImage = () => setFormPoliza((s) => ({ ...s, foto_factura: "" }));

  const handleSubmit = async () => {
    const payload = {
      id: formPoliza.id,
      nombre: formPoliza.nombre,
      numero_poliza: formPoliza.numero_poliza,
      seccion: formPoliza.seccion,
      desde: formPoliza.desde,
      hasta: formPoliza.hasta,
      importe: Number(formPoliza.importe),
      estado: formPoliza.estado,
      cantidad_cuotas: Number(formPoliza.cantidad_cuotas),
      afectados: formPoliza.afectados.trim(),
    };

    // Si la imagen es nueva (data URI) la enviamos
    if (formPoliza.foto_factura.startsWith("data:")) {
      payload.factura_base64 = formPoliza.foto_factura;
    }

    // Si se eliminó la imagen por completo
    if (formPoliza.foto_factura === "") {
      payload.eliminar_foto = true; // maneja esto en backend si lo necesitás
    }

    const requiredFields = [
      "nombre",
      "seccion",
      "desde",
      "hasta",
      "importe",
      "estado",
      "cantidad_cuotas",
      "afectados",
    ];

    const missingFields = requiredFields.filter((field) => !payload[field]);

    if (missingFields.length > 0) {
      Swal.fire({
        title: "Campos incompletos",
        text: `Por favor complete: ${missingFields.join(", ")}`,
        icon: "warning",
        confirmButtonColor: "#D64747",
      });
      return;
    }

    try {
      setLoader(true);

      const { data } = await axios.put(`${url}poliza`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      Swal.fire({
        title: "¡Éxito!",
        text: "Póliza actualizada correctamente",
        icon: "success",
        confirmButtonColor: "#86C394",
      }).then(() => {
        fetchSeguros();
        closeModal();
      });
    } catch (error) {
      console.error("Error al actualizar:", {
        request: error.config?.data,
        response: error.response?.data,
        message: error.message,
      });

      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.error || error.message || "Error al actualizar",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="max-h-[80dvh] flex flex-col">
      <div className="w-full flex justify-between">
        <Titulo text="EDITAR POLIZA" />
      </div>

      <div className="flex-1 scrollbar overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col space-y-2 items-start w-[350px] sm:w-[500px] pr-2">
          <div className="containerInput w-full">
            <label className="labelInput">
              Nombre de Aseguradora<strong className="text-red-400">*</strong>
            </label>
            <input
              type="text"
              name="nombre"
              className="input"
              value={formPoliza.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="containerInput w-full">
            <label className="labelInput">Número de poliza</label>
            <input
              type="text"
              name="numero_poliza"
              className="input"
              value={formPoliza.numero_poliza}
              onChange={handleChange}
              required
            />
          </div>

          <div className="containerInput w-full">
            <label className="labelInput">
              Sección<strong className="text-red-400">*</strong>
            </label>
            <input
              type="text"
              name="seccion"
              className="input"
              value={formPoliza.seccion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="containerInput w-full">
            <label className="labelInput">
              Importe<strong className="text-red-400">*</strong>
            </label>
            <input
              type="number"
              name="importe"
              className="input"
              value={formPoliza.importe}
              onChange={handleChange}
              required
            />
          </div>

          <div className="containerInput w-full">
            <label className="labelInput">
              Cantidad de Cuotas<strong className="text-red-400">*</strong>
            </label>
            <input
              type="number"
              name="cantidad_cuotas"
              className="input"
              value={formPoliza.cantidad_cuotas}
              onChange={handleChange}
              required
            />
          </div>

          <div className="containerInput w-full">
            <label className="labelInput">
              Vigencia Desde<strong className="text-red-400">*</strong>
            </label>
            <input
              type="date"
              name="desde"
              className="input"
              value={formPoliza.desde}
              onChange={handleChange}
              required
            />
          </div>

          <div className="containerInput w-full">
            <label className="labelInput">
              Vigencia Hasta<strong className="text-red-400">*</strong>
            </label>
            <input
              type="date"
              name="hasta"
              className="input"
              value={formPoliza.hasta}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="labelInput">
              Afectados por la Póliza
              <strong className="text-red-400">*</strong>
            </label>
            <textarea
              name="afectados"
              className="input resize-none"
              value={formPoliza.afectados}
              rows={3}
              onChange={handleChange}
              required
              placeholder="Ej: Persona 1, Persona 2, Máquina 1"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="labelInput">Foto de Póliza Actual</label>

            {formPoliza.foto_factura && (
              <div className="mb-2 flex flex-col items-center w-full">
                <div className="max-h-40 overflow-hidden flex justify-center w-full">
                  <img
                    src={formPoliza.foto_factura}
                    alt="Foto de póliza actual"
                    className="max-w-full max-h-full object-contain "
                  />
                </div>
                <Tippy
                  content="Eliminar imagen"
                  placement="left"
                  arrow={true}
                  theme="custom"
                >
                  <button
                    type="button"
                    onClick={removeImage}
                    className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-8 p-1 mt-2"
                  >
                    <MdDelete className="mx-auto" />
                  </button>
                </Tippy>
              </div>
            )}
            <label className="labelInput">Agregar Nueva Imagen</label>
            <input
              type="file"
              accept="image/*"
              className="input"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end space-x-3 pt-3">
        <button type="button" onClick={closeModal} className="boton_rojo">
          CANCELAR
        </button>
        <button
          onClick={handleSubmit}
          className="boton_verde"
          disabled={loader}
        >
          {loader ? (
            <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
          ) : (
            "ACTUALIZAR"
          )}
        </button>
      </div>
      <p className="text-white-bg3 w-full pt-2">
        - Los campos marcados con <strong className="text-red-400">*</strong>{" "}
        son <strong className="text-black-comun underline">obligatorios</strong>
        .
      </p>
    </div>
  );
};

export default EditarPolizas;
