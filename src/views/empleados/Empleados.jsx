import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { url } from "../../common/URL_SERVER";
import axios from "axios";
//?COMPONENTES
import Titulo from "../../common/Titulo";
import Modal from "../../common/Modal";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import TablaEmpleados from "./components/TablaEmpleados";
import AñadirEmpleado from "./components/AñadirEmpleado";

const Empleados = ({ token }) => {
  const [addNew, setAddNew] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [sectores, setSectores] = useState([]);

  //? GET de empleados
  const fetchEmpleados = async () => {
    try {
      const { data } = await axios.get(`${url}empleado`);
      
      
      setEmpleados(data.reverse());
      setEmpleadosFiltrados(data);
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los empleados.",
        icon: "error",
        confirmButtonColor: "#D64747",
      });
    } 
  };
  useEffect(() => {
    //?GET de sectores
    const fetchSectores = async () => {
      try {
        const { data } = await axios.get(`${url}sector`);
        setSectores(data);
      } catch (error) {
        console.error("Error al obtener los sectores:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los sectores.",
          icon: "error",
          confirmButtonColor: "#D64747",
        });
      }
    };

    fetchSectores();
    fetchEmpleados();
  }, []);

  const handleAddNew = (e) => {
    e.preventDefault();
    setAddNew(true);
  };

  const handleSearch = (type) => {
    if (type === "search") {
      setIsSearch(true);
      const searchLower = search.toLowerCase();
      const filtered = empleados.filter((empleado) => {
        const nombre = empleado.nombre ? empleado.nombre.toLowerCase() : "";
        const apellido = empleado.apellido
          ? empleado.apellido.toLowerCase()
          : "";
        const localidad = empleado.localidad
          ? empleado.localidad.toLowerCase()
          : "";
        return (
          nombre.includes(searchLower) ||
          apellido.includes(searchLower) ||
          localidad.includes(searchLower)
        );
      });
      setEmpleadosFiltrados(filtered);
    } else {
      setIsSearch(false);
      setEmpleadosFiltrados(empleados);
      setSearch("");
    }
  };
  return (
    <ContenedorGeneral navText="EMPLEADOS">
      <div className="w-screen md:w-full flex justify-between items-center pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="LISTA DE EMPLEADOS" />
        <div className="hidden md:block">
          <div className="flex space-x-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="bg-white-bg2 text-black py-2 px-3 text-xl w-96"
              placeholder="Buscar por nombre, apellido o localidad"
            />
            <button
              className={`${
                isSearch
                  ? "bg-button-red hover:bg-button-red_hover"
                  : "bg-button-green hover:bg-button-green_hover"
              } px-3 text-white-bg2 text-2xl`}
              onClick={() => handleSearch(isSearch ? "close" : "search")}
            >
              {isSearch ? <IoMdClose /> : <IoSearchSharp />}
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden w-full flex justify-end pr-4">
        <div className="flex space-x-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="bg-white-bg2 text-black py-2 px-3 text-xl w-60"
            placeholder="Buscar por nombre, sector o estado"
          />
          <button
            className={`${
              isSearch
                ? "bg-button-red hover:bg-button-red_hover"
                : "bg-button-green hover:bg-button-green_hover"
            } px-3 text-white-bg2 text-2xl`}
            onClick={() => handleSearch(isSearch ? "close" : "search")}
          >
            {isSearch ? <IoMdClose /> : <IoSearchSharp />}
          </button>
        </div>
      </div>

      <div className="h-full w-screen scrollbar overflow-auto pr-4 md:pr-0 md:w-auto">
        <TablaEmpleados empleados={empleadosFiltrados} />
      </div>
      <div>
        <button
          onClick={handleAddNew}
          className={addNew ? "boton_verde_selected" : "boton_verde"}
        >
          {addNew ? "AÑADIENDO..." : "AÑADIR NUEVO EMPLEADO"}
        </button>
      </div>

      {addNew && (
        <Modal>
          <AñadirEmpleado
            setCloseModal={setAddNew}
            token={token}
            sectores={sectores}
            getEmpleados={fetchEmpleados}
          />
        </Modal>
      )}
    </ContenedorGeneral>
  );
};

export default Empleados;
