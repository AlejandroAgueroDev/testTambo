import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import MenuClienteTambo from "./MenuCliente";
import BarraSeparadora from "../../../../common/BarraSeparadora";
import ContenedorGeneral from "../../../../common/ContenedorGeneral";
import Titulo from "../../../../common/Titulo";
import LoaderModal from "../../../../common/LoaderModal";
import EditarCliente from "../../../clientes/components/clientes/EditarCliente";
import Modal from "../../../../common/Modal";
import TablaRetirosComprador from "./TablaRetiros";

const CompradoresDetalle = () => {
  const nav = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editableCliente, setEditableCliente] = useState({}); // Estado para almacenar los datos del cliente que se pueden editar
  const [tempCliente, setTempCliente] = useState({}); // Estado temporal para almacenar los cambios realizados en el formulario de edición
  const [loader, setLoader] = useState(false);
  const [cliente, setCliente] = useState({});
  const [loaderDatos, setLoaderDatos] = useState(true);
  const [loaderDatosError, setLoaderDatosError] = useState(false);
  const { id } = useParams();

  //?GET clientes
  const fetchCliente = async (sector_id) => {
    try {
      const { data } = await axios.get(
        `${url}cliente/${sector_id}?id_cliente=${id}`
      );
      setCliente(data);
      setEditableCliente(data);
      setTempCliente(data);

      setLoaderDatos(false);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      setLoaderDatosError(true);
    }
  };

  //?GET sector
  const fetchSector = async () => {
    try {
      const { data } = await axios.get(`${url}sector`);
      data.map((sector) => {
        if (sector.nombre === "Tambos") {
          fetchCliente(sector.id);
        }
      });
    } catch (error) {
      console.error("Error al obtener sector:", error);
    }
  };
  useEffect(() => {
    fetchSector();
  }, []);

  const handleEdit = () => {
    setTempCliente(editableCliente);
    setShowModal(true);
  };

  const handleSave = async () => {
    setLoader(true);
    try {
      await axios.put(`${url}cliente`, tempCliente);
      setEditableCliente(tempCliente);
      setShowModal(false);
      Swal.fire({
        title: "¡Cliente actualizado con éxito!",
        confirmButtonText: "Aceptar",
        icon: "success",
        confirmButtonColor: "#86C394",
      });
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      Swal.fire({
        title: "Error al actualizar cliente",
        text: error.message,
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
      });
    } finally {
      setLoader(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempCliente((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDelete = () => {
    Swal.fire({
      title: `¿Quieres eliminar el cliente "${cliente.nombre_empresa}" definitivamente?`,
      showDenyButton: true,
      confirmButtonText: "Sí",
      denyButtonText: "No",
      confirmButtonColor: "#86C394",
      denyButtonColor: "#D64747",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}cliente/${cliente.id}`);
          Swal.fire({
            title: "Cliente eliminado",
            confirmButtonText: "Aceptar",
            icon: "success",
            confirmButtonColor: "#86C394",
          }).then(() => {
            nav("/tambo/compradores-leche");
          });
        } catch (error) {
          console.error("Error al eliminar cliente:", error);
          Swal.fire({
            title: "Error al eliminar cliente",
            text: error.message,
            icon: "error",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#D64747",
          });
        }
      }
    });
  };

  return (
    <ContenedorGeneral navText="TAMBO">
      <div className="h-full">
        <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
          <Titulo text={`CLIENTE | ${cliente.nombre_empresa}`} />
          <Link to={`/tambo/compradores-leche`} className="boton_rojo">
            VOLVER
          </Link>
        </div>
        <div className="flex flex-wrap justify-center p-2 space-x-3 scrollbar overflow-y-auto max-h-[200px]">
          <div className="flex flex-wrap space-x-3 justify-center">
            <div className="flex flex-col mb-4">
              <label className="labelInput">Nombre / Empresa:</label>
              <input
                type="text"
                name="nombre_empresa"
                value={editableCliente.nombre_empresa || ""}
                readOnly={!showModal}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="labelInput">Contacto:</label>
              <input
                type="text"
                name="contacto_1"
                value={editableCliente.contacto_1 || ""}
                readOnly={!showModal}
                onChange={handleInputChange}
                className="input"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label className="labelInput">Localidad:</label>
              <input
                type="text"
                name="contacto_2"
                value={editableCliente.localidad || ""}
                readOnly={!showModal}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="labelInput">CUIT/CUIL:</label>
              <input
                type="text"
                name="cuit_cuil"
                value={editableCliente.cuit_cuil || ""}
                readOnly={!showModal}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            <div className="flex justify-center h-12 space-x-3 mt-6">
              <button
                className="hover:bg-button-green_hover bg-button-green text-white-bg text-xl cursor-pointer w-12 sm:ml-8 ml-0"
                onClick={handleEdit}
              >
                <MdEdit className="mx-auto" />
              </button>
              <button
                className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-12"
                onClick={handleDelete}
              >
                <MdDelete className="mx-auto" />
              </button>
            </div>
          </div>
        </div>

        <BarraSeparadora orientacion="horizontal" />

        <MenuClienteTambo
          dataCliente={cliente}
          fetch={fetchSector}
          sector_titulo={"Tambos"}
          sector_nombre={"CompradoresDeLeche"}
        />

        <BarraSeparadora orientacion="horizontal" />

        <div className="w-full h-auto flex justify-between">
          <TablaRetirosComprador id={id} />
        </div>

        {showModal && (
          <EditarCliente
            tempCliente={tempCliente}
            setShowModal={setShowModal}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            loader={loader}
            isTamboCliente={true}
          />
        )}

        {loaderDatos && (
          <Modal>
            {loaderDatosError ? (
              <div className="w-[400px] flex flex-col space-y-3 justify-center">
                <p className="text-2xl text-black-comun flex flex-col items-center justify-center ">
                  <strong className="text-button-red text-bold">
                    Ocurrio un error inesperado.
                  </strong>{" "}
                  Si el error persiste, llame a servicio técnico.
                </p>
                <div className="flex w-full justify-center">
                  <Link to="/tambo/compradores-leche" className="boton_verde">
                    VOLVER A COMPRADORES
                  </Link>
                </div>
              </div>
            ) : (
              <LoaderModal textLoader={"Cargando datos del cliente"} />
            )}
          </Modal>
        )}
      </div>
    </ContenedorGeneral>
  );
};

export default CompradoresDetalle;
