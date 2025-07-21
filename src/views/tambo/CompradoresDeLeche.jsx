import { useState, useEffect } from "react";
import Titulo from "../../common/Titulo";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import { Link } from "react-router-dom";
import axios from "axios";
import { url } from "../../common/URL_SERVER";
import Modal from "../../common/Modal";
import TablaCompradores from "./components/compradoresDeLeche/TablaCompradores";
import NuevoCliente from "../clientes/components/clientes/NuevoCliente";
import LoaderDatos from "../../common/LoaderDatos";

const CompradoresDeLeche = () => {
  const [compradores, setCompradores] = useState([]);
  const [sector, setSector] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loaderTabla, setLoaderTabla] = useState(true);

  //?GET sector
  const fetchSector = async () => {
    try {
      const { data } = await axios.get(`${url}sector`);

      data.map((sector) => {
        if (sector.nombre === "Tambos") {
          fetchCompradores(sector.id);
          setSector(sector);
        }
      });
    } catch (error) {
      console.error("Error al obtener sector:", error);
    }
  };
  useEffect(() => {
    fetchSector();
  }, []);

  //?GET compradores
  const fetchCompradores = async (sector_id) => {
    try {
      const { data } = await axios.get(`${url}cliente/${sector_id}`);
      setCompradores(data);
      setLoaderTabla(false);
    } catch (error) {
      console.error("Error al obtener compradores:", error);
    }
  };
  useEffect(() => {
    fetchCompradores();
  }, []);

  const handleAddNew = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <ContenedorGeneral navText="TAMBO">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="TAMBO | COMPRADORES DE LECHE" />

        <div className="flex gap-4">
          <Link to="/tambo/venta" className="boton_rojo flex justify-end">
            VOLVER
          </Link>
        </div>
      </div>
      <div className="h-[100%] w-screen overflow-auto pr-4 md:pr-0 md:w-auto">
        {loaderTabla ? (
          <LoaderDatos textLoader="Cargando compradores" />
        ) : (
          <TablaCompradores compradores={compradores} />
        )}
      </div>
      <div>
        <button onClick={handleAddNew} className="boton_verde">
          AGREGAR COMPRADOR
        </button>
      </div>

      {showModal && (
        <Modal setShowModal={setShowModal}>
          <NuevoCliente
            setShowModal={setShowModal}
            id_sector={sector.id}
            titulo="COMPRADOR"
            fetchClientes={fetchCompradores}
          />
        </Modal>
      )}
    </ContenedorGeneral>
  );
};

export default CompradoresDeLeche;
