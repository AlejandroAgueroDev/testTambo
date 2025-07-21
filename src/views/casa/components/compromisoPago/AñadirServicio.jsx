import { useState } from "react";
import Titulo from "../../../../common/Titulo";
import { url } from "../../../../common/URL_SERVER";
import axios from "axios";
import Swal from "sweetalert2";

const AñadirServicio = ({
  closeModal,
  idPropietario,
  fetchCasas,
  setSelectedCasa,
}) => {
  const [nombreServicio, setNombreServicio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nombreServicio) {
      Swal.fire({
        title: "No puedes dejar campos vacios",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
      return;
    }

    setLoading(true);

    const nuevoServicio = {
      nombre_servicio: nombreServicio,
      fecha: new Date().toISOString(),
      id_propietario: idPropietario,
    };

    //? POST de comprimiso de pago
    try {
      await axios.post(`${url}casa/compromiso`, nuevoServicio);
      Swal.fire({
        title: "Servicio agregado exitosamente",
        confirmButtonText: "Aceptar",
        icon: "success",
        confirmButtonColor: "#86C394",
      });

      if (fetchCasas) {
        const casasActualizadas = await fetchCasas();
        const casaActualizada = casasActualizadas.find(
          (c) => c.id === idPropietario
        );
        if (casaActualizada && setSelectedCasa) {
          setSelectedCasa(casaActualizada);
        }
      }

      closeModal();
    } catch (error) {
      console.error("Error al añadir el servicio:", error);
      Swal.fire({
        title: "Error al añadir servicio",
        text: error.response?.data?.message || "Error desconocido",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 items-start">
      <Titulo text="AÑADIR SERVICIO" />

      <div className="text-xl flex flex-col mx-auto space-y-3 w-full">
        <div className="containerInput">
          <label className="labelInput">Nombre del Servicio</label>
          <input
            placeholder="Ej: Luz, Agua, etc."
            type="text"
            className="input"
            value={nombreServicio}
            onChange={(e) => setNombreServicio(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-3 pt-5">
          <button
            className="boton_rojo"
            onClick={closeModal}
            disabled={loading}
          >
            CANCELAR
          </button>
          <button
            className="boton_verde"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "AÑADIENDO..." : "AÑADIR"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AñadirServicio;
