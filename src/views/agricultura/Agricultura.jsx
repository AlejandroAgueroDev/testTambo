import Titulo from "../../common/Titulo";
import { Link } from "react-router-dom";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import BarraSeparadora from "../../common/BarraSeparadora";

const Agricultura = () => {
    return (
        <ContenedorGeneral navText="AGRICULTURA">
            <div className="flex flex-col justify-between h-full">
                <div>
                    <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                        <Titulo text="AGRICULTURA" />
                    </div>
                    <div className="w-full sm:w-[600px] grid grid-cols-1 sm:grid-cols-2 p-5 lg:p-10 gap-4 sm:gap-y-4 sm:gap-x-10 justify-items-center sm:bg-white-bg mx-auto">
                        <Link to="/agricultura/lotes" className="links">
                            ADMINISTRADOR DE LOTES
                        </Link>
                        <Link to="/agricultura/rollos" className="links">
                            ROLLOS
                        </Link>
                        <Link to="/clientes/Agricultura/agricultura" className="links">
                            CLIENTES
                        </Link>
                        <Link to="/proveedores/Agricultura/agricultura" className="links">
                            PROVEEDORES
                        </Link>
                        <Link to="/agricultura/insumos" className="links">
                            INSUMOS
                        </Link>
                        <Link to="/agricultura/reporte-analisis" className="links">
                            REPORTE Y ANALISIS
                        </Link>
                    </div>
                </div>
                <div className="sm:p-5 text-sm sm:text-lg space-y-2 sm:space-y-5 text-white-bg3 scrollbar overflow-auto">
                    <BarraSeparadora orientacion="horizontal" />
                    <p>
                        En esta sección podrán administrar todos los lotes, en que estado esta o que se esta realizando
                        en cada uno, los insumos utilizados para el sector y ver un reporte sobre la producción por año.
                    </p>
                </div>
            </div>
        </ContenedorGeneral>
    );
};

export default Agricultura;
