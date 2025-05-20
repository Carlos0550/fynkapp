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

    // Separar deudas y pagos
    const deudas = movimientos.filter((m) => m.tipo === "deuda");
    const pagos = movimientos.filter((m) => m.tipo === "pago");

    const deudasConEstado = deudas.map((deuda) => {
      const pagosAplicables = pagos.filter(p =>
        dayjs(p.fecha).isBefore(dayjs(deuda.fecha)) || dayjs(p.fecha).isSame(dayjs(deuda.fecha))
      );

      const totalPagado = pagosAplicables.reduce((acc, p) => acc + Number(p.monto), 0);
      const vencida = dayjs(deuda.vencimiento).isBefore(dayjs());
      const resta = Number(deuda.monto) - totalPagado;

      let estado: "Pagada" | "Parcial" | "Vencida" | "Al día";

      if (resta <= 0) estado = "Pagada";
      else if (vencida && resta > 0) estado = "Vencida";
      else if (resta < deuda.monto) estado = "Parcial";
      else estado = "Al día";

      return { ...deuda, estado };
    });

    // Dejar los pagos como están
    const movimientosFinales = [
      ...deudasConEstado,
      ...pagos
    ].sort((a, b) => dayjs(b.fecha).valueOf() - dayjs(a.fecha).valueOf());
    console.log(movimientosFinales)
    res.status(200).json(movimientosFinales);
    return;

  } catch (error) {
    console.error("❌ Error al obtener los datos financieros:", error);
    res.status(500).json({ msg: "Error interno en el servidor, espere unos segundos e intente nuevamente." });
    return;
  }
};
