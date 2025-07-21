import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportSegurosToExcel = async (fileName, headers, data) => {
  if (!data || data.length === 0) {
    console.error("No hay datos de seguros para exportar");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Historial de Seguros");

  // Agregar encabezados
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

  // Agregar datos
  data.forEach((item) => {
    const row = worksheet.addRow([
      item.nombreAseguradora,
      item.seccion,
      item.numeroPoliza,
      item.vigenciaDesde,
      item.vigenciaHasta,
    ]);

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

  // Ajustar ancho de columnas
  worksheet.columns.forEach((column) => {
    column.width = 25;
  });

  // Exportar archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${fileName}.xlsx`);
};
