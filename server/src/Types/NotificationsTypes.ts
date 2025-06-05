import { ClientsFromDB } from "./ClientsTypes";
type DebtProducts = {
    product_name: string,
    product_price: number,
    product_quantity: number
}
interface ClientFinancialRequest{
    id: string
    fecha: string
    vencimiento: string | null
    monto: number
    productos: DebtProducts[] | null
    detalles: string | null
    estado: "Pagada" | "Vencida" | "Por vencer" | "Al día"
}

export interface PaymentReminder{
    clientData: ClientsFromDB,
    clientDelivers: ClientFinancialRequest[],
    clientDebts: ClientFinancialRequest[]
}