import { useEffect, useState } from "react";

const CotizacionDolar = () => {
  const [cotizaciones, setCotizaciones] = useState({
    oficial: null,
    blue: null,
  });

  useEffect(() => {
    const obtenerCotizaciones = async () => {
      try {
        // Llamadas a ambas APIs
        const [oficial, blue] = await Promise.all([
          fetch("https://dolarapi.com/v1/dolares/oficial").then((res) =>
            res.json()
          ),
          fetch("https://dolarapi.com/v1/dolares/blue").then((res) =>
            res.json()
          ),
        ]);

        // Actualizar el estado con los datos obtenidos
        setCotizaciones({ oficial, blue });
      } catch (error) {
        console.error("Error al obtener las cotizaciones:", error);
      }
    };

    obtenerCotizaciones();
  }, []);

  return (
    <div
      className="w-[330px] mb-3 bg-white 
                lg:fixed lg:bottom-0 lg:right-0 
                   rounded-md"
    >
      {cotizaciones.oficial && cotizaciones.blue ? (
        <div className="flex space-x-3 p-4">
          {/* Dólar Oficial */}
          <div className="bg-green-200 p-2 rounded-md flex flex-col items-center h-[80px] w-[135px] select-none">
            <h3 className="text-md font-semibold">Dólar Oficial</h3>
            <p className="text-sm font-semibold text-gray-800">
              Compra: ${cotizaciones.oficial.compra}
            </p>
            <p className="text-sm font-semibold text-gray-800">
              Venta: ${cotizaciones.oficial.venta}
            </p>
          </div>
          {/* Dólar Blue */}
          <div className="bg-green-200 p-2 rounded-md flex flex-col items-center h-[80px] w-[130px] select-none">
            <h3 className="text-md font-semibold">Dólar Blue</h3>
            <p className="text-sm font-semibold text-gray-800">
              Compra: ${cotizaciones.blue.compra}
            </p>
            <p className="text-sm font-semibold text-gray-800">
              Venta: ${cotizaciones.blue.venta}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center font-medium p-4 select-none">
          Cargando cotizaciones...
        </p>
      )}
    </div>
  );
};

export default CotizacionDolar;
