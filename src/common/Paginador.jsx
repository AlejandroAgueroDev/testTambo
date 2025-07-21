import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

const Paginador = ({ cantidadPaginas, paginaActual, setPagina }) => {
    const [paginasAMostrar, setPaginasAMostrar] = useState([]);

    useEffect(() => {
        if (paginaActual === 1) {
            const arrayPaginas = [];
            if (cantidadPaginas <= 5) {
                for (let i = 1; i <= cantidadPaginas; i++) {
                    arrayPaginas.push(i);
                }
                setPaginasAMostrar(arrayPaginas);
            }

            if (cantidadPaginas > 5) {
                for (let i = 1; i <= 6; i++) {
                    arrayPaginas.push(i === 6 ? "..." : i);
                }
                setPaginasAMostrar(arrayPaginas);
            }
        } else {
            if (cantidadPaginas > 5) {
                if (paginaActual > 2) {
                    const arrayPaginas = [];
                    if (paginaActual < cantidadPaginas - 2) {
                        for (let i = paginaActual - 2; i <= paginaActual + 3; i++) {
                            arrayPaginas.push(i === paginaActual + 3 ? "..." : i);
                        }
                        setPaginasAMostrar(arrayPaginas);
                    } else {
                        for (let i = cantidadPaginas - 5; i <= cantidadPaginas; i++) {
                            arrayPaginas.push(i);
                        }
                        setPaginasAMostrar(arrayPaginas);
                    }
                } else {
                    const arrayPaginas = [];
                    for (let i = 1; i <= 6; i++) {
                        arrayPaginas.push(i === 6 ? "..." : i);
                    }
                    setPaginasAMostrar(arrayPaginas);
                }
            } else {
                const arrayPaginas = [];
                for (let i = 1; i <= cantidadPaginas; i++) {
                    arrayPaginas.push(i);
                }
                setPaginasAMostrar(arrayPaginas);
            }
        }
    }, [paginaActual]);

    return (
        <div className="w-full flex justify-center items-center space-x-5 text-xl">
            <IoIosArrowBack
                onClick={() => paginaActual > 1 && setPagina(paginaActual - 1)}
                className={`${
                    paginaActual === 1 ? "bg-white-bg3 cursor-default" : "bg-button-green hover:bg-button-green_hover"
                } text-white-bg cursor-pointer w-10 py-1 text-3xl`}
            />
            <div className="space-x-2 flex">
                {paginasAMostrar.map((pm, index) => (
                    <p
                    key={index}
                        className={`${
                            pm === paginaActual ? "bg-button-green_2" : "bg-white-bg2"
                        } w-10 text-center py-1`}
                    >
                        {pm}
                    </p>
                ))}
            </div>
            <IoIosArrowForward
                onClick={() => paginaActual < cantidadPaginas && setPagina(paginaActual + 1)}
                className={`${
                    paginaActual === cantidadPaginas
                        ? "bg-white-bg3 cursor-default"
                        : "bg-button-green hover:bg-button-green_hover"
                } text-white-bg cursor-pointer w-10 py-1 text-3xl`}
            />
        </div>
    );
};

export default Paginador;
