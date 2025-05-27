import pool from "../../connections/database_conn";
import path from "path";
import { getQueries } from "../../utils/QueriesHandler";
import { RequestHandler } from "express";
import { AccountSummary, MonthOption } from "../../Types/ResumeTypes";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const queries = getQueries(path.join(__dirname, "./Queries"));

export const GetMonthlyResume: RequestHandler<{}, {}, {}, {}> = async (
  req,
  res
): Promise<void> => {
  const { manager_id } = (req as any).manager_data;
  const query = queries["getMonthlyResume.sql"];

  try {
    const now = dayjs().format("YYYY-MM-DD");
    const response = await pool.query(query[0], [manager_id, now]);

    if (response.rowCount! > 0) {
      const account_resume: AccountSummary[] = response.rows;
        const monthOptionsArray: MonthOption[] = []
      const generated_account_resume = account_resume.map((account) => {
        const fecha = dayjs(account.created_at);
        const label = fecha.format("MMMM");
        const labelFormatted = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
        const monthOptionsSet = new Set<string>()
        

        account_resume.forEach((account) => {
        const value = dayjs(account.created_at).format("YYYY-MM");
        const label = dayjs(account.created_at)
            .locale("es")
            .format("MMMM")
            .replace(/\b\w/, c => c.toUpperCase());

        if (!monthOptionsSet.has(value)) {
            monthOptionsSet.add(value);
            monthOptionsArray.push({ value, label });
        }
        });

        

        return {
          monthName: labelFormatted,
          created_at: account.created_at,
          total_debt: account.total_debt,
          total_deliver: account.total_payments,
          best_customers: account.best_customers,
          worst_customers: account.worst_customers,
          manager_id: account.manager_id,
          recovery_rate: account.recovery_rate,
          payment_behavior: account.payment_behavior,
          summary_id: account.summary_id,
        };
      });

      res.status(200).json({
        msg: "Resumen mensual obtenido exitosamente.",
        data: generated_account_resume[0],
        monthsAvailable: monthOptionsArray
    });
    } else {
      throw new Error("El administrador aún no ha generado un resumen mensual.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error interno en el servidor, espere unos segundos e intente nuevamente.",
    });
    return;
  }
};
