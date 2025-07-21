import Titulo from "../../common/Titulo";
import { useEffect, useState } from "react";
import ContenedorGeneral from "../../common/ContenedorGeneral";
import { Link } from "react-router-dom";
import BarraSeparadora from "../../common/BarraSeparadora";
import TablaTernerasHembras from "./components/hembras/TablaTernerasHembras";
import axios from "axios";
import DatosTernera from "./components/hembras/DatosTernera";
import { url } from "../../common/URL_SERVER";

const Hembras = () => {
  const [animales, setAnimales] = useState([]);
  const [anilalSeleccionado, setAnimalSeleccionado] = useState(null);
  const [loader, setLoader] = useState(true);

  const fetchData = async () => {
    //! TRAER DATOS DE TERNERAS HEMBRAS
    try {
      setLoader(true);
      const response = await axios(url + "tambo/ganado?limit=9999999999999999");
      setLoader(false);

      const dataFormat = [];
      response.data.data.map((a) => {
        if (a.tipo === "TERNERA") {
          const fechaIngreso = a.fecha_ingreso
            .split("T")[0]
            .split("-")
            .reverse()
            .join("/");
          dataFormat.push({ ...a, fecha_ingreso_format: fechaIngreso });
        }
      });
      setAnimales(dataFormat.reverse());
    } catch (error) {
      setLoader(false);
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ContenedorGeneral navText="RECRIA">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="RECRIA | HEMBRAS" />

        <Link to="/recria" className="boton_rojo">
          VOLVER
        </Link>
      </div>
      <div className="w-full h-full flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between scrollbar overflow-auto">
        <TablaTernerasHembras
          animales={animales}
          setAnimalSeleccionado={setAnimalSeleccionado}
          animalSeleccionado={anilalSeleccionado}
          loader={loader}
        />
        <div className="hidden sm:block">
          <BarraSeparadora orientacion="vertical" />
        </div>
        <div className="sm:hidden">
          <BarraSeparadora orientacion="horizontal" />
        </div>

        <DatosTernera animalSeleccionado={anilalSeleccionado} fetchData={fetchData}/>
      </div>
    </ContenedorGeneral>
  );
};

export default Hembras;
