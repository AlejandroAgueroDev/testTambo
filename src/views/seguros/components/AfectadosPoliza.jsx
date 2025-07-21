import Titulo from "../../../common/Titulo";

const AfectadosPoliza = ({ afectados, closeModal }) => {

  return (
    <div className="flex flex-col space-y-4 items-start w-[380px] sm:w-[560px]">
      <div className="w-full flex justify-between">
        <Titulo text="ENTES ASEGURADOS POR LA PÓLIZA" />
      </div>
      <div className="w-full max-h-[300px] scrollbar overflow-auto border border-gray-300 rounded p-4 bg-white-bg2">
        <p className="text-lg text-black-comun whitespace-pre-line">
          {afectados}
        </p>
      </div>
      <div className="w-full flex justify-end">
        <button
          onClick={closeModal}
          className="boton_rojo"
        >
          CERRAR
        </button>
      </div>
    </div>
  );
};

export default AfectadosPoliza;
