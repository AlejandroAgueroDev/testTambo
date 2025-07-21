import { useEffect, useState } from "react";
import Titulo from "../../../../../../common/Titulo";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../../../../../../common/URL_SERVER";
import { obtenerFechaActual } from "../../../../../../common/obtenerFecha";

const AddCheque = ({
    setCloseModal,
    setMetodosLista,
    metodosLista,
    setMetodoPago,
    chequesYaSeleccionados,
    id_prov,
}) => {
    const [seleccionadosId, setSeleccionadosId] = useState([]);
    const [chequesDisponibles, setChequesDisponibles] = useState([]);
    const [chequera, setChequera] = useState(false);
    const [loader, setLoader] = useState(true);

    //! chequera
    const [formChequera, setFormChequera] = useState({
        importe: "",
        estado: "ENTREGADO",
        detalle: "",
        destino: "",
        banco: "",
        numero_cheque: "",
        fecha_emision: "",
        fecha_pago: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "importe" && value === "0") {
            return;
        }

        setFormChequera({
            ...formChequera,
            [name]: value,
        });
    };
    //! ********

    useEffect(() => {
        const traerCheques = async () => {
            const { data } = await axios.get(`${url}banco/cheques`);
            // console.log(data);
            setChequesDisponibles(
                data.filter((cheque) => cheque.estado === "PENDIENTE" && !chequesYaSeleccionados.includes(cheque.id))
            );
            setLoader(false);
        };
        traerCheques();
    }, []);

    const handleSelect = (id) => {
        if (!seleccionadosId.includes(id)) {
            setSeleccionadosId([...seleccionadosId, id]);
        } else {
            setSeleccionadosId(seleccionadosId.filter((i) => i !== id));
        }
    };

    const addCheque = () => {
        if (chequera) {
            if (
                !formChequera.banco ||
                !formChequera.numero_cheque ||
                !formChequera.fecha_emision ||
                !formChequera.fecha_pago ||
                !formChequera.importe
            ) {
                return Swal.fire({
                    title: "Complete los datos para agregar un nuevo cheque",
                    icon: "warning",
                    iconColor: "#D64747",
                    confirmButtonColor: "#D64747",
                });
            }
        } else {
            if (!seleccionadosId.length) {
                return Swal.fire({
                    title: "Complete los datos para agregar un nuevo cheque",
                    icon: "warning",
                    iconColor: "#D64747",
                    confirmButtonColor: "#D64747",
                });
            }
        }

        const chequesData = chequera
            ? [
                  {
                      importe: formChequera.importe,
                      metodo_pago: "Cheque (chequera)",
                      detalle: "Entrega de cheque",
                      metodo: "CHEQUE",
                      tipo_cheque: "CHEQUERA",
                      id: metodosLista.length + 1,
                      fecha: obtenerFechaActual("fecha"),
                      id_cliente: null,
                      id_proveedor: id_prov,
                      estado: "ACEPTADO",
                      tipo: "INGRESO",
                      datosCheque: {
                          banco: formChequera.banco,
                          numero_cheque: formChequera.numero_cheque,
                          fecha_emision: formChequera.fecha_emision,
                          fecha_pago: formChequera.fecha_pago,
                          importe: formChequera.importe,
                          detalle: formChequera.detalle,
                      },
                  },
              ]
            : seleccionadosId.map((s, index) => ({
                  importe: chequesDisponibles.find((c) => c.id === s).importe,
                  metodo_pago: "Cheque (cartera)",
                  detalle: "Entrega de cheque",
                  metodo: "CHEQUE",
                  tipo_cheque: "CARTERA",
                  id: metodosLista.length + 1,
                  fecha: obtenerFechaActual("fecha"),
                  id_cliente: null,
                  id_proveedor: id_prov,
                  estado: "ACEPTADO",
                  tipo: "INGRESO",
                  datosCheque: {
                      id_cheque: s,
                  },
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
        <div className="flex flex-col space-y-4 items-center w-[700px]">
            <div className="flex justify-between w-full items-center">
                <Titulo text="CARGAR CHEQUE" />
                <div className="flex space-x-2">
                    <strong>Chequera</strong>
                    <div
                        onClick={() => setChequera(!chequera)}
                        className={`w-[42px] h-[22px] rounded-full bg-[#c6c6c6] flex items-center justify-center p-[4px] cursor-pointer`}
                    >
                        <div
                            className={`${
                                chequera
                                    ? "bg-button-green translate-x-[-10px] duration-100"
                                    : "bg-button-red_hover translate-x-[10px] duration-100"
                            } w-[18px] h-[18px] rounded-full`}
                        ></div>
                    </div>
                    <strong>Cartera</strong>
                </div>
            </div>
            {chequera ? (
                <div className="flex flex-col space-y-2 w-full">
                    <div className="w-full flex justify-between">
                        <div className="flex flex-col w-[49%]">
                            <label className="labelInput">
                                Nombre del Banco<strong className="text-red-400">*</strong>
                            </label>
                            <input
                                onChange={handleInputChange}
                                type="text"
                                placeholder="Ej: Banco Galicia"
                                name="banco"
                                value={formChequera.banco}
                                className={`input`}
                            />
                        </div>

                        <div className="flex flex-col w-[49%]">
                            <label className="labelInput">
                                N° de cheque<strong className="text-red-400">*</strong>
                            </label>

                            <input
                                onChange={handleInputChange}
                                type="text"
                                placeholder="Ej: 123432124431123"
                                name="numero_cheque"
                                value={formChequera.numero_cheque}
                                className={`input`}
                            />
                        </div>
                    </div>

                    <div className="w-full flex justify-between">
                        <div className="flex flex-col w-[49%]">
                            <label className="labelInput">
                                Fecha de emisión<strong className="text-red-400">*</strong>
                            </label>
                            <input
                                onChange={handleInputChange}
                                type="date"
                                name="fecha_emision"
                                value={formChequera.fecha_emision}
                                className="input"
                            />
                        </div>

                        <div className="flex flex-col w-[49%]">
                            <label className="labelInput">
                                Fecha de pago<strong className="text-red-400">*</strong>
                            </label>
                            <input
                                onChange={handleInputChange}
                                type="date"
                                name="fecha_pago"
                                value={formChequera.fecha_pago}
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="labelInput">
                            Importe<strong className="text-red-400">*</strong>
                        </label>
                        <div className="flex items-center bg-white-bg2 pl-3 space-x-2 w-full grow">
                            <p className="text-xl text-white-bg3">$</p>
                            <input
                                placeholder="1000"
                                type="number"
                                onChange={handleInputChange}
                                name="importe"
                                value={formChequera.importe}
                                onKeyDown={(e) => {
                                    if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                        e.preventDefault();
                                    }
                                }}
                                className={`input`}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="labelInput">Concepto</label>
                        <textarea
                            onChange={handleInputChange}
                            placeholder="Concepto de la transferencia"
                            type="text"
                            name="detalle"
                            value={formChequera.detalle}
                            className="bg-white-bg2 text-black-comun py-2 px-3 text-xl max-h-20 min-h-20 w-full grow"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-2 sm:space-y-0 pt-4 w-full">
                        <button className="boton_rojo w-full sm:w-auto" onClick={close}>
                            CANCELAR
                        </button>
                        <button onClick={addCheque} className="boton_verde w-full sm:w-auto">
                            AGREGAR
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-base flex flex-col space-y-4 w-full" onKeyDown={handleKeyDownEnter}>
                    {/* Tabla con scroll horizontal en pantallas chicas */}
                    <div className="w-full overflow-x-auto rounded-md bg-white-bg text-sm sm:text-lg max-h-[60dvh]">
                        {loader ? (
                            <p>Cargando...</p>
                        ) : (
                            <table className="border-separate w-full relative">
                                <thead className="sticky top-0 bg-white-bg3 z-10">
                                    <tr className="bg-white-bg3 text-white-bg text-center">
                                        <th className="px-2">N° de cheque</th>
                                        <th className="px-2">Banco</th>
                                        <th className="px-2">Fecha pago</th>
                                        <th className="px-2">Importe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chequesDisponibles.length ? (
                                        chequesDisponibles.map((c) => (
                                            <tr
                                                key={c.id}
                                                className={
                                                    chequesYaSeleccionados.includes(c.numero_cheque)
                                                        ? "bg-[#ad7f7e] cursor-default"
                                                        : seleccionadosId.includes(c.id)
                                                        ? "bg-[#e2a2a2] hover:bg-button-red_hover cursor-pointer"
                                                        : "bg-white-bg2 hover:bg-white-bg3 cursor-pointer"
                                                }
                                                onClick={() => handleSelect(c.id)}
                                            >
                                                <td className="px-2">{c.numero_cheque}</td>
                                                <td className="px-2">{c.banco}</td>
                                                <td className="px-2">
                                                    {`${c.fecha_pago.split("T")[0].split("-")[1]}/${
                                                        c.fecha_pago.split("T")[0].split("-")[2]
                                                    }/${c.fecha_pago.split("T")[0].split("-")[0]}`}
                                                </td>
                                                <td className="px-2">$ {Number(c.importe).toFixed(2)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <p>No hay cheques disponibles.</p>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Botones responsivos */}
                    <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-2 sm:space-y-0 pt-4 w-full">
                        <button className="boton_rojo w-full sm:w-auto" onClick={close}>
                            CANCELAR
                        </button>
                        <button onClick={addCheque} className="boton_verde w-full sm:w-auto">
                            AGREGAR
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddCheque;
