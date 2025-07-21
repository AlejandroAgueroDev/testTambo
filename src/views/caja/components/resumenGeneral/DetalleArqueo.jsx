// import Titulo from "../../../../common/Titulo";
// import { useState } from "react";

// const DetalleArqueo = ({ onClose }) => {
//   const [fechaDesde, setFechaDesde] = useState("");
//   const [fechaHasta, setFechaHasta] = useState("");
//   const datos = [
//     { fecha: "2025-04-07", detalle: "Pago", monto: 1000 },
//     { fecha: "2025-04-10", detalle: "Adelanto", monto: 500 },
//     { fecha: "2025-04-12", detalle: "Adelanto", monto: 500 },
//     { fecha: "2025-04-14", detalle: "Adelanto", monto: 500 },
//     { fecha: "2025-04-20", detalle: "Bono", monto: 200 },
//   ];

//   const filtrarPorFecha = () => {
//     if (!fechaDesde || !fechaHasta) return [];

//     return datos.filter((item) => {
//       const fecha = new Date(item.fecha);
//       const desde = new Date(fechaDesde);
//       const hasta = new Date(fechaHasta);
//       return fecha >= desde && fecha <= hasta;
//     });
//   };

//   const handleLimpiar = () => {
//     setFechaDesde("");
//     setFechaHasta("");
//   };

//   const datosFiltrados = filtrarPorFecha();

//   return (
//     <div className="flex flex-col space-y-2 items-start w-full font-NS">
//       <div className="w-full flex justify-between">
//         <Titulo text="DETALLE DE ARQUEO DE CAJA" />
//       </div>
//       <div className="space-y-3 w-full">
//         <div className="flex flex-col sm:flex-row sm:space-x-3 items-start sm:items-center">
//           <label className="labelInput">Fecha desde</label>
//           <input
//             type="date"
//             className="input"
//             value={fechaDesde}
//             onChange={(e) => setFechaDesde(e.target.value)}
//           />
//         </div>
//         <div className="flex flex-col sm:flex-row sm:space-x-3 items-start sm:items-center">
//           <label className="labelInput">Fecha hasta</label>
//           <input
//             type="date"
//             className="input"
//             value={fechaHasta}
//             onChange={(e) => setFechaHasta(e.target.value)}
//           />
//         </div>

//         {/* Tabla de resultados */}
//         {fechaDesde && fechaHasta && (
//           <>
//             {datosFiltrados.length > 0 ? (
//               <div className="overflow-x-auto max-h-[200px] scrollbar overflow-y-auto mt-4">
//                 <table className="border-separate text-lg md:w-[500px] w-[350px] relative">
//                   <thead className="sticky top-0 bg-white-bg3 z-10">
//                     <tr className="bg-white-bg3 text-white-bg text-center font-semibold">
//                       <td>Fecha</td>
//                       <td>Detalle</td>
//                       <td>Monto ($)</td>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {datosFiltrados.map((item, index) => (
//                       <tr key={index} className="bg-white-bg2 text-center">
//                         <td className="border p-2">{item.fecha}</td>
//                         <td className="border p-2">{item.detalle}</td>
//                         <td className="border p-2">$ {item.monto}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-center text-lg text-red-400 mt-4">
//                 No hay datos para este rango de tiempo.
//               </p>
//             )}
//           </>
//         )}

//         <div className="flex justify-end space-x-3 pt-5">
//           <button onClick={onClose} className="boton_rojo">
//             CERRAR
//           </button>
//           <button onClick={handleLimpiar} className="boton_verde">
//             LIMPIAR
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetalleArqueo;
