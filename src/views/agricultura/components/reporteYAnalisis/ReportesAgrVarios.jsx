import Titulo from "../../../../common/Titulo";
import { useState, useEffect } from "react";
import { url } from "../../../../common/URL_SERVER";
import axios from "axios";

export default function ReporteAgrVarios() {
  const [cantidadHectareas, setCantidadHectareas] = useState(0);
  const [cantidadLotes, setCantidadLotes] = useState(0);

  useEffect(() => {
    axios(url + "agricultura/").then(({ data }) => {
      let contadorHectareas = 0;
      let contadorLotes = 0;
      data.map((d) => {
        contadorHectareas += d.hectareas;
        contadorLotes += 1;
      });
      setCantidadHectareas(contadorHectareas);
      setCantidadLotes(contadorLotes);
    });
  }, []);

  return (
    <div className="w-full space-y-2 p-2">
      <div className="flex justify-between">
        <Titulo text="REPORTES VARIOS" />
      </div>

      <div className="bg-white-bg2 flex flex-col p-2">
        <p className="text-lg font-semibold text-white-bg3">
          Cantidad de Hectareas:
        </p>
        <p className="text-lg font-semibold text-black-comun">
          {cantidadHectareas} has.
        </p>
      </div>

      <div className="bg-white-bg2 flex flex-col p-2">
        <p className="text-lg font-semibold text-white-bg3">
          Cantidad de lotes:
        </p>
        <p className="text-lg font-semibold text-black-comun">
          {cantidadLotes} {cantidadLotes === 1 ? "lote." : "lotes."}
        </p>
      </div>
    </div>
  );
}
