import ContenedorGeneral from "../../common/ContenedorGeneral";
import Titulo from "../../common/Titulo";
import CargarRetiro from "./components/compra/CargarRetiro";
import { Link } from "react-router-dom";
import UltimosRetiros from "./components/compra/UltimosRetiros";
import BarraSeparadora from "../../common/BarraSeparadora";

const Compra = () => {
    return (
        <ContenedorGeneral navText="TAMBO">
            <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="TAMBO | COMPRA" />
                <Link to="/tambo" className="boton_rojo">
                    VOLVER
                </Link>
            </div>
            <div className="w-full h-full flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between scrollbar overflow-auto">
                <CargarRetiro />

                <div className="hidden sm:block">
                    <BarraSeparadora orientacion="vertical" />
                </div>
                <div className="sm:hidden">
                    <BarraSeparadora orientacion="horizontal" />
                </div>

                <UltimosRetiros />
            </div>
        </ContenedorGeneral>
    );
};

export default Compra;
