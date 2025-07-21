import Titulo from "../../../common/Titulo";
import axios from "axios";
import { url } from "../../../common/URL_SERVER";
import Swal from "sweetalert2";

const PropietarioCasa = ({
  casas,
  selectedCasa,
  setSelectedCasa,
  openEditModal,
  fetchCasas,
}) => {
  const handleChange = (event) => {
    const casaSeleccionada = casas.find(
      (casa) => casa.nombre === event.target.value
    );
    setSelectedCasa(casaSeleccionada);
  };

  const handleDelete = async () => {
    if (!selectedCasa) return;

    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Vas a eliminar la casa "${selectedCasa.nombre}". Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D64747",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await axios.delete(`${url}casa/propietario/${selectedCasa.id}`);
        Swal.fire({
          title: "Eliminado",
          text: "El propietario ha sido eliminado con éxito.",
          icon: "success",
          confirmButtonColor: "#28a745",
        });

        setSelectedCasa(null);
        fetchCasas();
      } catch (error) {
        console.error("Error al eliminar la casa:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el propietario.",
          icon: "error",
          confirmButtonColor: "#D64747",
        });
      }
    }
  };

  return (
    <div className="w-full md:w-[45%] flex flex-col items-center space-y-4 pt-4 xl:px-4 xl:pt-2 bg-white-bg h-full">
      <Titulo text="DATOS DE LOS PROPIETARIOS" />

      {/* Selector de propietarios */}
      <select
        onChange={handleChange}
        className="bg-white-bg2 text-black-comun py-2 px-4 text-xl w-full"
        value={selectedCasa ? selectedCasa.nombre : ""}
      >
        <option value="" disabled>
          SELECCIONAR PROPIETARIO
        </option>
        {casas.map((casa, index) => (
          <option key={index} value={casa.nombre}>
            {casa.nombre}
          </option>
        ))}
      </select>

      {/* Datos del propietario */}
      <div className="text-xl flex flex-col mx-auto space-y-2 w-full">
        <label className="text-xl font-semibold text-white-bg3">
          Localidad:
        </label>
        <input
          type="text"
          disabled
          placeholder="Esperando selección..."
          value={selectedCasa?.localidad ?? ""}
          className="bg-white-bg2 text-black-comun py-1 px-5 text-xl w-full"
          readOnly
        />
        <label className="text-xl font-semibold text-white-bg3">
          Teléfono:
        </label>
        <input
          type="text"
          disabled
          placeholder="Esperando selección..."
          value={selectedCasa?.contacto_1 ?? ""}
          className="bg-white-bg2 text-black-comun py-1 px-5 text-xl w-full"
          readOnly
        />
      </div>

      {selectedCasa && (
        <div className="flex justify-center space-x-2 mt-4 w-full">
          <button className="boton_rojo" onClick={handleDelete}>
            ELIMINAR PROPIETARIO
          </button>
          <button className="boton_verde" onClick={openEditModal}>
            EDITAR PROPIETARIO
          </button>
        </div>
      )}
    </div>
  );
};

export default PropietarioCasa;
