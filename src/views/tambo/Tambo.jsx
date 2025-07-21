import Titulo from "../../common/Titulo";
import { Link } from "react-router-dom";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import BarraSeparadora from "../../common/BarraSeparadora";
import ContadorTanque from "../../common/ContadorTanque";

const Tambo = () => {
  return (
    <ContenedorGeneral navText="TAMBO">
      <div className="flex flex-col justify-between h-full">
        <div className="relative">
          <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
            <Titulo text="TAMBO" />
          </div>
          <div className="w-full sm:w-[600px] sm:mt-0 mt-40 sm:max-h-[70dvh] max-h-[65dvh] overflow-auto scrollbar grid grid-cols-1 sm:grid-cols-2 p-5 lg:p-10 gap-4 sm:gap-y-4 sm:gap-x-10 justify-items-center sm:bg-white-bg mx-auto">

            <Link to="/tambo/produccion" className="links">
              PRODUCCION
            </Link>
            <Link to="/tambo/venta" className="links">
              RETIROS
            </Link>
            <Link to="/tambo/control-produccion" className="links">
              CONTROL PRODUCCION
            </Link>
            <Link to="/tambo/inseminacion" className="links">
              INSEMINACION
            </Link>
            <Link to="/control-veterinario/tambo" className="links">
              CONTROL VETERINARIO
            </Link>
            <Link to="/tambo/insumos/tambo/tambo" className="links">
              INSUMOS
            </Link>
            <Link to="/tambo/animales" className="links">
              ANIMALES
            </Link>
            <Link to="/tambo/reporte-analisis" className="links">
              REPORTE Y ANALISIS
            </Link> 
          </div>

          <div className="absolute sm:mt-0 mt-16 top-0 right-0">
            <ContadorTanque sector="Tambo" />
          </div>
        </div>
        <div className="sm:p-5 text-sm sm:text-lg space-y-2 sm:space-y-5 text-white-bg3 ">
          <BarraSeparadora orientacion="horizontal" />
          <p>
            En esta sección podrán cargar la producción diaria de leche,
            controlar los insumos utilizados, llevar un registro del ganado en
            ordeñe, así como el control veterinario e inseminaciones. También
            permite registrar la compra y venta de leche, y realizar un
            seguimiento de la producción general del tambo en el apartado de
            reportes y análisis.
          </p>
        </div>
      </div>
    </ContenedorGeneral>
  );
};

export default Tambo;
