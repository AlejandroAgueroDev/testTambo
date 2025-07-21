import Chart from "react-apexcharts";
import Titulo from "../../../../common/Titulo";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { url } from "../../../../common/URL_SERVER";

const ReporteProductos = () => {
  const [loading, setLoading] = useState(true);
  const [ventas, setVentas] = useState([]);
  const [año, setAño] = useState(new Date().getFullYear().toString());
  const [añoAnterior, setAñoAnterior] = useState(false);
  const [añoInput, setAñoInput] = useState("");

  const [configuracionGrafico, setConfiguracionGrafico] = useState({
    type: "donut",
    height: 400,
    series: [],
    options: {
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      labels: [],
      chart: {
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: [
        "#D64747",
        "#86C394",
        "#d6d447",
        "#8A2BE2",
        "#FF7F50",
        "#20B2AA",
      ],
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: function (value) {
            return value + (value === 1 ? " venta" : " ventas");
          },
        },
      },
      legend: {
        position: "right",
        horizontalAlign: "center",
      },
    },
  });

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${url}fabrica/ventaproducto`);
        setVentas(data);
        procesarDatosGrafico(data, año);
      } catch (error) {
        console.error("Error al obtener ventas:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los datos de productos",
          icon: "error",
          confirmButtonColor: "#D64747",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, [año]);

  const procesarDatosGrafico = (ventas, añoFiltro) => {
    // Agrupar ventas por producto SOLO del año seleccionado
    const ventasPorProducto = {};
    ventas.forEach((venta) => {
      // Filtrar por año
      const añoVenta = venta.fecha.split("T")[0].split("-")[0];
      if (añoVenta !== añoFiltro) return;
      venta.Productos.forEach((p) => {
        const producto = p.nombre ? `${p.nombre}` : "No definido";
        ventasPorProducto[producto] =
          (ventasPorProducto[producto] || 0) + p.VentaProducto.cantidad;
      });
    });

    const productos = Object.keys(ventasPorProducto);
    const cantidades = Object.values(ventasPorProducto);

    setConfiguracionGrafico((prev) => ({
      ...prev,
      series: cantidades,
      options: {
        ...prev.options,
        labels: productos,
      },
    }));
  };

  const handleAñoActual = () => {
    setAño(new Date().getFullYear().toString());
    setAñoAnterior(false);
  };

  const handleBuscarAño = () => {
    if (!añoInput || añoInput.length !== 4) {
      return Swal.fire({
        title: "Año inválido",
        text: "Por favor ingrese un año válido (4 dígitos)",
        icon: "warning",
        confirmButtonColor: "#D64747",
      });
    }
    setAño(añoInput);
    setAñoAnterior(false);
  };

  const hayDatos =
    configuracionGrafico.series &&
    configuracionGrafico.series.length > 0 &&
    configuracionGrafico.series.some((v) => v > 0);

  return (
    <div className="w-full space-y-2 p-2">
  <div className="flex justify-between">
    <Titulo text={`VENTAS POR PRODUCTO | AÑO ${año}`} />
  </div>

  {loading ? (
    <div className="flex justify-center items-center h-64">
      <p className="text-white-bg3">Cargando datos...</p>
    </div>
  ) : (
    <>
      <div className="bg-white-bg2 relative">
        <Chart {...configuracionGrafico} />
        {!hayDatos && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-500 text-xl bg-white-bg2 bg-opacity-80 px-4 py-2 rounded">
              No hay datos para este año
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        {añoAnterior ? (
          <div className="flex space-x-2">
            <input
              type="number"
              value={añoInput}
              placeholder="AAAA"
              className="bg-white-bg2 text-black-comun py-2 px-5 text-xl w-32"
              onChange={(e) => setAñoInput(e.target.value)}
              min="2000"
              max="2099"
            />
            <button onClick={handleBuscarAño} className="boton_verde">
              Buscar año
            </button>
            <button onClick={handleAñoActual} className="boton_verde">
              AÑO ACTUAL
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAñoAnterior(true)}
            className="boton_verde"
          >
            BUSCAR AÑO ANTERIOR
          </button>
        )}
      </div>
    </>
  )}
</div>
  );
};

export default ReporteProductos;
