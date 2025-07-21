import { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import Titulo from "../../../common/Titulo";
import axios from "axios";
import { url } from "../../../common/URL_SERVER";
import Swal from "sweetalert2";

const EditarServicio = ({
  servicio,
  closeModal,
  servicioEventual,
  fetchCasas,
}) => {
  const [nombre, setNombre] = useState(servicio.nombre_servicio);
  const [cuotas, setCuotas] = useState(servicio.cuotas || 1);
  const [loading, setLoading] = useState(false);

  const handleFormEdit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const servicioData = {
      nombre,
      cuotas: servicioEventual ? Number(cuotas) : null,
      id: servicio.id,
    };
    try {
      await axios.put(`${url}casa/compromiso`, servicioData);
      setLoading(false);

      const result = await Swal.fire({
        title: "¡Datos del servicio actualizados correctamente!",
        confirmButtonText: "Aceptar",
        icon: "success",
        iconColor: "#86C394",
        confirmButtonColor: "#86C394",
      });

      if (result.isConfirmed) {
        fetchCasas();
        closeModal();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error al editar el servicio:", error);
      console.error("Detalles del error:", error.response?.data);
      Swal.fire({
        title: "Ocurrió un error inesperado, intente nuevamente",
        text:
          error.message === "Network Error"
            ? "Contacte con el servicio técnico"
            : error.response?.data?.message,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "error",
      });
    }

    setTimeout(() => {
      setLoading(false);
      closeModal();
    }, 1000);
  };

  return (
    <div>
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0 mb-3">
        <Titulo
          text={
            servicioEventual ? "EDITAR SERVICIO EVENTUAL" : "EDITAR SERVICIO"
          }
        />
      </div>

      <form
        onSubmit={handleFormEdit}
        className="flex flex-col space-y-4 overflow-y-auto max-h-[70dvh]"
      >
        <div className="containerInput">
          <label className="labelInput">Nombre del Servicio</label>
          <input
            type="text"
            placeholder="Ej: Reparación de piso"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input"
          />
        </div>

        {servicioEventual && (
          <div className="containerInput">
            <label className="labelInput">Cantidad de Cuotas</label>
            <input
              type="number"
              min="1"
              className="input"
              value={cuotas}
              onChange={(e) => setCuotas(e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-4">
          <button type="button" onClick={closeModal} className="boton_rojo">
            CANCELAR
          </button>
          <button type="submit" className="boton_verde">
            {loading ? (
              <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
            ) : (
              "MODIFICAR"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarServicio;
