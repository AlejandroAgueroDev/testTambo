import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Busqueda from "../../../../common/Busqueda";
import { useState, useEffect } from "react";

const TablaAnimalesTambo = ({ animales, setAnimalSeleccionado, animalSeleccionado }) => {
    const [animalesFiltrados, setAnimalesFiltrados] = useState(animales);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setAnimalesFiltrados(animales);
    }, [animales]);

    const handleChangeSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        const animalesSearch = animales.filter((a) => a.caravana.toLowerCase().includes(value.toLowerCase()));
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
                        <td>Caravana</td>
                        <td>Tipo</td>
                    </tr>
                </thead>
                <tbody>
                    {animalesFiltrados.length ? (
                        animalesFiltrados.map((g) => (
                            <tr
                                key={g.id}
                                className={
                                    animalSeleccionado && animalSeleccionado.id === g.id
                                        ? "bg-button-red_hover"
                                        : "bg-white-bg2 hover:bg-white-bg_hover cursor-pointer"
                                }
                                onClick={() => setAnimalSeleccionado(g)}
                            >
                                <td className="px-1 text-center">{g.caravana}</td>
                                <td className="px-1 text-center">{g.tipo}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Aun no hay animales cargados
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TablaAnimalesTambo;
