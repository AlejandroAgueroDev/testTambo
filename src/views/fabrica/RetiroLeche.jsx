import ContenedorGeneral from "../../common/ContenedorGeneral";
import Titulo from "../../common/Titulo";
import { Link } from "react-router-dom";
import BarraSeparadora from "../../common/BarraSeparadora";
import CargarRetiroLeche from "./components/retiroLeche/CargarRetiroLeche"
import UltimosRetiros from "./components/retiroLeche/UltimosRetiros";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { url } from "../../common/URL_SERVER";

const RetiroDeLeche = ({ userId }) => {
  const [proveedores, setProveedores] = useState([]);
   const [refreshRetiros, setRefreshRetiros] = useState(false); // Nuevo estado

  const handleRetiroCargado = () => {
    setRefreshRetiros(prev => !prev); // Alternar para forzar actualización
  };

  //?GET de proveedores
  const fetchProveedores = async () => {
    try {
      const { data } = await axios.get(`${url}proveedor`)

      const proveedoresArray = Array.isArray(data.tamboProveedor)
        ? data.tamboProveedor
        : [];

      setProveedores(proveedoresArray);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
    }
  };
  useEffect(() => {
    fetchProveedores();
  }, []);

  return (
    <ContenedorGeneral navText="FABRICA">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="FABRICA | RETIRO DE LECHE" />
        <Link to="/fabrica" className="boton_rojo">
          VOLVER
        </Link>
      </div>
      <div className="w-full h-full flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between scrollbar overflow-auto">
        <CargarRetiroLeche
          proveedores={proveedores}
          getProveedores={fetchProveedores}
          retiroCargado={handleRetiroCargado}
        />

        <div className="hidden sm:block">
          <BarraSeparadora orientacion="vertical" />
        </div>
        <div className="sm:hidden">
          <BarraSeparadora orientacion="horizontal" />
        </div>

        <UltimosRetiros 
          refreshRetiros={refreshRetiros}
        />
      </div>
    </ContenedorGeneral>
  );
};

export default RetiroDeLeche;
