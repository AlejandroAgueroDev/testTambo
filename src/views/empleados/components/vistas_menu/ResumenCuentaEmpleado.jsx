import Titulo from "../../../../common/Titulo";
import ContenedorGeneral from "../../../../common/ContenedorGeneral";
import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";

const ResumenCuentaEmpleado = () => {
  const location = useLocation();
  const empleado = location.state?.empleado;
  const [mes, setMes] = useState("");
  const [datosCuenta, setDatosCuenta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumen = async () => {
      if (!empleado?.id) return;

      try {
        setLoading(true);
        const { data } = await axios.get(
          `${url}empleado/resumen/${empleado.id}?tipo=EMPLEADO`
        );

        setDatosCuenta(data.resumen.reverse());
      } catch (err) {
        console.error(err);
        setError("Error al obtener el resumen del empleado.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumen();
  }, [empleado]);

  useEffect(() => {
    // Obtener el año y mes actual en formato YYYY-MM
    const fechaActual = new Date();
    const mesActual = (fechaActual.getMonth() + 1).toString().padStart(2, "0"); // Asegurarse de que el mes tenga dos dígitos
    const añoActual = fechaActual.getFullYear();
    const mesFormateado = `${añoActual}-${mesActual}`; // Formato YYYY-MM
    setMes(mesFormateado); // Establecer el valor en el estado
  }, []);

  return (
    <ContenedorGeneral navText="EMPLEADOS">
      {/* Cabecera */}
      <div className="w-screen md:w-full flex md:justify-between md:pl-0 md:pr-0 justify-center items-center pl-14 pr-4 text-center space-x-3">
        <Titulo text="RESUMEN DE CUENTA" />
        <div className="flex gap-4">
          <Link
            to={`/empleados/vistaDataEmpleado/${empleado.id}`}
            state={{ empleado }}
            className="boton_rojo"
          >
            VOLVER
          </Link>
        </div>
      </div>

      <div className="h-screen">
        <div className="flex flex-col justify-between space-y-2 p-2 h-full">
          {/* Primer div */}
          <div className="flex space-x-4">
            <div>
              <p className="font-semibold text-white-bg3">Nombre</p>
              <p className="bg-white-bg2 px-2 py-1 text-xl min-w-64">
                {empleado.nombre} {empleado.apellido}
              </p>
            </div>
            <div>
              <p className="font-semibold text-white-bg3">Mes</p>
              <input
                type="month"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className="bg-white-bg2 text-black-comun py-0.5 px-5 text-xl w-full uppercase"
              />
            </div>
          </div>

          {/* Segundo div (Tabla) */}
          <div className="flex-1 scrollbar overflow-y-auto overflow-x-hidden">
            <table className="border-separate text-lg w-full">
              <thead>
                <tr className="bg-white-bg3 text-white-bg text-center">
                  <th>Fecha</th>
                  <th>Detalle</th>
                  <th className="w-36">Debe ($)</th>
                  <th className="w-36">Haber ($)</th>
                </tr>
              </thead>
              <tbody>
                {datosCuenta &&
                  datosCuenta.map((item, index) => (
                    <tr key={index} className="text-center bg-white-bg2">
                      <td>
                        {new Date(item.fecha).toLocaleDateString("es-AR")}
                      </td>
                      <td>{item.detalle}</td>
                      <td>{item.debe || "-"}</td>
                      <td>{item.haber || "-"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <div className="text-right space-x-3">
              <label className="labelInput">SALDO HACIA EL EMPLEADO</label>
              <div className="flex items-center bg-white-bg2 pl-3 w-auto space-x-2 grow">
                <p className="text-xl text-white-bg3">$</p>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={empleado?.saldo?.toLocaleString("es-AR")}
                  className=" bg-white-bg2 text-black-comun py-2 px-2 text-xl w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContenedorGeneral>
  );
};

export default ResumenCuentaEmpleado;
