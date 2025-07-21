import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { url } from "../../../../common/URL_SERVER";

const SearchableSelectParaProv = ({ setFormData, formData, id_sector }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [options, setOptions] = useState([]);
    const [optionsListLabels, setOptionsListLabels] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchProductos = async () => {
            const response = await axios.get(`${url}proveedor?id_sector=${id_sector}`);
            console.log(response.data);

            const formatRes = response.data.map((item) => ({
                value: item.id,
                label: item.nombre_empresa,
            }));

            const soloLabels = response.data.map((item) => item.nombre_empresa.toUpperCase());

            setOptionsListLabels(soloLabels);
            setOptions(formatRes);
        };

        fetchProductos();
    }, [id_sector]);

    const filteredOptions = options.filter((option) => option.label?.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSelect = (option) => {
        setSearchTerm(option.label || "");
        setShowOptions(false);

        setFormData({ ...formData, razon_social: option.label, id_proveedor: option.value });
    };

    const handleChange = (e) => {
        setSearchTerm(e.target.value.toUpperCase() || "");

        if (optionsListLabels.includes(e.target.value.toUpperCase())) {
            const foundOption = options.find((option) => option.label === e.target.value);
            setFormData({ ...formData, razon_social: foundOption.label, id_proveedor: foundOption.value });
        } else {
            setFormData({ ...formData, razon_social: e.target.value, id_proveedor: "" });
        }
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
                placeholder="Selecione o ingrese un producto/servicio"
                value={searchTerm}
                onChange={handleChange}
                onFocus={() => setShowOptions(true)}
                className={`${
                    formData.id_proveedor ? "text-black-comun" : "text-button-red"
                } bg-white-bg py-2 px-5 text-xl w-full`}
            />

            {/* Opciones desplegables */}
            {showOptions && (
                <ul className="absolute z-50 w-full mt-1 bg-white-bg shadow-lg shadow-black max-h-60 scrollbar overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-start"
                            >
                                {option.label}
                            </li>
                        ))
                    ) : (
                        <ul className="pb-4">
                            <li className="px-3 py-2 text-gray-500">
                                Proveedor no existente, si se carga este, se creara uno nuevo.
                            </li>
                        </ul>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchableSelectParaProv;
