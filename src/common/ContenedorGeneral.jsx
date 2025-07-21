import NavBar from "./NavBar";

const ContenedorGeneral = ({ navText, children }) => {
    return (
        <section className="flex h-screen">
            <NavBar section={navText} />
            <div className="bg-white-bg sombra grow md:m-5 md:ml-[40px] xl:ml-5 p-2 space-y-1 flex flex-col w-full">
                {children}
            </div>
        </section>
    );
};

export default ContenedorGeneral;
