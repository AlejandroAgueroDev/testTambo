import React, { useState } from "react";
import Titulo from "../../../../common/Titulo";

const SeleccionarUM = ({ setShowModal, id, prodServFactura, setProdServFactura }) => {
    const listaUnidades = [
        {
            label: "SIN DESCRIPCION | SD",
            value: 0,
        },
        {
            label: "KILOGRAMO | KG",
            value: 1,
        },
        {
            label: "METROS | M",
            value: 2,
        },
        {
            label: "METRO CUADRADO | M²",
            value: 3,
        },
        {
            label: "METRO CUBICO | M³",
            value: 4,
        },
        {
            label: "LITROS | L",
            value: 5,
        },
        {
            label: "UNIDAD | U",
            value: 7,
        },
        {
            label: "GRAMO | G",
            value: 14,
        },
        {
            label: "KILOMETRO | KM",
            value: 17,
        },
        {
            label: "TONELADA | T",
            value: 29,
        },
        {
            label: "MILILITRO | ML",
            value: 47,
        },
        {
            label: "OTRAS UNIDADES | OU",
            value: 98,
        },
    ];

    const handleChangeInput = (e) => {
        const v = e.target.value;
        const k = e.target.options[e.target.selectedIndex].text.split(" | ")[1];

        const getProdServId = (id) => {
            return prodServFactura.find((ps) => ps.id === Number(id));
        };

        const prodServMod = getProdServId(id);

        if (prodServMod) {
            let prodServ = {
                ...prodServMod,
                unidad_medida_label: k,
                unidad_medida: v,
            };

            setProdServFactura(prodServFactura.map((ps) => (ps.id === Number(id) ? prodServ : ps)));
        }

        setShowModal(false);
    };

    const quitarValor = () => {
        const getProdServId = (id) => {
            return prodServFactura.find((ps) => ps.id === Number(id));
        };

        const prodServMod = getProdServId(id);

        if (prodServMod) {
            let prodServ = {
                ...prodServMod,
                unidad_medida_label: "",
                unidad_medida: "",
            };

            setProdServFactura(prodServFactura.map((ps) => (ps.id === Number(id) ? prodServ : ps)));
        }

        setShowModal(false);
    };

    return (
        <div className="flex flex-col space-y-4 items-start max-h-[80dvh]">
            <Titulo text="SELECCIONAR UNIDAD DE MEDIDA" />

            <div className="w-[400px] space-x-2 flex justify-between">
                <select onChange={handleChangeInput} className="input">
                    <option selected disabled>
                        Seleccionar unidad
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

export default SeleccionarUM;
