import React, { useEffect, useState } from "react";
import Titulo from "../../../../common/Titulo";

const SeleccionarTributo = ({ setShowModal, tributos, setTributos, tributosId, setTributosId }) => {
    const [listaTributos, setListaTributos] = useState([]);

    const [listo, setListo] = useState(false);

    useEffect(() => {
        const tributos = [
            {
                label: "Impuestos nacionales",
                value: 1,
            },
            {
                label: "Impuestos provinciales",
                value: 2,
            },
            {
                label: "Impuestos municipales",
                value: 3,
            },
            {
                label: "Impuestos internos",
                value: 4,
            },
            {
                label: "Otros",
                value: 99,
            },
        ];

        const tributosValidos = [];

        tributos.map((t) => {
            if (!tributosId.map(Number).includes(Number(t.value))) {
                tributosValidos.push(t);
            }
        });

        setListaTributos(tributosValidos);
        setListo(true);
    }, []);

    const [data, setData] = useState({
        codigo: "",
        descripcion: "",
        alicuota: 0,
        importe: 0,
    });

    const handleChangeInput = (e) => {
        const v = e.target.value;
        const k = e.target.options[e.target.selectedIndex].text;

        console.log(tributosId, v);
        setData({ ...data, codigo: v, descripcion: k });
    };

    const agregar = () => {
        if (!data.codigo || !data.descripcion || !data.alicuota) {
            return;
        }

        const tributo = {
            codigo: data.codigo,
            descripcion: data.descripcion,
            alicuota: data.alicuota,
        };

        setTributos([...tributos, tributo]);
        setTributosId([...tributosId, tributo.codigo]);
        setShowModal(false);
    };

    return (
        <div className="flex flex-col space-y-4 items-start max-h-[80dvh]">
            <Titulo text="SELECCIONAR TRIBUTO" />

            <div className="w-[400px] space-y-2">
                <div className="w-full space-x-2 flex justify-between">
                    <select onChange={handleChangeInput} className="input">
                        <option selected disabled>
                            Seleccionar tributo
                        </option>
                        {listo &&
                            listaTributos.map((unidad) => (
                                <option key={unidad.value} value={unidad.value}>
                                    {unidad.label}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="w-full flex items-center space-x-3">
                    <label className="labelInput">Alicuota: %</label>
                    <input
                        onChange={(e) => setData({ ...data, alicuota: e.target.value })}
                        className="input"
                        type="number"
                    />
                </div>
            </div>

            <div className="w-[400px] flex justify-between">
                <button className="boton_rojo" onClick={() => setShowModal(false)}>
                    CANCELAR
                </button>

                <button className="boton_verde" onClick={agregar}>
                    AGREGAR
                </button>
            </div>
        </div>
    );
};

export default SeleccionarTributo;
