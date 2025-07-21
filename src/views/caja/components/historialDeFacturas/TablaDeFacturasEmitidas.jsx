import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";
import { useEffect, useState } from "react";
import { FaSheetPlastic } from "react-icons/fa6";
import Modal from "../../../../common/Modal";
import { Comprobante } from "./Comrpobnate";

const TablaFacturasEmitidas = () => {
  const [facturas, setFacturas] = useState([]);

  const [showComprobante, setShowComprobante] = useState(false);
  const [dataComprobante, setDataComprobante] = useState({});

  const handleShowComp = (data) => {
    setDataComprobante(data);
    setShowComprobante(true);
  };

  useEffect(() => {
    const obtenerFacturas = async () => {
      try {
        const { data } = await axios.get(`${url}afip/facturas`);
        setFacturas(data.reverse());
      } catch (error) {
        console.error("Error al obtener las facturas emitidas:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las facturas emitidas.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#D64747",
        });
      }
    };

    obtenerFacturas();
  }, []);

  return (
    <div className="space-y-1 pt-2">
      <div className="w-full scrollbar overflow-auto bg-white-bg">
        <div className="h-[800px] max-h-[70dvh] min-w-[648px]">
          <table className="border-separate text-lg w-full relative">
            <thead className="sticky top-0 bg-white-bg3 z-10">
              <tr className="bg-white-bg3 text-white-bg text-center">
                <td>Fecha emision</td>
                <td>Tipo Comp.</td>
                <td>N° Comprobante</td>
                <td>Destinatario</td>
                <td>Importe total</td>
                <td>N° CAE</td>
              </tr>
            </thead>
            <tbody>
              {facturas.length ? (
                facturas.map((f) => (
                  <tr key={f.id} className="bg-white-bg2 text-center">
                    <td className="px-1">
                      {f.fecha_emision.split("-").reverse().join("/") || "-"}
                    </td>
                    <td className="px-1">{f.tipo || "-"}</td>
                    <td className="px-1">{f.numero || "-"}</td>
                    <td className="px-1">{f.nombre_destinatario || "-"}</td>
                    <td className="px-1">$ {f.total || "-"}</td>
                    <td className="px-1">{f.cae || "-"}</td>
                    <td className="hover:bg-button-green_hover bg-button-green text-white-bg text-2xl cursor-pointer w-8">
                      <FaSheetPlastic
                        onClick={() => handleShowComp(f)}
                        className="m-auto"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Aun no hay facturas emitidas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showComprobante && (
        <Modal>
          <Comprobante
            data={dataComprobante}
            setShowComp={setShowComprobante}
            tributos={dataComprobante.TributosFacturaArcas}
            prod={dataComprobante.ProductoFacturaArcas}
          />
        </Modal>
      )}
    </div>
  );
};

export default TablaFacturasEmitidas;
