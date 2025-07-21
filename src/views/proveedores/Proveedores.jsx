import { useState, useEffect } from "react";
import Titulo from "../../common/Titulo";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../../common/URL_SERVER";
import Modal from "../../common/Modal";
import LoaderDatos from "../../common/LoaderDatos";
import Busqueda from "../../common/Busqueda";
import TablaProveedores from "./components/TablaProveedores";
import NuevoProveedor from "./components/NuevoProveedor";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [sector, setSector] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(true);
  const { sector_nombre, sector_titulo } = useParams();

  useEffect(() => {
    //?GET PROVEEDORES
    const fetchProveedores = async (sector_id) => {
      try {
        const { data } = await axios.get(
          `${url}proveedor?id_sector=${sector_id}`
        );
        
        setProveedores(data);
        setLoader(false);
        setProveedoresFiltrados(data);
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
      }
    };

    //?GET SECTOR
    const fetchSector = async () => {
      try {
        const { data } = await axios.get(`${url}sector`);
        data.map((sector) => {
          if (sector.nombre === sector_nombre) {
            fetchProveedores(sector.id);
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

  //? FILTRO LOS PROVEEDORES POR BUSQUEDA
  const [search, setSearch] = useState("");
  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const filterProveedores = [];
  proveedores.map((c) => {
    const up = c.nombre_empresa.toLowerCase();
    if (up.includes(search.toLowerCase())) {
      return filterProveedores.push(c);
    }
  });

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <ContenedorGeneral navText={sector_titulo.toUpperCase()}>
      <div className="w-screen md:w-full flex md:justify-between md:pl-0 md:pr-0 justify-center items-center pl-14 pr-4 text-center space-x-3">
        <Titulo text={"PROVEEDORES | " + sector_titulo.toUpperCase()} />

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
          <TablaProveedores
            proveedores={filterProveedores}
            sector_titulo={sector_titulo}
            sector_nombre={sector_nombre}
          />
        )}
      </div>
      <div>
        <button onClick={handleAddNew} className="boton_verde">
          AGREGAR PROVEEDOR
        </button>
      </div>

      {showModal && (
        <Modal setShowModal={setShowModal}>
          <NuevoProveedor
            setShowModal={setShowModal}
            id_sector={sector.id}
            setProveedores={setProveedores}
            setProveedoresFiltrados={setProveedoresFiltrados}
          />
        </Modal>
      )}
    </ContenedorGeneral>
  );
};

export default Proveedores;
