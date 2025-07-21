import Busqueda from "../../../../common/Busqueda";
import { useState, useEffect } from "react";
import LoaderDatos from "../../../../common/LoaderDatos";

const TablaTernerasHembras = ({
  animales,
  setAnimalSeleccionado,
  animalSeleccionado,
  loader,
}) => {
  const [animalesFiltrados, setAnimalesFiltrados] = useState(animales);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setAnimalesFiltrados(animales);
  }, [animales]);

  const handleChangeSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const animalesSearch = animales.filter((animal) =>
      animal.caravana.toLowerCase().includes(value.toLowerCase())
    );
    setAnimalesFiltrados(animalesSearch);
  };

  const clearSearch = () => {
    setSearch("");
    setAnimalesFiltrados(animales);
  };

  return (
    <div className="w-full md:w-[49%] flex flex-col items-start space-y-2 bg-white-bg h-full scrollbar overflow-auto">
      <Busqueda
        placeholder="Buscar por caravana"
        color="blanco"
        handler={handleChangeSearch}
        clear={clearSearch}
        value={search}
      />
      <table className="border-separate text-lg w-full relative">
        <thead className="sticky top-0 bg-white-bg3 z-10">
          <tr className="bg-white-bg3 text-white-bg text-center">
            <td className="truncate">Caravana</td>
            <td className="truncate">Fecha de ingreso</td>
          </tr>
        </thead>
        {loader ? (
          <LoaderDatos textLoader="Cardando terneras" />
        ) : (
          <tbody>
            {animalesFiltrados.length ? (
              animalesFiltrados.map((animal) => (
                <tr
                  key={animal.id}
                  className={
                    animalSeleccionado && animalSeleccionado.id === animal.id
                      ? "bg-button-red_hover"
                      : "bg-white-bg2 hover:bg-white-bg_hover cursor-pointer"
                  }
                  onClick={() => setAnimalSeleccionado(animal)}
                >
                  <td className="px-1 text-center">{animal.caravana}</td>
                  <td className="px-1 text-center">
                    {animal.fecha_ingreso_format || "Sin datos"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Aun no hay terneras cargadas
                </td>
              </tr>
            )}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default TablaTernerasHembras;
