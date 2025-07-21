import Titulo from "../../../../common/Titulo";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";

const InsertarMontoCompromiso = ({
  onCancelar,
  servicios,
  fetchCasas,
}) => {
  const [monto, setMonto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAceptar = async (event) => {
    event.preventDefault()
    
    const montoNumerico = Number(monto);

    if (!monto || isNaN(montoNumerico) || montoNumerico <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Monto inválido",
        text: "Por favor, ingrese un monto válido mayor a 0.",
        confirmButtonColor: "#86C394",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const pagoServicio = {
        id_compromiso: servicios.id,
        monto: Number(monto),
        fecha: new Date().toISOString(),
      };

      const response = await axios.post(
        `${url}casa/compromiso/pagar`,
        pagoServicio
      );

      await fetchCasas();
      
      Swal.fire({
        icon: "success",
        title: "Pago registrado con éxito",
        confirmButtonColor: "#86C394",
        confirmButtonText: "OK",
      }).then(() => {
        onCancelar();
        setMonto("");
      });
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      Swal.fire({
        icon: "error",
        title: "Error al registrar el pago",
        text: error.message || "Intente nuevamente más tarde",
        confirmButtonColor: "#D64747",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-full">
      <div className="w-full flex justify-between">
        <Titulo text="MODIFICACION DE ESTADO DEL PAGO" />
      </div>
      <form onSubmit={handleAceptar} className="w-full space-y-3">
        <div className="containerInput">
          <label className="labelInput">Ingrese el monto pagado</label>
          <div className="flex items-center bg-white-bg2 pl-3 space-x-2 grow">
            <p className="text-xl text-white-bg3">$</p>
            <input
              placeholder="Ej 1000"
              type="number"
              className="input"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button
            className="boton_rojo"
            onClick={onCancelar}
            disabled={isSubmitting}
          >
            CANCELAR
          </button>
          <button
            className="boton_verde"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "PROCESANDO..." : "ACEPTAR"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsertarMontoCompromiso;
