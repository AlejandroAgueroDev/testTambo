const BarraSeparadora = ({ orientacion, color = "gris" }) => {
    return orientacion === "horizontal" ? (
        <div className={`w-full h-[2px] ${color === "gris" ? "bg-white-bg3 opacity-50" : "bg-black-comun"}`}></div>
    ) : (
        <div className={`w-[2px] h-full ${color === "gris" ? "bg-white-bg3 opacity-50" : "bg-black-comun"}`}></div>
    );
};

export default BarraSeparadora;
