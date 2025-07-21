import Titulo from "../../common/Titulo";
import { useEffect, useState } from "react";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import { Link } from "react-router-dom";
import BarraSeparadora from "../../common/BarraSeparadora";
import TablaAnimalesTambo from "./components/animales/TablaAnimalesTambo";
import DataAnimalesTambo from "./components/animales/DataAnimalTambo";
import axios from "axios";
import { url } from "../../common/URL_SERVER";

const Animales = () => {
  const [animales, setAnimales] = useState([]);
  const [anilalSeleccionado, setAnimalSeleccionado] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(
          url + "tambo/ganado?limit=9999999999999999"
        );
        const dataFormat = [];
        response.data.data.map((a) => {
          if (a.tipo !== "TERNERA") {
            const fechaIngreso = a.fecha_ingreso
              .split("T")[0]
              .split("-")
              .reverse()
              .join("/");
            dataFormat.push({ ...a, fecha_ingreso_forma: fechaIngreso });
          }
        });

        setAnimales(dataFormat.reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ContenedorGeneral navText="TAMBO">
      <div className="w-screen md:w-full hidden sm:flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="TAMBO | ANIMALES" />
        <Link to="/tambo" className="boton_rojo">
          VOLVER
        </Link>
      </div>
      <div className="w-screen md:w-full sm:hidden flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="ANIMALES" />
        <Link to="/tambo" className="boton_rojo">
          VOLVER
        </Link>
      </div>
      <div className="w-full h-full flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between scrollbar overflow-auto">
        <TablaAnimalesTambo
          animales={animales}
          setAnimalSeleccionado={setAnimalSeleccionado}
          animalSeleccionado={anilalSeleccionado}
        />

        <div className="hidden sm:block">
          <BarraSeparadora orientacion="vertical" />
        </div>
        <div className="sm:hidden">
          <BarraSeparadora orientacion="horizontal" />
        </div>

        <DataAnimalesTambo animalSeleccionado={anilalSeleccionado} />
      </div>
    </ContenedorGeneral>
  );
};

export default Animales;
