import logo from "../../assets/logo.jpg";
import logo_arca from "../../assets/logo_arca.jpg";
import { QRCode } from "qrcode";

export const handlePrint = (data, prod, totalesFinales, tributos) => {
    const listaProdServ = [];
    prod.forEach((p) => {
        if (p.descripcion || p.cantidad || p.unidad_medida || p.precio_unidad || p.iva || p.total) {
            listaProdServ.push({
                descripcion: p.descripcion,
                cantidad: p.cantidad,
                unidad_medida: p.unidad_medida_label,
                precio_unidad: p.precio_unidad,
                subtotal: p.cantidad * p.precio_unidad || "",
                iva: p.iva_label || "",
                iva_value: p.iva || "",
                total: p.total || "",
            });
        }
    });

    function roundTo(num, precision) {
        const factor = Math.pow(10, precision);
        return Math.round(num * factor) / factor;
    }

    const validarIvaB = (importe, iva) => {
        let total = 0;
        if (iva) {
            switch (iva) {
                case "4":
                    total = importe + importe * 0.105; // 10.5%
                    break;
                case "5":
                    total = importe + importe * 0.21; // 21%
                    break;
                case "6":
                    total = importe + importe * 0.27; // 27%
                    break;
                default:
                    total = importe; // Sin IVA
                    break;
            }
        }

        return total;
    };

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
          <head>
            <title>Factura</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css">
            <style>
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
           
          <div style="display: flex; justify-content: center; height: 100%;">
          <div style="
            background-color: #fff;
            min-width: 500px;
            width: 100%;
            aspect-ratio: 1/1.4142;
            display: grid;
            grid-template-rows: 150px 70px 1fr auto 120px;
          ">
            <!-- Header -->
            <div style="
              border: 2px solid #000;
              position: relative;
              width: 100%;
              display: flex;
            ">
              <!-- Tipo de factura -->
              <div style="
                border-left: 2px solid #000;
                border-right: 2px solid #000;
                border-top: 2px solid #000;
                border-bottom: 2px solid #000;
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                padding: 0 8px 4px 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
                background-color: #fff;
                z-index: 10;
              ">
                <p style="font-size: 38px; line-height: 36px;">
                  ${!data.tipoComprobante ? "-" : Number(data.tipoComprobante) === 1 ? "A" : "B"}
                </p>
                <p style="font-size: 10px; line-height: 6px;">COD. 00${data.tipoComprobante || "-"}</p>
              </div>
        
              <!-- Data izquierda -->
              <div style="
                width: 50%;
                height: 100%;
                border-right: 0.5px solid #000;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding-bottom: 10px;
                padding-right: 12px;
                padding-left: 10px;
              ">
                <div style="display: flex; justify-content: center; height: 60%; padding-top: 4px">
                  <img src="${logo}" style="object-fit: contain;">
                </div>
        
                <div>
                  <p style="font-size: 12px; line-height: 13px;">
                    <strong>Razón Social:</strong> DAMYA S.A.
                  </p>
                  <p style="font-size: 12px; line-height: 13px;">
                    <strong>Domicilio Comercial:</strong> Sofia C De Luque 2366 Dpto: 1 - Ciudad De Córdoba Sur, Córdoba
                  </p>
                  <p style="font-size: 12px; line-height: 13px;">
                    <strong>Condición frente al IVA: IVA Responsable Inscripto</strong>
                  </p>
                </div>
              </div>
        
              <!-- Data derecha -->
              <div style="
                width: 50%;
                height: 100%;
                padding-left: 36px;
                padding-top: 10px;
                padding-bottom: 10px;
                padding-right: 12px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              ">
                <div>
                  <p style="font-size: 18px; font-weight: bold;">FACTURA</p>
                  <div style="display: flex; justify-content: space-between;">
                    <p style="font-size: 12px; font-weight: bold;">Punto de venta: 000${data.puntoVenta}</p>
                    <p style="font-size: 12px; font-weight: bold;">Comp. Nro: ${data.numeroComprobante
                        .toString()
                        .padStart(8, "0")}</p>
                  </div>
                  <p style="font-size: 12px; font-weight: bold;">Fecha de emisión: ${data.fecha_sin_alterar}</p>
                </div>
        
                <div>
                  <p style="font-size: 12px; line-height: 13px;">
                    <strong>CUIT:</strong> 30710695276
                  </p>
                  <p style="font-size: 12px; line-height: 13px;">
                    <strong>Ingresos Brutos:</strong> 270836763
                  </p>
                  <p style="font-size: 12px; line-height: 13px;">
                    <strong>Fecha de Inicio de Actividades</strong> 04/11/2008
                  </p>
                </div>
              </div>
            </div>
        
            <!-- Info destinatario -->
            <div style="border: 2px solid #000; width: 100%; display: flex; margin-top: 8px;">
              <div style="
                width: 50%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding-bottom: 8px;
                padding-right: 12px;
                padding-left: 8px;
              ">
                <div>
                  <p style="font-size: 12px;">
                    <strong>CUIT:</strong> ${data.numeroDocumento || "-----------"}
                  </p>
                  <p style="font-size: 12px;">
                    <strong>Condición frente al IVA:</strong> ${data.condicionFrenteAlIva || "-----------------"}
                  </p>
                  <p style="font-size: 12px;">
                    <strong>Condición de venta:</strong> ${data.condicionDeVenta || "------------"}
                  </p>
                </div>
              </div>
        
              <div style="
                width: 50%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding-bottom: 8px;
                padding-right: 12px;
                padding-left: 8px;
              ">
                <div>
                  <p style="font-size: 12px;">
                    <strong>Nombre / Razón Social:</strong> ${data.nombreDestinatario || "---------------- -------"}
                  </p>
                  <p style="font-size: 12px;">
                    <strong>Domicilio Comercial:</strong> ${data.direccion || "---------------- --------------"}
                  </p>
                </div>
              </div>
            </div>
        
            <!-- Body -->
            <div style="border: 2px solid #000; width: 100%; margin-top: 8px; padding: 4px;">
              <table style="font-size: 12px; width: 100%;">
                <thead style="background-color: #fff; z-index: 10; color: #000;">
                  <tr>
                    <th style="padding: 2px; border: 2px solid #000;">Descripción</th>
                    <th style="padding: 2px; border-top: 2px solid #000; border-right: 2px solid #000; border-bottom: 2px solid #000;">Cant</th>
                    <th style="padding: 2px; border-top: 2px solid #000; border-right: 2px solid #000; border-bottom: 2px solid #000;">U.M</th>
                    <th style="padding: 2px; border-top: 2px solid #000; border-right: 2px solid #000; border-bottom: 2px solid #000;">Precio U.</th>
                    <th style="padding: 2px; border-top: 2px solid #000; border-right: 2px solid #000; border-bottom: 2px solid #000;">% Bonif</th>
                    <th style="padding: 2px; ${
                        data.tipoComprobante !== "1"
                            ? "display: none;"
                            : "border-top: 2px solid #000; border-right: 2px solid #000; border-bottom: 2px solid #000;"
                    }">Subtotal</th>
                    <th style="padding: 2px; ${
                        data.tipoComprobante !== "1"
                            ? "display: none;"
                            : "border-top: 2px solid #000; border-right: 2px solid #000; border-bottom: 2px solid #000;"
                    }">Alic. Iva</th>
                    <th style="padding: 2px; border-top: 2px solid #000; border-right: 2px solid #000; border-bottom: 2px solid #000;">
                      ${data.tipoComprobante === "1" ? "Subtotal c/IVA" : "Subtotal"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${listaProdServ
                      .map(
                          (ps) => `
                    <tr>
                      <td>${ps.descripcion}</td>
                      <td style="text-align: right; padding-right: 4px;">
                        ${roundTo(Number(ps.cantidad), 2).toLocaleString() || ""}
                      </td>
                      <td>${ps.unidad_medida}</td>
                      <td>
                        ${
                            ps.precio_unidad
                                ? data.tipoComprobante === "1"
                                    ? data.divisa === "PES"
                                        ? "$"
                                        : "USD"
                                    : ps.iva
                                    ? data.divisa === "PES"
                                        ? "$"
                                        : "USD"
                                    : ""
                                : ""
                        }
                          ${
                              data.tipoComprobante === "1"
                                  ? roundTo(Number(ps.precio_unidad), 2).toLocaleString() || ""
                                  : ps.iva
                                  ? validarIvaB(roundTo(Number(ps.precio_unidad), 2), ps.iva_value).toLocaleString() ||
                                    ""
                                  : ""
                          }
                      </td>
                      <td>0.00</td>
                      <td style="${data.tipoComprobante === "1" ? "" : "display: none;"}">
                        ${ps.subtotal ? (data.divisa === "PES" ? "$" : "USD") : ""} ${
                              roundTo(Number(ps.subtotal), 2).toLocaleString() || ""
                          }
                      </td>
                      <td style="${data.tipoComprobante === "1" ? "" : "display: none;"}">${ps.iva}</td>
                      <td>
                        ${ps.total ? (data.divisa === "PES" ? "$" : "USD") : ""} ${
                              roundTo(Number(ps.total), 2).toLocaleString() || ""
                          }
                      </td>
                    </tr>
                  `
                      )
                      .join("")}
                </tbody>
              </table>
            </div>
        
            <!-- Resultados -->
    <div style="border: 2px solid #000; width: 100%; display: flex; margin-top: 8px; padding-top: 4px; padding-bottom: 4px; padding-right: 8px; flex-direction: column;">

    <div style="text-align: end;">
                <p style="font-size: 12px">
                  Moneda: ${data.divisa === "PES" ? "PES - Peso Argentino" : "USD - Dólar Estadounidense"}
                </p>
    </div>

<div style="font-size: 8px; display: flex; justify-content: space-between; margin-bottom: 0.25rem">
 
    <div style="width: 50%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding-bottom: 0.5rem; padding-right: 0.75rem; padding-left: 0.5rem;">
        <div>
              ${
                  tributos.length
                      ? `
            <table style="font-size: 12px; width: 100%;">
                <thead style="background-color: #ffffff; color: #000000; position: relative; z-index: 10;">
                          <tr>
                              <th style="padding-left: 2px; padding-right: 2px; border-top: 2px solid #000000; border-bottom: 2px solid #000000; border-left: 2px solid #000000; border-right: 2px solid #000000;">
                                  Descripción
                              </th>
                              <th style="padding-left: 2px; padding-right: 2px; border-top: 2px solid #000000; border-bottom: 2px solid #000000; border-right: 2px solid #000000;">
                              Alic. %
                              </th>
                              <th style="padding-left: 2px; padding-right: 2px; border-top: 2px solid #000000; border-bottom: 2px solid #000000; border-right: 2px solid #000000;">
                                  Importe
                              </th>
                          </tr>
                </thead>
                <tbody>
                        ${tributos
                            .map(
                                (t) => `
                                <tr key=${t.codigo}>
                                <td>${t.descripcion}</td>
                                <td>${t.alicuota} %</td>
                              <td>${data.divisa === "PES" ? "$" : "USD"} ${roundTo(
                                    Number(t.importe) || 0,
                                    2
                                ).toLocaleString()}</td>
                              </tr>
                              `
                            )
                            .join("")}
                </tbody>
            </table>
            
            <div style="font-size: 12px; display: flex; justify-content: flex-end; column-gap: 0.5rem;">
            <strong style="text-align: end; width: 60%;">Importe Otros Tributos:</strong>
            <p style="width: 20%;">${data.divisa === "PES" ? "$" : "USD"} ${roundTo(
                            Number(totalesFinales.tributos) || 0,
                            2
                        ).toLocaleString()}</p>
              </div>
              `
                      : ""
              }
            </div>
    </div>
              
    <div style="width: 50%; height: 100%; display: flex; flex-direction: column; padding-bottom: 8px; padding-right: 12px; padding-left: 8px;">
      <div style="font-size: 12px; display: flex; justify-content: space-between;">
                  <strong style="text-align: right; width: 60%;">
                    ${data.tipoComprobante === "1" ? "Importe Neto Gravado" : "Subtotal"}: ${
        data.divisa === "PES" ? "$" : "USD"
    }
                  </strong>
                  <p>${roundTo(Number(totalesFinales.importeNeto) || 0, 2).toLocaleString()}</p>
      </div>
        
      <div style="font-size: 12px; ${
          data.tipoComprobante === "1" ? "display: flex;" : "display: none;"
      } justify-content: space-between;">
                  <strong style="text-align: right; width: 60%;">IVA 27%: ${
                      data.divisa === "PES" ? "$" : "USD"
                  }</strong>
                  <p>${roundTo(Number(totalesFinales.i27) || 0, 2).toLocaleString()}</p>
      </div>
      <div style="font-size: 12px; ${
          data.tipoComprobante === "1" ? "display: flex;" : "display: none;"
      } justify-content: space-between;">
                  <strong style="text-align: right; width: 60%;">IVA 21%: ${
                      data.divisa === "PES" ? "$" : "USD"
                  }</strong>
                  <p>${roundTo(Number(totalesFinales.i21) || 0, 2).toLocaleString()}</p>
      </div>
      <div style="font-size: 12px; ${
          data.tipoComprobante === "1" ? "display: flex;" : "display: none;"
      } justify-content: space-between;">
                  <strong style="text-align: right; width: 60%;">IVA 10.5%: ${
                      data.divisa === "PES" ? "$" : "USD"
                  }</strong>
                  <p>${roundTo(Number(totalesFinales.i10_5) || 0, 2).toLocaleString()}</p>
      </div>
      <div style="font-size: 12px; ${
          data.tipoComprobante === "1" ? "display: flex;" : "display: none;"
      } justify-content: space-between;">
                  <strong style="text-align: right; width: 60%;">IVA 0%: ${data.divisa === "PES" ? "$" : "USD"}</strong>
                  <p>${roundTo(Number(totalesFinales.i0) || 0, 2).toLocaleString()}</p>
      </div>
      <div style="font-size: 12px; display: flex; justify-content: space-between;">
                  <strong style="text-align: right; width: 60%;">Importe Otros Tributos: ${
                      data.divisa === "PES" ? "$" : "USD"
                  }</strong>
                  <p>${roundTo(Number(totalesFinales.tributos) || 0, 2).toLocaleString()}</p>
      </div>
      <div style="font-size: 14px; display: flex; justify-content: space-between;">
                  <strong style="text-align: right; width: 60%;">Importe Total: ${
                      data.divisa === "PES" ? "$" : "USD"
                  }</strong>
                  <p>${roundTo(Number(totalesFinales.total) || 0, 2).toLocaleString()}</p>
      </div>
    </div>
