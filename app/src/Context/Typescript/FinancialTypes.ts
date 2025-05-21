import { DebtProducts } from "./DebtsTypes";

export type FinancialClient = {
  id: string
  fecha: string
  vencimiento: string | null
  monto: number
  productos: DebtProducts[] | null
  detalles: string | null
  tipo: 'deuda' | 'pago',
  estado: "Pagada" | "Vencida" | "Por vencer" | "Al día"
}
