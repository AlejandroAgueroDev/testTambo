import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";
import Swal from "sweetalert2";
import { url } from "../../../common/URL_SERVER";
import axios from "axios";
//?Componentes
import Modal from "../../../common/Modal";
import MenuEmpleado from "../components/MenuEmpleado";
import BarraSeparadora from "../../../common/BarraSeparadora";
import ContenedorGeneral from "../../../common/ContenedorGeneral";
import Titulo from "../../../common/Titulo";
import EditarEmpleado from "../components/EditarEmpleado";
import LoaderModal from "../../../common/LoaderModal";

const VistaDataEmpleado = ({ token }) => {
  const [empleado, setEmpleado] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loaderDatos, setLoaderDatos] = useState(true);
  const [loaderDatosError, setLoaderDatosError] = useState(false);

  const fetchEmpleados = async () => {
    try {
      const { data } = await axios.get(`${url}empleado?id_empleado=${id}`);

      setLoaderDatos(false);

      setEmpleado(data);
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los empleados. Por favor comuniquese con soporte técnico.",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
      setLoaderDatosError(true);
    }
  };
  useEffect(() => {
    fetchEmpleados();
  }, []);

  // Función para manejar la edición
  const handleEdit = () => {
    setShowModal(true);
  };

  const crearUsuarioParaEmpleado = async (empleadoId) => {
    try {
      const { data } = await axios.post(
        `${url}empleado/usuario?id_empleado=${empleadoId}`
      );

      // Mostrar los datos del usuario creado
      Swal.fire({
        title: "Usuario creado exitosamente",
        html: `
            <div class="text-left">
              <p><strong>Email:</strong> ${data.datosUsuario.email}</p>
              <p><strong>Contraseña:</strong> ${data.datosUsuario.pass}</p>
            </div>
          `,
        icon: "success",
        confirmButtonColor: "#86C394",
      }).then(() => fetchEmpleados());
    } catch (error) {
      console.error("Error al crear usuario:", error);
      Swal.fire({
        title: "Error al crear usuario",
        text: error.response?.data?.message || "Error desconocido",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    }
  };

  const handleDeleteUsuario = () => {
    Swal.fire({
      title: `¿Quieres eliminar el usuario del empleado "${empleado.nombre}"?`,
      showDenyButton: true,
      confirmButtonText: "Sí",
      denyButtonText: "No",
      confirmButtonColor: "#86C394",
      denyButtonColor: "#D64747",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}empleado/${empleado.id}/usuario`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          Swal.fire({
            title: "Usuario eliminado",
            confirmButtonText: "Aceptar",
            icon: "success",
            confirmButtonColor: "#86C394",
          }).then(() => fetchEmpleados());
        } catch (error) {
          console.error("Error eliminando empleado:", error);
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
      }
    });
  };

  //?DELETE de empleados
  const handleDelete = () => {
    Swal.fire({
      title: `¿Quieres eliminar el empleado "${empleado.nombre}" definitivamente?`,
      showDenyButton: true,
      confirmButtonText: "Sí",
      denyButtonText: "No",
      confirmButtonColor: "#86C394",
      denyButtonColor: "#D64747",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}empleado/${empleado.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          Swal.fire({
            title: "Empleado eliminado",
            confirmButtonText: "Aceptar",
            icon: "success",
            confirmButtonColor: "#86C394",
          }).then(() => navigate("/empleados"));
        } catch (error) {
          console.error("Error eliminando empleado:", error);
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
      }
    });
  };

  return (
    <ContenedorGeneral navText="EMPLEADOS">
      <div className="w-screen md:w-full flex md:justify-between md:pl-0 md:pr-0 justify-center items-center pl-14 pr-4 text-center space-x-3">
        <Titulo text={`EMPLEADO | ${empleado.nombre}`} />
        <Link to="/empleados" className="boton_rojo">
          VOLVER
        </Link>
      </div>

      {/* Contenedor Datos Empleados */}
      <div className="flex flex-wrap justify-center items-end p-2 space-x-3 overflow-auto sm:overflow-visible scrollbar">
        <div className="flex flex-wrap space-x-3 justify-center">
          <div className="flex flex-col mb-4 ml-3 w-72">
            <label className="text-xl font-semibold text-white-bg3">
              Nombre:
            </label>
            <input
              type="text"
              name="nombre"
              value={empleado.nombre || ""}
              readOnly={!showModal}
              disabled
              className="bg-white-bg2 text-black-comun py-2 px-2 text-xl "
            />
          </div>

          <div className="flex flex-col mb-4 w-72">
            <label className="text-xl font-semibold text-white-bg3">DNI:</label>
            <input
              type="number"
              name="dni"
              value={empleado.dni || ""}
              readOnly={!showModal}
              disabled
              className="bg-white-bg2 text-black-comun py-2 px-2 text-xl"
            />
          </div>

          <div className="flex flex-col mb-4 w-72">
            <label className="text-xl font-semibold text-white-bg3">
              Sector:
            </label>
            <input
              type="text"
              name="sector"
              value={empleado.sector || ""}
              readOnly={!showModal}
              disabled
              className="bg-white-bg2 text-black-comun py-2 px-2 text-xl"
            />
          </div>

          <div className="flex flex-col mb-4 w-72">
            <label className="text-xl font-semibold text-white-bg3">
              Cuit/Cuil:
            </label>
            <input
              type="text"
              name="cuit_cuil"
              value={empleado.cuit_cuil || "-"}
              readOnly={!showModal}
              disabled
              className="bg-white-bg2 text-black-comun py-2 px-2 text-xl"
            />
          </div>

          <div className="flex flex-col mb-4 w-72">
            <label className="text-xl font-semibold text-white-bg3">
              Contacto:
            </label>
            <input
              type="text"
              name="contacto2"
              value={empleado.contacto || "-"}
              readOnly={!showModal}
              disabled
              className="bg-white-bg2 text-black-comun py-2 px-2 text-xl"
            />
          </div>

          <div className="flex flex-col mb-4 w-72">
            <label className="text-xl font-semibold text-white-bg3">
              Saldo:
            </label>
            <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow w-full">
              <p className="text-xl text-white-bg3">$</p>
              <input
                type="number"
                name="saldo"
                value={empleado.saldo || "0"}
                readOnly={!showModal}
                disabled
                className="bg-white-bg2 text-black-comun py-2 px-2 text-xl"
              />
            </div>
          </div>

          <div className="flex flex-col mb-4 w-72">
            <label className="text-xl font-semibold text-white-bg3">
              Usuario de sistema:
            </label>
            <input
              type="text"
              name="saldo"
              value={empleado.User ? empleado.User.email : "Sin usuario"}
              readOnly={!showModal}
              disabled
              className="bg-white-bg2 text-black-comun py-2 px-2 text-xl"
            />
          </div>

          <div className="flex flex-col mb-4 w-72">
            <label className="text-xl font-semibold text-white-bg3">
              Contraseña de inicio:
            </label>
            <input
              type="text"
              name="saldo"
              value={empleado.User ? empleado.dni : "-"}
              readOnly={!showModal}
              disabled
              className="bg-white-bg2 text-black-comun py-2 px-2 text-xl"
            />
          </div>
        </div>
        <div className="flex justify-center h-12 space-x-3 mb-4">
          <button
            onClick={handleEdit}
            className="hover:bg-button-green_hover bg-button-green text-white-bg text-xl cursor-pointer w-12"
          >
            <MdEdit className="mx-auto" />
          </button>

          <button
            onClick={handleDelete}
            className="hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-12"
          >
            <MdDelete className="mx-auto" />
          </button>

          <button
            onClick={() => crearUsuarioParaEmpleado(empleado.id)}
            className={
              !empleado.User
                ? "hover:bg-teal-300 bg-teal-400 text-white-bg text-2xl cursor-pointer w-12"
                : "hidden"
            }
          >
            <FaUserPlus className="mx-auto" />
          </button>

          <button
            onClick={handleDeleteUsuario}
            className={
              empleado.User
                ? "hover:bg-button-red_hover bg-button-red text-white-bg text-2xl cursor-pointer w-12"
                : "hidden"
            }
          >
            <FaUserMinus className="mx-auto" />
          </button>
        </div>
      </div>

      <BarraSeparadora orientacion="horizontal" />

      <MenuEmpleado empleado={empleado} fetch={fetchEmpleados} />

      {showModal && (
        <Modal>
          <EditarEmpleado
            setShowModal={setShowModal}
            empleado={empleado}
            token={token}
            fetchEmpleados={fetchEmpleados}
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
                <Link to="/empleados/" className="boton_verde">
                  VOLVER A EMPLEADOS
                </Link>
              </div>
            </div>
          ) : (
            <LoaderModal textLoader={"Cargando datos del empleado"} />
          )}
        </Modal>
      )}
    </ContenedorGeneral>
  );
};

export default VistaDataEmpleado;
