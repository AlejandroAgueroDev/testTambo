import { CiTempHigh } from "react-icons/ci";
import { MdOutlineDateRange } from "react-icons/md";
import { CiMemoPad } from "react-icons/ci";

const PronosticoExtendido = ({ forecast, onClose }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Pronóstico para los{" "}
        <strong className="underline">próximos 3 días</strong>
      </h2>

      {/* Contenedor con scroll */}
      <div className="w-full max-h-[500px] scrollbar overflow-y-auto scrollbar">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {forecast.slice(0, Math.min(forecast.length, 5)).map((day) => (
            <div
              key={day.date}
              className="bg-gradient-to-r text-white-bg from-blue-gray-700 to-blue-gray-500 shadow-md rounded-lg p-4 text-white mx-auto h-[300px] w-[390px] flex flex-col justify-between text-xl"
            >
              <p className="flex items-center min-h-[40px]">
                <MdOutlineDateRange className="mr-2 size-10" />
                <strong>Fecha:</strong>
                <span className="underline ml-2">
                  {new Date(day.date).toLocaleDateString("es-AR")}
                </span>
              </p>
              <p className="flex items-center min-h-[40px]">
                <CiTempHigh className="mr-2 size-10" />
                <strong>Temp. máx.:</strong>
                <span className="ml-2">{day.day.maxtemp_c}°C</span>
              </p>
              <p className="flex items-center min-h-[40px]">
                <CiTempHigh className="mr-2 size-10" />
                <strong>Temp. mín.:</strong>
                <span className="ml-2">{day.day.mintemp_c}°C</span>
              </p>
              <p className="flex items-center min-h-[40px]">
                <CiMemoPad className="size-10" />
                <strong className="ml-2">Condición:</strong>
                <span className="ml-2">{day.day.condition.text}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        className="boton_rojo mt-4 ml-auto"
        onClick={() => onClose(false)}
      >
        CERRAR
      </button>
    </div>
  );
};

export default PronosticoExtendido;
