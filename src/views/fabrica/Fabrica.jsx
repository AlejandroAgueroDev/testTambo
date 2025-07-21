import Titulo from "../../common/Titulo";
import { Link } from "react-router-dom";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import BarraSeparadora from "../../common/BarraSeparadora";
import ContadorTanque from "../../common/ContadorTanque";

const Fabrica = () => {
  return (
    <ContenedorGeneral navText="FABRICA">
      <div className="flex flex-col justify-between h-full">
        <div className="relative">
          <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
            <Titulo text="FABRICA DE QUESOS" />
          </div>
          <div className="w-full sm:w-[600px] sm:mt-0 mt-40 sm:max-h-[70dvh] max-h-[65dvh] overflow-auto scrollbar grid grid-cols-1 sm:grid-cols-2 p-5 lg:p-10 gap-4 sm:gap-y-4 sm:gap-x-10 justify-items-center sm:bg-white-bg mx-auto">

            <Link to="/fabrica/productos" className="links">
              PRODUCTOS
            </Link>
            <Link to="/fabrica/ventas" className="links">
              VENTAS
            </Link>
            <Link to="/fabrica/insumos/FabricaQueso" className="links">
              INSUMOS
            </Link>
            <Link to="/proveedores/FabricaQueso/fabrica" className="links">
              PROVEEDORES
            </Link>
            <Link to="/fabrica/retiroDeLeche" className="links">
              RETIRO DE LECHE
            </Link>
            <Link to="/fabrica/proveedorTambosFabrica" className="links">
              PROVEEDORES TAMBO
            </Link>
            <Link to="/clientes/FabricaQueso/fabrica" className="links">
              CLIENTES
            </Link>
            <Link to="/fabrica/reporte-analisis" className="links">
              REPORTE Y ANALISIS
            </Link>
          </div>

          <div className="absolute sm:mt-0 mt-16 top-0 right-0">
            <ContadorTanque sector="Fabrica" />
          </div>
        </div>
        <div className="sm:p-5 text-sm sm:text-lg space-y-2 sm:space-y-5 text-white-bg3">
          <BarraSeparadora orientacion="horizontal" />
          <p>
            En esta sección podrán gestionar la producción de quesos, el stock
            de los mismos y las ventas realizadas. Les permitira llevar un
            control de insumos utilizados, los proveedores y los clientes.
          </p>
        </div>
      </div>
    </ContenedorGeneral>
  );
};

export default Fabrica;
