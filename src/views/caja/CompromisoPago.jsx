import ContenedorGeneral from "../../common/ContenedorGeneral";
import Titulo from "../../common/Titulo";
import { Link } from "react-router-dom";
import TablaCompromisoPago from "./components/compromisoPago/TablaCompromisoPago";
import { useEffect, useState } from "react";
import TablaPagoEventual from "./components/pagoEventual/TablaPagoEventual";
import axios from "axios";
import { url } from "../../common/URL_SERVER";

const CompromisoPago = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [casaId, setCasaId] = useState(null);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${url}casa?isCaja=true`);
      setPagos(data);
      if (data.length > 0) {
        setCasaId(data[0].id);
      }
    } catch (error) {
      console.log("Error al traer los datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ContenedorGeneral navText="CAJA">
      <div className="w-screen md:w-full flex justify-between pl-14 md:pl-0 pr-4 md:pr-0">
        <Titulo text="CAJA " />
        <div className="flex gap-4">
          <Link to="/caja" className="boton_rojo flex justify-end">
            VOLVER
          </Link>
        </div>
      </div>
      <div className="w-full h-full flex flex-col space-y-3 scrollbar overflow-y-auto">
        <TablaCompromisoPago
          pagos={pagos}
          fetchData={fetchData}
          casaId={casaId}
        />

        <TablaPagoEventual
          pagos={pagos}
          fetchData={fetchData}
          casaId={casaId}
        />
      </div>
    </ContenedorGeneral>
  );
};

export default CompromisoPago;
