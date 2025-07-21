import { useEffect, useState } from "react";
import Modal from "../../../../common/Modal";
import SeleccionarUM from "../../../caja/components/emitirFactura/SeleccionarUM";
import SeleccionarIVA from "../../../caja/components/emitirFactura/SeleccionarIVA";

export const TablaProductosFactura = ({ prodServFactura, setProdServFactura }) => {
    const [showUM, setShowUM] = useState(false);
    const [idProd, setIdProd] = useState("");
    const [showIVA, setShowIVA] = useState(false);

    const [completados, setCompletdos] = useState(0);

    useEffect(() => {
        let count = 0;

        prodServFactura.forEach((ps) => {
            if (ps.descripcion || ps.cantidad || ps.precio_unidad || ps.unidad_medida || ps.iva) {
                count++;
            }
        });

        setCompletdos(count);
    }, [prodServFactura]);

    const showUnidadMedida = (id) => {
        setIdProd(id);
        setShowUM(true);
    };

    const showIVASelect = (id) => {
        setIdProd(id);
        setShowIVA(true);
    };

    const handleChangeInput = (e) => {
        const id = e.target.id;
        const p = e.target.name;
        let v = p === "descripcion" ? e.target.value.toUpperCase() : e.target.value;

        if (p === "precio_unidad" || p === "cantidad") {
            v = v.replace(/[^0-9.,]/g, "").replace(/,/g, ".");
        }

        if (v.toString() === "NaN") {
            return;
        }

        if ((p === "cantidad" && v <= 0) || (p === "precio_unidad" && v <= 0)) {
            v = "";
        }

        const getProdServId = (id) => {
            return prodServFactura.find((ps) => ps.id === Number(id));
        };

        const prodServMod = getProdServId(id);

        if (prodServMod) {
            let prodServ;
            if (prodServMod.cantidad && p === "precio_unidad") {
                const subTotal = parseFloat(prodServMod.cantidad) * parseFloat(v);
                prodServ = { ...prodServMod, [p]: v, sub_total: subTotal }; // Guarda como número
            } else if (prodServMod.precio_unidad && p === "cantidad") {
                const subTotal = parseFloat(prodServMod.precio_unidad) * parseFloat(v);
                prodServ = { ...prodServMod, [p]: v, sub_total: subTotal }; // Guarda como número
            } else {
                prodServ = { ...prodServMod, [p]: v };
            }

            const prodServConTotal = validarTotal(prodServ);
            setProdServFactura(prodServFactura.map((ps) => (ps.id === Number(id) ? prodServConTotal : ps)));
        }
    };

    const validarTotal = (obj) => {
        let total = 0;
        if (obj.cantidad && obj.precio_unidad && obj.sub_total) {
            // Aseguramos que sub_total sea tratado como número
            total =
                typeof obj.sub_total === "string" ? parseFloat(obj.sub_total.replace(/[^0-9.-]/g, "")) : obj.sub_total;

            if (obj.iva) {
                switch (obj.iva) {
                    case "4":
                        total *= 1.105;
                        break; // 10.5%
                    case "5":
                        total *= 1.21;
                        break; // 21%
                    case "6":
                        total *= 1.27;
                        break; // 27%
                    // Otros casos no modifican el total
                }
            }
        }
        return { ...obj, total: roundTo(total, 2) };
    };

    // Función auxiliar para redondear
    function roundTo(num, decimals) {
        return Math.round((num + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }

    return (
        <div className="w-full">
            <div className="h-full scrollbar max-h-56 overflow-auto">
                <table className="border-separate text-lg w-full relative">
                    <thead className="sticky top-0 align-bottom bg-white-bg3 z-10 text-white-bg2">
                        <tr>
                            <th className="px-[2px] w-[40%]">Descripción</th>
                            <th className="px-[2px] w-[10%]">Cant</th>
                            <th className="px-[2px] w-[5%]">U.M</th>
                            <th className="px-[2px] w-[17%]">Precio</th>
                            <th className="px-[2px] w-[10%]">Iva</th>
                            <th className="px-[2px] w-[17%]">Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white-bg2">
                        {prodServFactura.map((ps) => (
                            <tr key={ps.id}>
                                <td>
                                    <input
                                        type="text"
                                        className="w-full bg-white-bg2 px-2 rounded-none"
                                        value={ps.descripcion}
                                        id={ps.id}
                                        onChange={handleChangeInput}
                                        name="descripcion"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="w-full bg-white-bg2 px-2 rounded-none text-end"
                                        onChange={handleChangeInput}
                                        name="cantidad"
                                        value={ps.cantidad}
                                        id={ps.id}
                                    />
                                </td>
                                <td
                                    onClick={() => showUnidadMedida(ps.id)}
                                    className="hover:bg-[#b7c5b4] cursor-pointer"
                                >
                                    {ps.unidad_medida_label}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="w-full bg-white-bg2 px-1 rounded-none"
                                        onChange={handleChangeInput}
                                        name="precio_unidad"
                                        value={ps.precio_unidad}
                                        id={ps.id}
                                    />
                                </td>
                                <td onClick={() => showIVASelect(ps.id)} className="hover:bg-[#d7c8aa] cursor-pointer">
                                    {ps.iva_label === "NO GRAVADO"
                                        ? "NG"
                                        : ps.iva_label === "EXTENTO"
                                        ? "EX"
                                        : ps.iva_label}
                                </td>
                                <td>{!ps.total ? "" : `$${roundTo(ps.total, 2).toLocaleString()}`}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODALES */}

            {showUM && (
                <Modal>
                    <SeleccionarUM
                        setShowModal={setShowUM}
                        id={idProd}
                        prodServFactura={prodServFactura}
                        setProdServFactura={setProdServFactura}
                    />
                </Modal>
            )}

            {showIVA && (
                <Modal>
                    <SeleccionarIVA
                        setShowModal={setShowIVA}
                        id={idProd}
                        prodServFactura={prodServFactura}
                        setProdServFactura={setProdServFactura}
                        validarTotal={validarTotal}
                    />
                </Modal>
            )}
        </div>
    );
};
