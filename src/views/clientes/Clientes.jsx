import { useState, useEffect } from "react";
import Titulo from "../../common/Titulo";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import { Link, useParams } from "react-router-dom";
import TablaClientes from "./components/clientes/TablaClientes";
import axios from "axios";
import { url } from "../../common/URL_SERVER";
import Modal from "../../common/Modal";
import NuevoCliente from "./components/clientes/NuevoCliente";
import LoaderDatos from "../../common/LoaderDatos";
import Busqueda from "../../common/Busqueda";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [sector, setSector] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(true);
  const { sector_nombre, sector_titulo } = useParams();

  //?GET clientes
  const fetchClientes = async (sector_id) => {
    try {
      const { data } = await axios.get(`${url}cliente/${sector_id}`);
      const clientesFiltrados = data.filter(
        (clientes) => clientes.nombre_empresa !== "CONSUMIDOR FINAL"
      );
      setClientes(clientesFiltrados);

      setLoader(false);
      setClientesFiltrados(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  useEffect(() => {
    //?GET sector
    const fetchSector = async () => {
      try {
        const { data } = await axios.get(`${url}sector`);
        data.map((sector) => {
          if (sector.nombre === sector_nombre) {
            fetchClientes(sector.id);
            setSector(sector);
          }
        });
      } catch (error) {
        console.error("Error al obtener sector:", error);
      }
    };
    fetchSector();
  }, []);

  const handleAddNew = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  //? FILTRO LOS CLIENTES POR BUSQUEDA
  const [search, setSearch] = useState("");
  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const filterClientes = [];
  clientes.map((c) => {
    const up = c.nombre_empresa.toLowerCase();
    if (up.includes(search.toLowerCase())) {
      return filterClientes.push(c);
    }
  });

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <ContenedorGeneral navText={sector_titulo.toUpperCase()}>
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text={"CLIENTES | " + sector_titulo.toUpperCase()} />

        <div className="hidden md:block">
          <Busqueda
            placeholder="Buscar por nombre"
            color="white"
            handler={handleChangeSearch}
            clear={clearSearch}
            value={search}
          />
        </div>

        <div className="flex gap-4">
          <Link
            to={`/${sector_titulo}`}
            className="boton_rojo flex justify-end"
          >
            VOLVER
          </Link>
        </div>
      </div>
      <div className="h-[100%] w-screen scrollbar overflow-auto pr-4 md:pr-0 md:w-auto">
        {loader ? (
          <LoaderDatos textLoader="Cargando datos" />
        ) : (
          <TablaClientes
            clientes={filterClientes}
            sector_titulo={sector_titulo}
            sector_nombre={sector_nombre}
          />
        )}
      </div>
      <div>
        <button onClick={handleAddNew} className="boton_verde">
          AGREGAR NUEVO CLIENTE
        </button>
      </div>

      {showModal && (
        <Modal setShowModal={setShowModal}>
          <NuevoCliente
            setShowModal={setShowModal}
            id_sector={sector.id}
            fetchClientes={fetchClientes}
          />
        </Modal>
      )}
    </ContenedorGeneral>
  );
};

export default Clientes;
