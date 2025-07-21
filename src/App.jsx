import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

//! VISTAS
import Login from "./views/login/Login";
import Home from "./views/home/Home";
//todo GANADO
import Ganado from "./views/ganado/Ganado";
//todo TAMBO
import Tambo from "./views/tambo/Tambo";
import Produccion from "./views/tambo/Produccion";
import Compra from "./views/tambo/Compra";
import Venta from "./views/tambo/Venta";
import Animales from "./views/tambo/Animales";
import Insumos from "./views/tambo/Insumos";
import ReporteYAnalisis from "./views/tambo/ReporteYAnalisis";
import ControlProduccion from "./views/tambo/ControlProduccion";
import CargarControlProduccion from "./views/tambo/components/controlProduccion/CargarControlProduccion";
import Inseminacion from "./views/tambo/Inseminacion";
import HistorialDeInseminaciones from "./views/tambo/components/inseminacion/HistorialDeInseminaciones";
import HistorialDeControles from "./views/tambo/components/controlProduccion/HistorialDeControles";
import HistorialDeLiquidaciones from "./views/tambo/components/venta/HistorialDeLiquidaciones";
import CompradoresDeLeche from "./views/tambo/CompradoresDeLeche";
import CompradoresDetalle from "./views/tambo/components/compradoresDeLeche/CompradoresDetalle";
import ResumenCuentaCompLeche from "./views/tambo/components/compradoresDeLeche/ResumenCuentaCompLeche";

//todo CONTROL VETERINARIO (TAMBO Y RECRIA)
import ControlVeterinario from "./views/tambo/ControlVeterinario";
import HistorialDeControlesVeterinarios from "./views/tambo/components/controlVeterinario/HistorialDeControles";

//todo RECRIA
import Recria from "./views/recria/Recria";
import IngresoDeTerneros from "./views/recria/Ingreso";
import Hembras from "./views/recria/Hembras";
import Machos from "./views/recria/Machos";
import ReporteYAnalisisRecria from "./views/recria/ReporteYAnalisis";

//todo CLIENTES
import Clientes from "./views/clientes/Clientes";
import VistaDataCliente from "./views/clientes/components/clientes/VistaDataCliente";
import ResumenCuentaCliente from "./views/clientes/components/clientes/ResumenCuentaClientes";

//todo PROVEEDORES
import Proveedores from "./views/proveedores/Proveedores";
import VistaDataProveedores from "./views/proveedores/components/VistaDataProveedres";
import ResumenCuentaProveedor from "./views/proveedores/components/ResumenCuentaProveedor";

//todo FABRICA DE QUESOS
import Fabrica from "./views/fabrica/Fabrica";
import Productos from "./views/fabrica/Poductos";
import InsumosFabrica from "./views/fabrica/Insumos";
import RetiroDeLeche from "./views/fabrica/RetiroLeche";
import Ventas from "./views/fabrica/Ventas";
import VistaDataInsumos from "./views/fabrica/components/insumos/VistaDataInsumo";
import ProveedoresTamboFabrica from "./views/fabrica/ProveedoresTambo";
import VistaDataProveedorTamboFabrica from "./views/fabrica/components/proveedoresTamboFabrica/VistaDataProveedor";
import ReporteAnalisis from "./views/fabrica/ReporteAnalisis";
// import ResumenCuentaProveedorTambo from "./views/fabrica/components/proveedoresTamboFabrica/vistas_menu/ResumenCuentaProveedorTambo";
import ResumenCuentaProveedorTambo from "./views/fabrica/components/proveedoresTamboFabrica/vistas_menu/ResumenCuentaProveedor";
//todo EMPLEADOS
import Empleados from "./views/empleados/Empleados";
import VistaDataEmpleado from "./views/empleados/components/VistaDataEmpleado";
import ResumenCuentaEmpleado from "./views/empleados/components/vistas_menu/ResumenCuentaEmpleado";

