import Titulo from "../../../../common/Titulo";

const TodasLasCuentas = ({ setCloseModal, cuentas, selectCuenta }) => {
  const handleSelect = (cuenta) => {
    selectCuenta(cuenta, cuenta.nombre_cuenta.toUpperCase());
    setCloseModal(false);
  };

  return (
    <div className="h-full sm:min-w-[800px] w-[380px]">
      <div className="flex mb-4">
        <Titulo text="TODAS LAS CUENTAS" />
      </div>

      <div className="h-full max-h-[70dvh] scrollbar overflow-auto bg-white-bg">
        <table className="border-separate text-lg w-full relative">
          <thead className="sticky top-0 bg-white-bg3 z-10">
            <tr className="bg-white-bg3 text-white-bg text-center">
              <td>Nombre</td>
              <td>Alias o CBU</td>
              <td>Saldo</td>
            </tr>
          </thead>
          <tbody className="bg-white-bg2">
            {cuentas.length ? (
              cuentas.map((cuenta) => (
                <tr
                  key={cuenta.id}
                  className="bg-white-bg2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelect(cuenta)}
                >
                  <td className="px-1">{cuenta.nombre_cuenta}</td>
                  <td className="px-1">{cuenta.alias_cbu}</td>
                  <td className="px-1">$ {cuenta.saldo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Aun no hay cuentas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-end mt-4">
        <button onClick={() => setCloseModal(false)} className="boton_rojo">
          CERRAR
        </button>
      </div>
    </div>
  );
};

export default TodasLasCuentas;
