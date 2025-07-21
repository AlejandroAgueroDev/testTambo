import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white-bg  text-blue-gray-800 font-NS ">
      <h1 className="text-9xl font-bold">404</h1>
      <p className="text-xl mt-2">Página no encontrada</p>
      <img
        src="https://infonegocios.info/content/images/2022/07/20/24193/vacas-campo.jpg"
        alt="Vaca en el campo"
        className="mt-4 rounded-lg shadow-lg"
      />
      <p className="mt-4 text-blue-gray-800 text-xl font-semibold">
        Parece que te perdiste en el tambo... La página que buscas se ha ido a
        pastos más verdes.
      </p>
      <Link
        to="/home"
        className="mt-6 px-4 py-2 bg-gray-900 text-white-bg2 rounded-lg shadow hover:bg-gray-700 text-xl"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