//todo AGRICULTURA
import Agricultura from "./views/agricultura/Agricultura";
import AdministradorDeLotes from "./views/agricultura/AdministradorDeLotes";
import LoteDetalle from "./views/agricultura/components/AdministradorDeLotes/LoteDetalle";
import InsumosAgricultura from "./views/agricultura/Insumos";
import ReporteYAnalisisAgricultura from "./views/agricultura/ReporteYAnalisis";
import Rollos from "./views/agricultura/Rollos";

//todo CAJA
import Caja from "./views/caja/Caja";
import Transferencias from "./views/caja/Transferencias";
import Chequera from "./views/caja/Chequera";
import CargarComrpobante from "./views/caja/CargarComprobante";
import CompromisoPago from "./views/caja/CompromisoPago";
import GastosIngresos from "./views/caja/GastosIngresos";
import Efectivo from "./views/caja/Efectivo";
import EmitirFactura from "./views/caja/EmitirFactura";
import HistorialDeFacturas from "./views/caja/HistorialDeFacturas";
import HistorialDeComprobante from "./views/caja/HistorialDeComprobante";

//todo BANCO
import Banco from "./views/banco/Banco";

//todo CASA
import Casa from "./views/casa/Casa";

//todo NOT-FOUND
import NotFound from "./views/notFound/NotFound";

//todo SEGUROS
import Seguros from "./views/seguros/Seguros";

