import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

//?INSTRUCCIONES DE USO
//todo Crear un handleDowload el cual tiene que tener una const headers=["Fecha", "Detalle", "Debe ($)", "Haber ($)"] que van a ser la cantidad
//todo y nombre de los encabezados.
//todo Y al ejecutar la funcion exportToExcel(`ResumenCuenta_${empleado.nombre}`, headers, datosCuenta); se envian:
//todo ResumenCuenta_${empleado.nombre} => que va a ser el titulo que tendra el documento
//todo headers => que son los encabezados definidos
//todo datosCuenta=> que seran los datos que lleguen desde el back

export const exportToExcel = async (fileName, headers, data) => {
  if (!data || data.length === 0) {
    console.error("No hay datos para exportar");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Resumen");

  // Agregar encabezados con estilos
  worksheet.addRow(headers);
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "0C7169" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });

  let totalHaber = 0; // Variable para almacenar la suma total de la columna "Haber"

  // Agregar datos con estilos
  data.forEach((rowData) => {
    // Comprobar si Debe y Haber son números antes de usar toFixed
    const debeValue =
      typeof rowData.debe === "number" ? rowData.debe.toFixed(2) : "0.00";
    const haberValue =
      typeof rowData.haber === "number" ? rowData.haber.toFixed(2) : "0.00";

    const row = worksheet.addRow([
      rowData.fecha, // Se usa 'fecha' en lugar de 'Fecha'
      rowData.detalle, // Se usa 'detalle' en lugar de 'Detalle'
      `$${debeValue}`, // Convertir a formato de moneda
      `$${haberValue}`, // Convertir a formato de moneda
    ]);

    // Sumar el valor de la columna "Haber"
    totalHaber += parseFloat(haberValue);

    row.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ADD8E6" },
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // Agregar una fila para el saldo total
  const saldoTotalRow = worksheet.addRow([
    "",
    "",
    "Saldo Total",
    `$${totalHaber.toFixed(2)}`,
  ]);

  // Definir la columna en la que estará el "Saldo Total" y aplicar estilo a las celdas
  saldoTotalRow.getCell(3).font = { bold: true }; // Aplica estilo al "Saldo Total" en la columna 3
  saldoTotalRow.getCell(3).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "0C7169" }, // Mismo color de fondo que los encabezados
  };
  saldoTotalRow.getCell(3).alignment = {
    horizontal: "center",
    vertical: "middle",
  };
  saldoTotalRow.getCell(3).border = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  saldoTotalRow.getCell(4).font = { bold: true }; // Aplica estilo al valor de "Saldo Total"
  saldoTotalRow.getCell(4).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "ADD8E6" }, // Mismo color de fondo que los datos
  };
  saldoTotalRow.getCell(4).alignment = {
    horizontal: "center",
    vertical: "middle",
  };
  saldoTotalRow.getCell(4).border = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  // Ajustar ancho de columnas automáticamente
  worksheet.columns.forEach((column) => {
    column.width = 20;
  });

  // Crear el archivo y descargarlo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${fileName}.xlsx`);
};
