const CargarRetiro = () => {
    return (
        <div className="w-full md:w-[49%] flex flex-col items-center space-y-2 p-2 xl:p-5 bg-white-bg h-full">
            <div className="flex w-full">
                <h2 className="text-white-bg py-2 px-5 text-lg bg-black-comun">CARGAR COMPRA</h2>
            </div>

            <div className="w-full flex flex-col sm:flex-row justify-between">
                <div className="flex flex-col w-full sm:w-[48%]">
                    <label className="text-xl font-semibold text-white-bg3">Fecha</label>
                    <input
                        // onChange={hanlder}
                        placeholder="1000 lts"
                        type="date"
                        name="fecha_retiro"
                        className="bg-white-bg2 text-black-comun py-2 px-5 text-xl w-full"
                    />
                </div>

                <div className="flex flex-col  w-full sm:w-[48%]">
                    <label className="text-xl font-semibold text-white-bg3">Tambo</label>
                    <select
                        // onChange={hanlder}
                        name="tambo"
                        className="bg-white-bg2 text-black-comun py-2.5 px-5 text-xl"
                    >
                        <option selected disabled>
                            Seleccionar tambo
                        </option>
                        <option value="Tambo 1">Tambo 1</option>
                        <option value="Tambo 2">Tambo 2</option>
                        <option value="Tambo 3">Tambo 3</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col w-full">
                <label className="text-xl font-semibold text-white-bg3">Detalles del tambo</label>
                <div className="bg-white-bg2 space-y-1 py-1 px-2">
                    <p>Propietario:</p>
                    <p>Localidad:</p>
                    <p>contacto:</p>
                </div>
            </div>

            <div className="flex flex-col w-full">
                <label className="text-xl font-semibold text-white-bg3">Litros</label>
                <input
                    // onChange={hanlder}
                    placeholder="1000 lts"
                    type="number"
                    name="litros"
                    className="bg-white-bg2 text-black-comun py-2 px-5 text-xl"
                />
            </div>

            <div className="flex flex-col w-full">
                <label className="text-xl font-semibold text-white-bg3">Aclaraciones</label>
                <textarea
                    // onChange={hanlder}
                    placeholder="Aclaraciones sobre esta producción"
                    type="number"
                    name="aclaraciones"
                    className="bg-white-bg2 text-black-comun py-2 px-5 text-xl max-h-20 min-h-20"
                />
            </div>

            <div className="space-x-2 flex justify-end w-full">
                <button className="boton_rojo">CANCELAR</button>
                <button className="boton_verde">CARGAR</button>
            </div>
        </div>
    );
};

export default CargarRetiro;
