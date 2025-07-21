import React, { useState } from "react";
import Titulo from "../../../../common/Titulo";

const SeleccionarIVA = ({ setShowModal, id, prodServFactura, setProdServFactura, validarTotal }) => {
    const listaUnidades = [
        {
            label: "NO GRAVADO",
            value: 1,
        },
        {
            label: "EXTENTO",
            value: 2,
        },
        {
            label: "0%",
            value: 3,
        },
        {
            label: "10,50%",
            value: 4,
        },
        {
            label: "21%",
            value: 5,
        },
        {
            label: "27%",
            value: 6,
        },
    ];

    const handleChangeInput = (e) => {
        const v = e.target.value;
        const k = e.target.options[e.target.selectedIndex].text;

        const getProdServId = (id) => {
            return prodServFactura.find((ps) => ps.id === Number(id));
        };

        const prodServMod = getProdServId(id);

        let total;

        if (prodServMod) {
            let prodServ = {
                ...prodServMod,
                iva_label: k,
                iva: v,
            };

            const prodServConTotal = validarTotal(prodServ);

            setProdServFactura(prodServFactura.map((ps) => (ps.id === Number(id) ? prodServConTotal : ps)));
            setShowModal(false);
        }
    };

    const quitarValor = () => {
        const getProdServId = (id) => {
            return prodServFactura.find((ps) => ps.id === Number(id));
        };

        const prodServMod = getProdServId(id);

        if (prodServMod) {
            let prodServ = {
                ...prodServMod,
                iva_label: "",
                iva: "",
                total: Number(prodServMod.sub_total), // Resetea el total al sub_total
            };

            const prodServConTotal = validarTotal(prodServ);

            setProdServFactura(prodServFactura.map((ps) => (ps.id === Number(id) ? prodServConTotal : ps)));
        }

        setShowModal(false);
    };

    return (
        <div className="flex flex-col space-y-4 items-start max-h-[80dvh]">
            <Titulo text="SELECCIONAR IVA" />

            <div className="w-[400px] space-x-2 flex justify-between">
                <select onChange={handleChangeInput} className="input">
                    <option selected disabled>
                        Seleccionar IVA
                    </option>
                    {listaUnidades.map((unidad) => (
                        <option key={unidad.value} value={unidad.value}>
                            {unidad.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="w-[400px] flex justify-between">
                <button className="boton_rojo" onClick={quitarValor}>
                    QUITAR VALOR
                </button>

                <button className="boton_rojo" onClick={() => setShowModal(false)}>
                    CANCELAR
                </button>
            </div>
        </div>
    );
};

export default SeleccionarIVA;
