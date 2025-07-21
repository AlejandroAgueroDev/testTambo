import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
//?Componentes
import Modal from "../../../../common/Modal";
import ContenedorGeneral from "../../../../common/ContenedorGeneral";
import Titulo from "../../../../common/Titulo";
import CargarInsumo from "../../../tambo/components/insumos/CargarInsumo";

const VistaDataInsumo = () => {
  const location = useLocation();
  const insumo = location.state?.insumo;
  const [showModal, setShowModal] = useState(false);
  const [editableInsumo, setEditableInsumo] = useState(insumo);
  const [tempInsumo, setTempInsumo] = useState(insumo);
  const navigate = useNavigate();

  if (!insumo) {
    return (
      <ContenedorGeneral navText="FABRICA">
        <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
          <Titulo text="INSUMOS | LISTA DE INSUMOS" />
          <Link to="/fabrica/insumos" className="boton_rojo">
            VOLVER
          </Link>
        </div>

        <div className="flex justify-center items-center h-screen">
          <div className="text-center text-red-500 text-xl">
            No se encontró el insumo
          </div>
        </div>
      </ContenedorGeneral>
    );
  }

  // Función para manejar la edición
  const handleEdit = () => {
    setTempInsumo(editableInsumo);
    setShowModal(true);
  };

  // Función para manejar los cambios en los inputs editables
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempInsumo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //?DELETE de insumo
  const handleDelete = async (id, nombre, id_sector) => {
    
    const result = await Swal.fire({
      title: `¿Estás seguro de eliminar el insumo ${nombre}?`,
      text: "Si se elimina, se perderán todos los registros de este insumo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      confirmButtonColor: "#D64747",
      iconColor: "#D64747",
    });
  
    if (result.isConfirmed) {
      try {
        // Realiza la eliminación en el servidor
        const { data } = await axios.delete(`${url}insumo?id_sector=${id_sector}&id=${id}`);
  
        // Muestra un mensaje de éxito
        Swal.fire({
          title: "Insumo eliminado",
          icon: "success",
          iconColor: "#86C394",
          confirmButtonColor: "#86C394",
        }).then(() => navigate("/fabrica/insumos/FabricaQueso"));
      } catch (error) {
        console.error("Error al eliminar el insumo:", error);
        Swal.fire({
          title: "Error al eliminar",
          text: "Ocurrió un error al intentar eliminar el insumo.",
          icon: "error",
          confirmButtonColor: "#D64747",
        });
        console.error(error);
      }
    }
  };

  return (
    <ContenedorGeneral navText="INSUMOS">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text={`INSUMO | ${insumo.nombre}`} />
        <Link to="/fabrica/insumos/FabricaQueso" className="boton_rojo">
          VOLVER
        </Link>
      </div>

      <div className="flex flex-wrap justify-center items-end p-2 space-x-3">
        <div className="flex flex-wrap space-x-3 justify-center">
          <div className="flex flex-col mb-4 ml-3">
            <label className="text-xl font-semibold text-white-bg3">
              Nombre:
            </label>
            <input
              type="text"
              name="nombre"
              value={editableInsumo.nombre}
              readOnly={!showModal}
              disabled
              onChange={handleInputChange}
              className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="text-xl font-semibold text-white-bg3">
              Proveedor:
            </label>
            <input
              type="text"
              name="proveedor"
              value={editableInsumo.Proveedors[0]?.nombre || "Desconocido"}
              readOnly={!showModal}
              disabled
              onChange={handleInputChange}
              className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="text-xl font-semibold text-white-bg3">
              Stock:
            </label>
            <input
              type="text"
              name="stock"
              value={editableInsumo.stock}
              readOnly={!showModal}
              disabled
              onChange={handleInputChange}
              className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="text-xl font-semibold text-white-bg3">
              Fecha Último Ingreso:
            </label>
            <input
              type="text"
              name="fechaIngreso"
              value={editableInsumo.fechaIngreso}
              readOnly={!showModal}
              disabled
              onChange={handleInputChange}
              className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="text-xl font-semibold text-white-bg3">
              Precio:
            </label>
            <input
              type="text"
              name="precio"
              value={editableInsumo.precio}
              readOnly={!showModal}
              disabled
              onChange={handleInputChange}
              className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
            />
          </div>
        </div>
        {/* Botones */}
        <div className="flex justify-center h-12 space-x-3 mb-4">
          <button
            onClick={handleEdit}
            className="hover:bg-button-green_hover bg-button-green text-white-bg text-xl cursor-pointer w-12"
          >
            <MdEdit className="mx-auto" />
          </button>

          <button
            onClick={() => handleDelete(insumo.id, insumo.nombre, insumo.id_sector)}
            className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-12"
          >
            <MdDelete className="mx-auto" />
          </button>
        </div>
      </div>

      {/* Modal de Edición */}
      {showModal && (
        <Modal>
          <CargarInsumo
            setCloseModal={setShowModal}
            data={editableInsumo}
            isEditMode={true}
          />
        </Modal>
      )}
    </ContenedorGeneral>
  );
};

export default VistaDataInsumo;