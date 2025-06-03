export interface ClientsFromDB {
    client_id: string,
    client_name: string,
    manager_client_id: string
    aditional_client_data: {
        client_dni: string,
        client_email: string,
        client_address: string,
        client_phone: string
    }
}

type DebtProducts = {
    product_name: string,
    product_price: number,
    product_quantity: number
}
interface ClientFinancialRequest {
    id: string
    fecha: string
    vencimiento: string | null
    monto: number
    productos: DebtProducts[] | null
    detalles: string | null
    estado: "Pagada" | "Vencida" | "Por vencer" | "Al día",
    tipo: "deuda" | "pago",
    estado_financiero: "activo" | "cerrado" | "eliminado"

}

interface BusinessDataRequest {
    business_name: string,
    business_address: string,
    business_phone: string,
    business_id?: string
    manager_business_id?: string,
    notif_option: "email" | "whatsapp" | "both"
}
export interface PaymentReminderRequest {
    clientData: ClientsFromDB,
    clientDelivers: ClientFinancialRequest[],
    clientDebts: ClientFinancialRequest[],
    businessData: BusinessDataRequest
}