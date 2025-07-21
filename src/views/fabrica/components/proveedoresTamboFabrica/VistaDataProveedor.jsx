import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { url } from "../../../../common/URL_SERVER";
import axios from "axios";
//?Componentes
import Modal from "../../../../common/Modal";
import BarraSeparadora from "../../../../common/BarraSeparadora";
import ContenedorGeneral from "../../../../common/ContenedorGeneral";
import Titulo from "../../../../common/Titulo";
import EditarProveedor from "./EditarProveedor";
import LoaderModal from "../../../../common/LoaderModal";
import TablaRetiros from "./TablaRetiros";
import MenuProveedor from "./MenuProveedor";

const VistaDataProveedorTamboFabrica = () => {
  const [proveedor, setProveedor] = useState({
    nombre_empresa: "",
    contacto_1: "",
    contacto_2: "",
    localidad: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editableProveedor, setEditableProveedor] = useState(proveedor);
  const [tempProveedor, setTempProveedor] = useState(proveedor);
  const [loaderDatos, setLoaderDatos] = useState(true);
  const [loaderDatosError, setLoaderDatosError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [retiros, setRetiros] = useState([]);

  //?GET de proveedores
  const fetchProveedores = async () => {
    try {
      const { data } = await axios.get(`${url}proveedor`);
      const proveedoresArray = Array.isArray(data.tamboProveedor)
        ? data.tamboProveedor
        : [];

      if (id) {
        const proveedorEncontrado = proveedoresArray.find(
          (proveedor) => proveedor.id === id
        );

        if (proveedorEncontrado) {
          setProveedor(proveedorEncontrado);
          setEditableProveedor(proveedorEncontrado);
          setTempProveedor(proveedorEncontrado);
          setLoaderDatos(false);
        }
      }
    } catch (error) {
      console.error("Error al cargar proveedores de tambo:", error);
      setLoaderDatosError(true);
    }
  };

  //?GET retiros
  const fetchRetiros = async (proveedorId) => {
    try {
      const { data } = await axios.get(`${url}fabrica/compraleche`);
      // Filtrar retiros por el ID del proveedor
      const retirosFiltrados = data.filter(
        (retiro) => retiro.id_tambo_proveedor === proveedorId
      );
      setRetiros(retirosFiltrados);
    } catch (error) {
      console.error("Error al cargar retiros:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProveedores();
      fetchRetiros(id);
    }
  }, [id]);

  // Función para manejar la edición
  const handleEdit = () => {
    setTempProveedor(editableProveedor);
    setShowModal(true);
  };

  // Función para manejar los cambios en los inputs editables
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempProveedor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //?DELETE de proveedor
  const handleDelete = async (id, nombre_empresa) => {
    const result = await Swal.fire({
      title: `¿Estás seguro de eliminar al proveedor ${nombre_empresa}?`,
      text: "Si se elimina, se perderán todos los registros de este proveedor.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      confirmButtonColor: "#D64747",
      iconColor: "#D64747",
    });

    if (result.isConfirmed) {
      try {
        //?DELETE de proveedor tambo
        const { data } = await axios.delete(`${url}proveedor/${id}`);
        Swal.fire({
          title: "Proveedor eliminado",
          icon: "success",
          iconColor: "#86C394",
          confirmButtonColor: "#86C394",
        }).then(() => navigate("/fabrica/proveedorTambosFabrica"));
      } catch (error) {
        console.error("Error al eliminar el proveedor:", error);

        Swal.fire({
          title: "Error al eliminar",
          text: "Ocurrió un error al intentar eliminar al proveedor.",
          icon: "error",
          confirmButtonColor: "#D64747",
        });
      }
    }
  };

  return (
    <ContenedorGeneral navText="FABRICA">
      <div className="h-full">
        <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
          <Titulo text={`PROVEEDOR | ${proveedor.nombre_empresa}`} />
          <Link to="/fabrica/proveedorTambosFabrica" className="boton_rojo">
            VOLVER
          </Link>
        </div>

        {/* Contenedor Datos Proveedor */}
        <div className="flex flex-wrap justify-center p-2 space-x-3 scrollbar overflow-y-auto max-h-[200px]">
          <div className="flex flex-wrap space-x-3 justify-center">
            <div className="flex flex-col mb-4 ml-3">
              <label className="labelInput">Nombre:</label>
              <input
                type="text"
                name="nombre_empresa"
                value={editableProveedor.nombre_empresa}
                readOnly={!showModal}
                disabled
                onChange={handleInputChange}
                className="input "
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="labelInput">Contacto 1:</label>
              <input
                type="text"
                name="conatco_1"
                value={editableProveedor.contacto_1}
                readOnly={!showModal}
                disabled
                onChange={handleInputChange}
                className="input"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="labelInput">Contacto 2:</label>
              <input
                type="text"
                name="contacto_2"
                value={editableProveedor.contacto_2}
                readOnly={!showModal}
                disabled
                onChange={handleInputChange}
                className="input"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="labelInput">Localidad:</label>
              <input
                type="text"
                name="localidad"
                value={editableProveedor.localidad}
                readOnly={!showModal}
                disabled
                onChange={handleInputChange}
                className="input"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="labelInput">Saldo:</label>
              <div className="flex items-center bg-white-bg2 pl-3 w-[240px] space-x-2">
                <p className="text-xl text-white-bg3">$</p>
                <input
                  type="text"
                  name="saldo"
                  value={editableProveedor.saldo}
                  readOnly={!showModal}
                  disabled
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
            </div>
          </div>
          {/* Botones */}
          <div className="flex justify-center h-12 space-x-3 mt-6">
            <button
              onClick={handleEdit}
              className="hover:bg-button-green_hover bg-button-green text-white-bg text-xl cursor-pointer w-12 sm:ml-8 ml-0"
            >
              <MdEdit className="mx-auto" />
            </button>

            <button
              onClick={() => handleDelete(proveedor.id, proveedor.nombre)}
              className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-12"
            >
              <MdDelete className="mx-auto" />
            </button>
          </div>
        </div>

        {/* Barra Separadora */}
        <BarraSeparadora orientacion="horizontal" />

        {/* Menu */}
        <MenuProveedor
          dataProveedor={proveedor}
          fetch={fetchProveedores}
          sector_titulo="FABRICA"
          sector_nombre={proveedor.nombre_empresa}
        />

        <BarraSeparadora orientacion="horizontal" />

        <div className="w-full h-auto flex justify-between ">
          <TablaRetiros
            retiros={retiros}
            fetchRetiros={() => fetchRetiros(id)}
            id_proveedor={id}
          />
        </div>

        {/* Modal de Edición */}
        {showModal && (
          <Modal>
            <EditarProveedor
              setCloseModal={setShowModal}
              editProveedor={editableProveedor}
              fetchProveedorTambo={fetchProveedores}
            />
          </Modal>
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
                  <Link
                    to="/fabrica/proveedorTambosFabrica"
                    className="boton_verde"
                  >
                    VOLVER A PROVEEDORES DE TAMBO
                  </Link>
                </div>
              </div>
            ) : (
              <LoaderModal textLoader={"Cargando datos del empleado"} />
            )}
          </Modal>
        )}
      </div>
    </ContenedorGeneral>
  );
};
export default VistaDataProveedorTamboFabrica;
