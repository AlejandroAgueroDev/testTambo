import { useEffect, useState } from "react";
import Titulo from "../../../../common/Titulo";

const DatosControlVeterinario = ({ setCloseModal, datos }) => {
    return (
        <div className="flex flex-col space-y-2 items-start w-[90vw] sm:w-[85vw] xl:w-[70vw]">
            <div className="w-full justify-between hidden sm:flex">
                <Titulo text={`CONTOL VETERINARIO | ${datos.fecha}`} />
                <button onClick={() => setCloseModal(false)} className="boton_rojo">
                    VOLVER
                </button>
            </div>
            <div className="w-full flex justify-between sm:hidden">
                <Titulo text={`CONTOL VETERINARIO`} />
                <button onClick={() => setCloseModal(false)} className="boton_rojo">
                    VOLVER
                </button>
            </div>

            <div className="w-full max-h-[75dvh] scrollbar overflow-auto">
                <div className="space-y-3 flex flex-col items-center">
                    <div className="w-full md:w-[90%]">
                        <label className="text-xl font-semibold text-white-bg3">Datos generales</label>
                        <div className=" bg-white-bg2 p-2 space-y-2 mx-auto">
                            <div className="flex flex-col w-full">
                                <label className="text-xl font-semibold text-white-bg3">Fecha</label>
                                <p className="bg-white-bg text-black-comun py-1 px-5 text-xl  grow">{datos.fecha}</p>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-xl font-semibold text-white-bg3">Nombre de veterinario</label>
                                <p className="bg-white-bg text-black-comun py-1 px-5 text-xl  grow">
                                    {datos.veterinario}
                                </p>
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-xl font-semibold text-white-bg3">Aclaraciones</label>
                                <p className="bg-white-bg text-black-comun py-1 px-5 text-xl  grow">{datos.detalle}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-[90%]">
                        <label className="text-xl font-semibold text-white-bg3">Animales afectados (caravanas)</label>
                        <div className="w-full scrollbar overflow-auto">
                            <div className="max-h-48 flex flex-wrap">
                                {datos.Ganados.map((ag) => (
                                    <p className="px-2 py-1 bg-[#b5b6d7] m-1">{ag.caravana}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        {/* aca va la foto del acta */}
                        <img src={datos.acta_url} alt="Acta del control" className="w-[500px]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatosControlVeterinario;
