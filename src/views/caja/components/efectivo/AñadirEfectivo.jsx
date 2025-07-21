import axios from "axios";
import { useEffect, useState } from "react";
import Titulo from "../../../../common/Titulo";
import { BiLoaderAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import { url } from "../../../../common/URL_SERVER";

const AñadirEfectivo = ({ onClose, sectores, fetchData }) => {
  const [loader, setLoader] = useState(false);
  const [moneda, setMoneda] = useState("");
  const [cotizacion, setCotizacion] = useState("");
  const [importeConvertido, setImporteConvertido] = useState("");
  const [formData, setFormData] = useState({
    importe: "",
    tipo: "",
    detalle: "",
  });

  useEffect(() => {
    if (moneda === "DOLARES" && formData.importe && cotizacion) {
      const calculado = parseFloat(formData.importe) * parseFloat(cotizacion);
      setImporteConvertido(calculado.toFixed(2));
    } else {
      setImporteConvertido("");
    }
  }, [formData.importe, cotizacion, moneda]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { importe, tipo, detalle } = formData;

    if (!importe || !tipo || !detalle) {
      return Swal.fire("Faltan datos", "Completa todos los campos", "warning");
    }

    const importeFinal =
      moneda === "DOLARES"
        ? parseFloat(importeConvertido)
        : parseFloat(importe);

    const payload = {
      detalle: formData.detalle,
      estado: "ACEPTADO",
      tipo: formData.tipo,
      fecha: new Date().toISOString(),
      id_sector: formData.sector,
      metodosPago: [
        {
          metodo: "EFECTIVO",
          monto: Number(importeFinal),
        },
      ],
    };

    try {
      setLoader(true);
      console.log("datos a enviar:", payload);

      await axios.post(`${url}gasto-ingreso`, payload);
      Swal.fire({
        title: `Efectivo agregado correctamente!`,
        confirmButtonText: "Aceptar",
        icon: "success",
        confirmButtonColor: "#86C394",
        iconColor: "#86C394",
      }).then(() => {
        fetchData()
        onClose();
      });
    } catch (error) {
      console.error("Error al agregar efectivo:", error);
      Swal.fire({
        title: `No se pudo realizar la operacion.`,
        text: error.response?.data?.message || "Algo salió mal",
        confirmButtonText: "Aceptar",
        icon: "error",
        confirmButtonColor: "#D64747",
        iconColor: "#D64747",
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-full font-NS">
      <div className="w-full flex justify-between">
        <Titulo text="AÑADIR EFECTIVO A LA CAJA" />
      </div>

      <div className="space-y-3 w-full">
        <div className="containerInput">
          <label className="labelInput">Seleccione tipo de Movimiento</label>
          <select
            name="tipo"
            className="input"
            value={formData.tipo}
            onChange={handleChange}
          >
            <option value="" disabled>
              Seleccionar tipo movimiento
            </option>
            <option value="INGRESO">ACREDITAR A LA CAJA</option>
            <option value="EGRESO">DEBITAR DE LA CAJA</option>
          </select>
        </div>
        <div className="containerInput">
          <label className="labelInput">Seleccione sector de imputación</label>
          <select
            name="sector"
            className="input"
            value={formData.sector || ""}
            onChange={handleChange}
          >
            <option value="" disabled>
              Seleccionar sector
            </option>
            {sectores.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="containerInput">
          <label className="labelInput">Moneda</label>
          <select
            className="input"
            value={moneda || ""}
            onChange={(e) => setMoneda(e.target.value)}
          >
            <option value="" disabled>
              Seleccione tipo de moneda
            </option>
            <option value="PESOS">PESOS</option>
            <option value="DOLARES">DÓLARES</option>
          </select>
        </div>

        {moneda === "DOLARES" && (
          <div className="containerInput">
            <label className="labelInput">Cotización</label>
            <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow">
              <p className="text-xl text-white-bg3">$</p>
              <input
                type="number"
                className="input"
                value={cotizacion}
                onChange={(e) => setCotizacion(e.target.value)}
                placeholder="Ej: 1200"
              />
            </div>
          </div>
        )}

        <div className="containerInput">
          <label htmlFor="importe" className="labelInput">
            Cantidad a ingresar ({moneda})
          </label>
          <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow">
            <p className="text-xl text-white-bg3">$</p>
            <input
              type="number"
              id="importe"
              name="importe"
              className="input"
              placeholder="Ej: 1000"
              value={formData.importe}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
              }}
            />
          </div>
        </div>

        {moneda === "DOLARES" && (
          <div className="containerInput">
            <label className="labelInput">Importe final en PESOS</label>
            <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow">
              <p className="text-xl text-white-bg3">$</p>
              <input
                type="text"
                className="input"
                placeholder="Esperando importes..."
                value={importeConvertido}
                disabled
              />
            </div>
          </div>
        )}

        <div className="containerInput">
          <label className="labelInput">Detalle del movimiento</label>
          <input
            type="text"
            name="detalle"
            className="input"
            value={formData.detalle}
            onChange={handleChange}
            placeholder="Ingrese detalle sobre el movimiento."
          />
        </div>

        <div className="w-full flex justify-end space-x-3">
          <button onClick={() => onClose(false)} className="boton_rojo">
            CANCELAR
          </button>
          <button
            className="boton_verde"
            onClick={handleSubmit}
            disabled={loader}
          >
            {loader ? (
              <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
            ) : (
              "ACEPTAR"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AñadirEfectivo;
