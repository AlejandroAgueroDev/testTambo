import { useEffect, useState } from "react";
import Titulo from "../../../../../common/Titulo";
import Swal from "sweetalert2";

const AddCheque = ({
  setCloseModal,
  setMetodosLista,
  metodosLista,
  setMetodoPago,
  chequesYaSeleccionados,
  chequesDisponibles,
}) => {
  const [cheques, setCheques] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [seleccionadosId, setSeleccionadosId] = useState([]);

  useEffect(() => {
    if (chequesDisponibles && Array.isArray(chequesDisponibles)) {
      const chequesValidos = chequesDisponibles.filter(
        (t) => t.estado === "En cartera"
      );
      setCheques(chequesValidos);
    }
  }, [chequesDisponibles]);

  const handleSelect = (id) => {
    if (!seleccionadosId.includes(id)) {
      setSeleccionados([...seleccionados, cheques.find((c) => c.id === id)]);
      setSeleccionadosId([...seleccionadosId, id]);
    } else {
      setSeleccionados(seleccionados.filter((c) => c.id !== id));
      setSeleccionadosId(seleccionadosId.filter((i) => i !== id));
    }
  };

  const addCheque = () => {
    if (!seleccionadosId.length) {
      return Swal.fire({
        title: "Complete los datos para agregar un nuevo cheque",
        icon: "warning",
        iconColor: "#D64747",
        confirmButtonColor: "#D64747",
      });
    }

    const chequesData = seleccionados.map((s, index) => ({
      ...s,
      metodo_pago: "Cheque",
      id: metodosLista.length + index + 1,
    }));

    setMetodosLista([...metodosLista, ...chequesData]);
    close();
  };

  const handleKeyDownEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addCheque();
    }
  };

  const close = () => {
    setCloseModal(false);
    setMetodoPago("none");
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[95vw] md:w-[85vw]">
      <Titulo text="NUEVO CHEQUE" />
      <div
        className="text-xl flex flex-col space-y-2 w-full"
        onKeyDown={handleKeyDownEnter}
      >
        <div className="w-full scrollbar overflow-auto">
          <div className="h-full max-h-[70dvh] min-w-[648px]">
            <table className="border-separate text-lg w-full relative">
              <thead className="sticky top-0 bg-white-bg3 z-10">
                <tr className="bg-white-bg3 text-white-bg text-center">
                  <td>N° de cheque</td>
                  <td>Banco</td>
                  <td>Fecha de pago</td>
                  <td>Importe</td>
                </tr>
              </thead>
              <tbody>
                {cheques.map((c) => (
                  <tr
                    key={c.id}
                    className={
                      chequesYaSeleccionados.includes(c.numero_cheque)
                        ? "bg-[#ad7f7e] cursor-default"
                        : seleccionadosId.includes(c.id)
                        ? "bg-button-red_inactivo hover:bg-button-red_hover cursor-pointer"
                        : "bg-white-bg2 hover:bg-white-bg3 cursor-pointer"
                    }
                    onClick={() =>
                      !chequesYaSeleccionados.includes(c.numero_cheque)
                        ? handleSelect(c.id)
                        : null
                    }
                  >
                    <td className="px-1">{c.numero_cheque}</td>
                    <td className="px-1">{c.banco}</td>
                    <td className="px-1">{c.fecha_pago}</td>
                    <td className="px-1">$ {Number(c.importe).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-3 pt-5 w-full">
          <button className="boton_rojo" onClick={close}>
            CANCELAR
          </button>
          <button onClick={addCheque} className="boton_verde ">
            AGREGAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCheque;
