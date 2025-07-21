// import Titulo from "../../common/Titulo";
// import ContenedorGeneral from "../../common/ContenedorGeneral";
// import { Link } from "react-router";
// import { useEffect, useState } from "react";
// import { exportToExcel } from "../../common/exportToExcel";
// import Modal from "../../common/Modal";
// import DetalleArqueo from "./components/resumenGeneral/DetalleArqueo";

// const ResumenGeneral = () => {
//   const datosCuenta = [
//     { fecha: "2024-04-01", detalle: "Pago", debe: 1000, haber: 2 },
//     { fecha: "2024-04-10", detalle: "Adelanto", debe: 500, haber: 50 },
//     { fecha: "2024-04-15", detalle: "Bono", debe: 0, haber: 200 },
//   ];
//   const [mes, setMes] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   const handleDowload = () => {
//     const headers = ["Fecha", "Detalle", "Debe ($)", "Haber ($)"];
//     exportToExcel(`ResumenCuenta_$`, headers, datosCuenta);
//   };

//   useEffect(() => {
//     // Obtener el año y mes actual en formato YYYY-MM
//     const fechaActual = new Date();
//     const mesActual = (fechaActual.getMonth() + 1).toString().padStart(2, "0"); // Asegurarse de que el mes tenga dos dígitos
//     const añoActual = fechaActual.getFullYear();
//     const mesFormateado = `${añoActual}-${mesActual}`; // Formato YYYY-MM
//     setMes(mesFormateado); // Establecer el valor en el estado
//   }, []);

//   return (
//     <ContenedorGeneral navText="CAJA">
//       {/* Título y Volver */}
//       <div className="font-NS w-screen md:w-full flex justify-between items-center pl-14 md:pl-0 pr-4 md:pr-0">
//         <Titulo text="RESUMEN DE CUENTA GENERAL" />
//         <Link to={`/caja`} className="boton_rojo">
//           VOLVER
//         </Link>
//       </div>
  
//       <div className="h-screen flex flex-col">
//         {/* Tabla con Scroll */}
//         <div className="h-full flex-1 p-2 scrollbar overflow-auto w-full bg-white-bg2">
//           <div className="bg-white-bg2 min-w-[648px]">
//             <table className="border-separate text-lg w-full relative">
//               <thead className="sticky top-0 bg-white-bg3 z-10">
//                 <tr className="bg-white-bg3 text-white-bg text-center font-semibold">
//                   <th>Tipo</th>
//                   <th>Fecha</th>
//                   <th>Detalle</th>
//                   <th>Origen</th>
//                   <th>Destino</th>
//                   <th>Monto ($)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* Aquí irán los datos filtrados por mes y año */}
//               </tbody>
//             </table>
//           </div>
//         </div>
  
//         {/* Botones fijos abajo */}
//         {/* <div className="p-4 bg-white-bg flex flex-col md:flex-row justify-between gap-4">
//           <button onClick={handleDowload} className="boton_verde">
//             DESCARGAR RESUMEN CUENTA
//           </button>
//           <button onClick={handleOpenModal} className="boton_verde">
//             DETALLE DE ARQUEO
//           </button>
//         </div> */}
//       </div>
  
//       {showModal && (
//         <Modal>
//           <DetalleArqueo onClose={handleCloseModal} />
//         </Modal>
//       )}
//     </ContenedorGeneral>
//   );
  
// };

// export default ResumenGeneral;