</div>
</div>
        
<!-- Footer -->
<div style="
  border: 2px solid #000;
  width: 100%;
  display: flex;
  margin-top: 8px;
  align-items: center;
  padding-left: 8px;
  padding-right: 8px;
  justify-content: space-between;
">
  <div style="display: flex;">
    <div style="
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
    ">
      ${data.svgQR}
    </div>

    <div style="display: flex; flex-direction: column; justify-content: space-around; align-items: flex-start;">
      <img src="${logo_arca}" style="height: 30px; object-fit: contain; padding-left: 2px;">
      <p style="font-size: 12px; font-style: italic; padding-left: 4px;">Comprobante Autorizado</p>
      <p style="font-size: 8px; padding-left: 4px;">
        Esta Agencia no se responsabiliza por los datos ingresados en el detalle de la operación
      </p>
    </div>
  </div>

  <div style="padding-right: 8px;">
    <p style="font-size: 12px; text-align: right;">
      <strong>CAE:</strong> ${data.cae}
    </p>
    <p style="font-size: 12px; text-align: right;">
      <strong>Fecha de Vencimiento:</strong> ${data.vencCae.split("-").reverse().join("/")}
    </p>
  </div>
</div>
</div>
</div>
            </div>

            <script>
              window.print();
              window.onafterprint = () => window.close();
            </script>
          </body>
        </html>
      `);
    printWindow.document.close();
};
