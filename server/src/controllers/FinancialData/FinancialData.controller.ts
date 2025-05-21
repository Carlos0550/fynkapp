import { RequestHandler } from "express";
import pool from "../../connections/database_conn";
import { getQueries } from "../../utils/QueriesHandler";
import path from "path";
import dayjs from "dayjs";

const queries = getQueries(path.join(__dirname, "./Queries"));

export const getFinancialData: RequestHandler<
  {}, {}, {}, { client_id: string }
> = async (req, res) => {
  const { client_id } = req.query;
  const { manager_id } = (req as any).manager_data;
  const FD = queries["getFinancialData.sql"];

  try {
    const result = await pool.query(FD[0], [manager_id, client_id]);

    if (result.rowCount === 0) {
      res.status(404).json({ msg: "No se encontraron datos financieros." });
      return;
    }

    const movimientos = result.rows;

    const movimientosActivos = movimientos.filter(m => m.estado_financiero === 'activo');
    const movimientosCerrados = movimientos.filter(m => m.estado_financiero !== 'activo');

    const deudas = movimientosActivos.filter((m) => m.tipo === "deuda");
    const pagos = movimientosActivos.filter((m) => m.tipo === "pago");

    const totalDeuda = deudas.reduce((acc, d) => acc + Number(d.monto), 0);
    const totalPagos = pagos.reduce((acc, p) => acc + Number(p.monto), 0);
    const restaGlobal = totalDeuda - totalPagos;

    const huboEntregaEsteMes = pagos.some(pago =>
      dayjs(pago.fecha).isSame(dayjs(), 'month') &&
      dayjs(pago.fecha).isSame(dayjs(), 'year')
    );

    let restante = totalPagos;

    const deudasConEstado = deudas
      .sort((a, b) => dayjs(a.fecha).valueOf() - dayjs(b.fecha).valueOf())
      .map((deuda) => {
        const monto = Number(deuda.monto);

        const vencimiento = dayjs(deuda.vencimiento);
        const hoy = dayjs();

        const vencidaPorFecha = vencimiento.isBefore(hoy, 'day');
        const porVencer = vencimiento.isAfter(hoy, 'day') &&
          vencimiento.diff(hoy, 'day') <= 7;

        let estado: "Pagada" | "Por vencer" | "Vencida" | "Al día";

        if (restante >= monto) {
          estado = "Pagada";
          restante -= monto;
        } else if (restante > 0) {
          if (vencidaPorFecha && !huboEntregaEsteMes) {
            estado = "Vencida";
          } else if (porVencer) {
            estado = "Por vencer";
          } else {
            estado = "Al día";
          }
          restante = 0;
        } else {
          if (vencidaPorFecha && !huboEntregaEsteMes) {
            estado = "Vencida";
          } else if (porVencer) {
            estado = "Por vencer";
          }
          else {
            estado = "Al día";
          }
        }

        return { ...deuda, estado };
      });

    const movimientosFinales = [...deudasConEstado, ...pagos].sort(
      (a, b) => dayjs(b.fecha).valueOf() - dayjs(a.fecha).valueOf()
    );

    res.status(200).json({
      movimientos: movimientosFinales,
      historial: movimientosCerrados.sort((a, b) => dayjs(b.fecha).valueOf() - dayjs(a.fecha).valueOf()),
      totalDeuda,
      totalPagos,
      restaGlobal
    });


  } catch (error) {
    console.error("❌ Error al obtener los datos financieros:", error);
    res.status(500).json({
      msg: "Error interno en el servidor, espere unos segundos e intente nuevamente."
    });
  }
};
