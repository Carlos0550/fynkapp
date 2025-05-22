import { DebtProducts } from "./DebtsTypes";

interface FinancialData{
  id: string
  fecha: string
  vencimiento: string | null
  monto: number
  productos: DebtProducts[] | null
  detalles: string | null
  tipo: 'deuda' | 'pago',
  estado: "Pagada" | "Vencida" | "Por vencer" | "Al día"
  estado_financiero: "activo" | "cerrado" | "eliminado"
}
export type FinancialClient = {
  movimientos: FinancialData[]
  historial: FinancialData[]
}
