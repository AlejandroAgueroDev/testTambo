import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const SearchableSelect = ({ options, onSelect, placeholder, value }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const containerRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    setSearchTerm(option.label || "");
    setShowOptions(false);
    onSelect(option.value, option.label);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
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
        value={value ?? searchTerm}
        onChange={(e) => setSearchTerm(e.target.value || "")}
        onFocus={() => setShowOptions(true)}
        placeholder={placeholder}
        className="bg-white-bg2 text-black py-2 px-3 text-xl w-full"
      />

      {/* Opciones desplegables */}
      {showOptions && (
        <ul className="absolute z-10 w-full mt-1 bg-white-bg2 shadow-lg shadow-black max-h-60 scrollbar overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                {option.label}
              </li>
            ))
          ) : (
            <ul className="pb-4">
              <li className="px-3 py-2 text-gray-500">
                No se encontraron datos
              </li>
            </ul>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