const App = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const location = useLocation();
    const storedUserId = localStorage.getItem("user_id");
    const [userId, setUserId] = useState(storedUserId);

    useEffect(() => {
        if (!token) {
            navigate("/");
        } else {
            if (location.pathname === "/") {
                navigate("/home");
            }

            // setUserId(storedUserId);
        }
    }, [token, location.pathname, navigate]);

    return (
        <div className="text-black-comun bg-black-comun font-NS w-screen h-screen scrollbar overflow-hidden">
            <Routes>
                {/*//? home y login */}
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Login />} />
                {/*//? ganado */}
                <Route path="/ganado" element={<Ganado />} />
                {/*//? tambo */}
                <Route path="/tambo" element={<Tambo />} />
                <Route path="/tambo/produccion" element={<Produccion />} />
                <Route path="/tambo/compra" element={<Compra />} />
                <Route path="/tambo/venta" element={<Venta />} />
                <Route path="/tambo/compradores-leche" element={<CompradoresDeLeche />} />
                <Route path="/tambo/compradores-leche/:id" element={<CompradoresDetalle />} />
                <Route path="/tambo/venta/liquidaciones" element={<HistorialDeLiquidaciones />} />
                <Route path="/tambo/animales" element={<Animales />} />
                <Route path="/tambo/reporte-analisis" element={<ReporteYAnalisis />} />
                <Route path="/tambo/control-produccion" element={<ControlProduccion />} />
                <Route path="/tambo/control-produccion/historial-control" element={<HistorialDeControles />} />
                <Route path="/tambo/control-produccion/cargar/:key" element={<CargarControlProduccion />} />
                <Route path="/tambo/inseminacion" element={<Inseminacion />} />
                <Route path="/tambo/inseminacion/historial" element={<HistorialDeInseminaciones />} />
                <Route path="/tambo/insumos/:sector/:origen" element={<Insumos />} />
                <Route path="/control-veterinario/:origen" element={<ControlVeterinario />} />
                <Route path="/control-veterinario/historial/:origen" element={<HistorialDeControlesVeterinarios />} />
                <Route path="/tambo/resumen-cuenta/compradores-leche/:id" element={<ResumenCuentaCompLeche />} />
                {/*//? recria */}
                <Route path="/recria" element={<Recria />} />
                <Route path="/recria/ingreso" element={<IngresoDeTerneros />} />
                <Route path="/recria/hembras" element={<Hembras />} />
                <Route path="/recria/machos" element={<Machos />} />
                <Route path="/recria/reporte-analisis" element={<ReporteYAnalisisRecria />} />
                {/*//? fabrica */}
                <Route path="/fabrica" element={<Fabrica />} />
                <Route path="/fabrica/productos" element={<Productos />} />
                <Route path="/fabrica/ventas" element={<Ventas />} />
                <Route path="/fabrica/reporte-analisis" element={<ReporteAnalisis />} />
                <Route path="/fabrica/retiroDeLeche" element={<RetiroDeLeche userId={userId} />} />
                <Route path="/fabrica/insumos/:sector" element={<InsumosFabrica />} />
                <Route path="/fabrica/insumos/vistaDataInsumos" element={<VistaDataInsumos />} />
                <Route path="/fabrica/proveedorTambosFabrica" element={<ProveedoresTamboFabrica />} />
                <Route path="/fabrica/vistaProveedorTamboFabrica/:id" element={<VistaDataProveedorTamboFabrica />} />
                //<Route path="/fabrica/resumenCuentaProveedorTambo" element={<ResumenCuentaProveedorTambo />} />
                   <Route
                  path="/fabrica/resumen-cuenta-proveedor-tambo/:id"
                  element={<ResumenCuentaProveedorTambo />}
                />
                {/*//? empleados */}
                <Route path="/empleados" element={<Empleados token={token} />} />
                <Route path="/empleados/vistaDataEmpleado/:id" element={<VistaDataEmpleado token={token} />} />
                <Route path="/empleados/resumenCuentaEmpleado" element={<ResumenCuentaEmpleado />} />
                {/*//? agricultura */}
                <Route path="/agricultura" element={<Agricultura />} />
                <Route path="/agricultura/lotes" element={<AdministradorDeLotes />} />
                <Route path="/agricultura/lotes/:id" element={<LoteDetalle />} />
                <Route path="/agricultura/insumos" element={<InsumosAgricultura />} />
                <Route path="/agricultura/rollos" element={<Rollos />} />
                <Route path="/agricultura/reporte-analisis" element={<ReporteYAnalisisAgricultura />} />
                {/* //? caja */}
                <Route path="/caja" element={<Caja />} />
                <Route path="/caja/transferencias" element={<Transferencias token={token} />} />
                <Route path="/caja/chequera" element={<Chequera token={token} />} />
                <Route path="/caja/cargarComprobante" element={<CargarComrpobante />} />
                <Route path="/caja/emitir-factura" element={<EmitirFactura />} />
                <Route path="/caja/historial-factura" element={<HistorialDeFacturas />} />
                <Route path="/caja/historial-comprobante" element={<HistorialDeComprobante />} />
                <Route path="/caja/compromisoDePago" element={<CompromisoPago />} />
                <Route path="/caja/gastos-ingresos" element={<GastosIngresos />} />
                <Route path="/caja/efectivo" element={<Efectivo />} />
                {/*//? BANCO */}
                <Route path="/banco" element={<Banco />} />
                {/* //?CASA */}
                <Route path="/casa" element={<Casa />} />
                {/* //? CLIENTES GENERAL */}
                <Route path="/clientes/:sector_nombre/:sector_titulo" element={<Clientes />} />
                <Route path="/cliente/:id/:sector_titulo/:sector_nombre" element={<VistaDataCliente />} />
                <Route
                    path="/resumen-cuenta-cliente/:id/:sector_titulo/:sector_nombre"
                    element={<ResumenCuentaCliente />}
                />
                {/* //? PROVEEDORES GENERAL */}
                <Route path="/proveedores/:sector_nombre/:sector_titulo" element={<Proveedores />} />
                <Route path="/proveedor/:id/:sector_titulo/:sector_nombre" element={<VistaDataProveedores />} />
                <Route
                    path="/resumen-cuenta-proveedor/:id/:sector_titulo/:sector_nombre"
                    element={<ResumenCuentaProveedor />}
                />
                //? SEGUROS
                <Route path="/seguros" element={<Seguros />} />
                {/* //?Ruta 404 para manejar rutas inexistentes */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );

};

export default App;
