import Titulo from "../../common/Titulo";
import { useState } from "react";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import { Link } from "react-router-dom";
import BarraSeparadora from "../../common/BarraSeparadora";
import CargarInseminacion from "./components/inseminacion/CargarInseminacion";
import InseminacionesRecientes from "./components/inseminacion/InseminacionesRecientes.jsx";

const Inseminacion = () => {
    return (
        <ContenedorGeneral navText="TAMBO">
            <div className="w-screen md:w-full hidden sm:flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="TAMBO | INSEMINACION" />
                <Link to="/tambo" className="boton_rojo">
                    VOLVER
                </Link>
            </div>
            <div className="w-screen md:w-full sm:hidden flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="INSEMINACION" />
                <Link to="/tambo" className="boton_rojo">
                    VOLVER
                </Link>
            </div>

            <div className="w-full h-full flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between scrollbar overflow-auto">
                <CargarInseminacion />

                <div className="hidden sm:block">
                    <BarraSeparadora orientacion="vertical" />
                </div>
                <div className="sm:hidden">
                    <BarraSeparadora orientacion="horizontal" />
                </div>

                <InseminacionesRecientes />
            </div>
        </ContenedorGeneral>
    );
};

export default Inseminacion;
