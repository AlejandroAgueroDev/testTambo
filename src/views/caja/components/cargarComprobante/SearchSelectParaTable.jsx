import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";

const SearchableSelectParaTable = ({ setFormData, formData, id_sector, index }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [options, setOptions] = useState([]);
    const [optionsListLabels, setOptionsListLabels] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchProductos = async () => {
            const response = await axios.get(`${url}insumo/${id_sector}`);
            console.log(response.data);

            const formatRes = response.data.data.map((item) => ({
                value: item.id,
                label: item.nombre,
            }));

            const soloLabels = response.data.data.map((item) => item.nombre);

            setOptionsListLabels(soloLabels);
            setOptions(formatRes);
        };

        fetchProductos();
    }, [id_sector]);

    const filteredOptions = options.filter((option) => option.label?.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSelect = (option) => {
        setSearchTerm(option.label || "");
        setShowOptions(false);

        const newProducto = { ...formData.productos[index] };

        newProducto.descripcion = option.label;
        newProducto.id_producto = option.value;

        const copiaProductos = [...formData.productos];

        copiaProductos[index] = newProducto;

        // console.log({ ...formData, productos: copiaProductos });
        setFormData({ ...formData, productos: copiaProductos });
    };

    const handleChange = (e) => {
        setSearchTerm(e.target.value.toUpperCase() || "");

        const newProducto = { ...formData.productos[index] };

        newProducto.descripcion = e.target.value;
        if (optionsListLabels.includes(e.target.value)) {
            const foundOption = options.find((option) => option.label === e.target.value);
            newProducto.id_producto = foundOption ? foundOption.value : "";
        } else {
            newProducto.id_producto = "";
        }

        const copiaProductos = [...formData.productos];

        copiaProductos[index] = newProducto;

        // console.log({ ...formData, productos: copiaProductos });
        setFormData({ ...formData, productos: copiaProductos });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Campo de búsqueda */}
            <input
                type="text"
                value={searchTerm}
                placeholder="Selecione o ingrese un producto/servicio"
                onChange={handleChange}
                onFocus={() => setShowOptions(true)}
                className={`${
                    formData.productos[index].id_producto ? "text-black-comun" : "text-button-red"
                } bg-white-bg  px-2 text-xl w-full`}
            />

            {/* Opciones desplegables */}
            {showOptions && (
                <ul className="absolute z-50 w-full mt-1 bg-white-bg shadow-lg shadow-black max-h-60 scrollbar overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                className="px-3 cursor-pointer hover:bg-gray-100 text-start"
                            >
                                {option.label}
                            </li>
                        ))
                    ) : (
                        <ul className="pb-4">
                            <li className="px-3 text-gray-500">
                                Producto no existente, si se carga este, se creara uno nuevo.
                            </li>
                        </ul>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchableSelectParaTable;
