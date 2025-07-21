import axios from "axios";
import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BiLoaderAlt } from "react-icons/bi";
import { url } from "../../../../common/URL_SERVER";

const Liquidar = ({ setCloseModal, retirosNoLiquidados }) => {
  const [loader, setLoader] = useState(false);
  const [formLiquidacion, setFormLiquidacion] = useState({
    precio_litro: 0,
    importe_total: 0,
    importe_blanco: 0,
    importe_negro: 0,
    fecha: "",
    arrayIdRetiros: [],
  });
  const [totalLitros, setTotalLitros] = useState(0);

  const handleForm = (e) => {
    const { name, value } = e.target;

    // Bloquear "0" en el input de importe
    if (
     (["precio_litro", "importe_blanco", "importe_negro"].includes(name)) && value === "0"
    ) {
      return; // No actualiza el estado si el valor es "0"
    }

    setFormLiquidacion({ ...formLiquidacion, [name]: value });
  };

  //? MARGENES DE FECHAS
  const [margenes, setMargenes] = useState({ desde: "", hasta: "" });

  const handleMargenes = (fecha) => {
    if (!margenes.desde && !margenes.hasta) {
      setMargenes({ ...margenes, desde: fecha });
    } else if (margenes.desde && !margenes.hasta) {
      const desde = new Date(margenes.desde);
      const newFecha = new Date(fecha);

      if (desde.getTime() > newFecha.getTime()) {
        setMargenes({ desde: fecha, hasta: margenes.desde });
      } else {
        setMargenes({ desde: margenes.desde, hasta: fecha });
      }
    } else {
      setMargenes({ desde: fecha, hasta: "" });
    }
  };

  useEffect(() => {
    if (!margenes.hasta) {
      const idRetiro = [];
      let totalLitros = 0;
      retirosNoLiquidados.map((r) => {
        if (r.fecha === margenes.desde) {
          idRetiro.push(r.id);
          totalLitros += r.cantidad;
        }
      });
      setFormLiquidacion({ ...formLiquidacion, arrayIdRetiros: idRetiro });
      setTotalLitros(totalLitros);
    } else {
      const idRetiros = [];
      let totalLitros = 0;

      const desde = new Date(margenes.desde);
      const hasta = new Date(margenes.hasta);

      retirosNoLiquidados.map((r) => {
        const fecha = new Date(r.fecha);

        if (
          fecha.getTime() >= desde.getTime() &&
          fecha.getTime() <= hasta.getTime()
        ) {
          idRetiros.push(r.id);
          totalLitros += r.cantidad;
        }
      });
      setFormLiquidacion({ ...formLiquidacion, arrayIdRetiros: idRetiros });
      setTotalLitros(totalLitros);
    }
  }, [margenes]);

  useEffect(() => {
    const importeTotal = formLiquidacion.precio_litro * totalLitros;
    setFormLiquidacion({ ...formLiquidacion, importe_total: importeTotal });
  }, [formLiquidacion.precio_litro, totalLitros]);

  const handleCarga = () => {
    if (
      !formLiquidacion.precio_litro ||
      !formLiquidacion.importe_blanco ||
      !formLiquidacion.importe_negro ||
      !formLiquidacion.importe_total ||
      !formLiquidacion.fecha ||
      !formLiquidacion.arrayIdRetiros.length
    ) {
      return Swal.fire({
        title: "Complete los campos necesarios para completar la liquidación",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#D64747",
        icon: "warning",
      });
    }

    setLoader(true);

    const formFinal = {
      ...formLiquidacion,
      litros: totalLitros,
    };

    axios
      .post(url + "tambo/retiroleche/liquidacion", formFinal)
      .then((res) => {
        setLoader(false);
        Swal.fire({
          title: "¡Liquidación cargada con éxito!",
          confirmButtonText: "Aceptar",
          icon: "success",
          confirmButtonColor: "#86C394",
        }).then(() => window.location.reload());
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
        Swal.fire({
          title: "Ocurrio un error inesperado, intente nuevamente",
          text:
            error.message === "Network Error"
              ? "Contacte con el servicio técnico"
              : error,
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#D64747",
          icon: "error",
        });
      });
  };

  return (
    <div className="flex flex-col space-y-2 items-start w-[95vw] lg:w-[800px]">
      <div className="w-full flex justify-between">
        <Titulo text={`LIQUIDAR VENTA`} />
      </div>

      <div className="w-full space-y-3">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-3 max-h-[87dvh] scrollbar overflow-auto">
          <div className="w-full lg:w-[50%] space-y-1">
            <div className="flex flex-col w-full">
              <label className="text-xl font-semibold text-white-bg3">
                Fecha <strong className="text-red-400">*</strong>
              </label>
              <input
                placeholder="Nombre empresa"
                type="date"
                onChange={handleForm}
                name="fecha"
                value={formLiquidacion.fecha}
                className="bg-white-bg2 text-black-comun py-2 px-5 text-xl w-full grow"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-xl font-semibold text-white-bg3">
                Precio por litro <strong className="text-red-400">*</strong>
              </label>
              <input
                placeholder="Ej: 1000"
                type="number"
                onChange={handleForm}
                name="precio_litro"
                onKeyDown={(e) => {
                  if (
                    e.key === "e" ||
                    e.key === "E" ||
                    e.key === "+" ||
                    e.key === "-"
                  ) {
                    e.preventDefault();
                  }
                }}
                value={formLiquidacion.precio_litro || ""}
                className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-xl font-semibold text-white-bg3">
                Total litros
              </label>
              <p className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow">
                {totalLitros}
              </p>
            </div>

            <div className="flex flex-col w-full">
              <label className="text-xl font-semibold text-white-bg3">
                Importe total <strong className="text-red-400">*</strong>
              </label>
              <input
                placeholder="Se sumara automaticamente"
                type="number"
                onChange={handleForm}
                disabled
                name="importe_total"
                value={formLiquidacion.importe_total || ""}
                className="bg-white-bg2 text-black-comun py-2 px-5 text-xl grow"
              />
            </div>

            <div className="flex w-full justify-between">
              <div className="flex flex-col w-[48%]">
                <label className="text-xl font-semibold text-white-bg3">
                  Importe con recibo <strong className="text-red-400">*</strong>
                </label>
                <input
                  onChange={handleForm}
                  type="number"
                  value={formLiquidacion.importe_blanco || ""}
                  name="importe_blanco"
                  onKeyDown={(e) => {
                    if (
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "+" ||
                      e.key === "-"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Ej: 1000"
                  className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                />
              </div>
              <div className="flex flex-col w-[48%]">
                <label className="text-xl font-semibold text-white-bg3">
                  Importe sin recibo <strong className="text-red-400">*</strong>
                </label>
                <input
                  onChange={handleForm}
                  type="number"
                  value={formLiquidacion.importe_negro || ""}
                  name="importe_negro"
                  onKeyDown={(e) => {
                    if (
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "+" ||
                      e.key === "-"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Ej: 1200"
                  className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                />
              </div>
            </div>
          </div>

          <div className=" w-full lg:w-[50%] max-h-[433px]">
            <label className="text-xl font-semibold text-white-bg3">
              Seleccione los retiros a liquidar{" "}
              <strong className="text-red-400">*</strong>
            </label>
            <div className="h-[92%] w-full scrollbar overflow-auto">
              <table className="border-separate text-lg w-full text-black-comun">
                <thead className="sticky top-0 bg-white-bg3 z-10">
                  <tr className="bg-white-bg3 text-center">
                    <td>Fecha</td>
                    <td>Hora</td>
                    <td>Litros</td>
                  </tr>
                </thead>
                <tbody className="relative">
                  {retirosNoLiquidados.length ? (
                    retirosNoLiquidados.map((retiros) => (
                      <tr
                        onClick={() =>
                          handleMargenes(retiros.fecha, retiros.hora_retiro)
                        }
                        key={retiros.id}
                        className={`${
                          formLiquidacion.arrayIdRetiros.includes(retiros.id)
                            ? "bg-button-red hover:bg-button-red_hover text-white-bg2"
                            : "bg-white-bg2 hover:bg-white-bg_hover"
                        } cursor-pointer text-center`}
                      >
                        <td>{retiros.fecha_muestra}</td>
                        <td>{retiros.hora_retiro}</td>
                        <td>{retiros.cantidad}</td>
                      </tr>
                    ))
                  ) : (
                    <p className="text-white-bg3 absolute text-md">
                      No se encontraron retiros sin liquidar
                    </p>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end space-x-3">
          <button onClick={() => setCloseModal(false)} className="boton_rojo">
            CANCELAR
          </button>
          <button onClick={handleCarga} className="boton_verde">
            {loader ? (
              <BiLoaderAlt className="animate-spin text-black-comun text-center w-full" />
            ) : (
              "CARGAR"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Liquidar;
