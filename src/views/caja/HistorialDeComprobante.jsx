import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { url } from "../../common/URL_SERVER";
import axios from "axios";
import Titulo from "../../common/Titulo";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import TablaComprobante from "./components/historialDeComprobante/TablaComprobante";

const HistorialDeComprobante = () => {
    return (
        <ContenedorGeneral navText="CAJA">
            <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
                <Titulo text="CAJA | HISTORIAL DE COMPROBANTES" />

                <div className="flex gap-4">
                    <Link to="/caja" className="boton_rojo flex justify-end">
                        VOLVER
                    </Link>
                </div>
            </div>
            <div className="h-full w-full flex flex-col md:flex-row gap-2 md:gap-0">
                <div className="w-full md:grow scrollbar overflow-x-auto">
                    <TablaComprobante />
                </div>
            </div>
            <div className="flex justify-between">
                <Link to="/caja/cargarComprobante" className="boton_verde">
                    CARGAR COMPROBANTES
                </Link>
            </div>
        </ContenedorGeneral>
    );
};

export default HistorialDeComprobante;
