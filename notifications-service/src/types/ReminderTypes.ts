
export type DebtProducts = {
    product_name: string,
    product_price: number,
    product_quantity: number
}
export interface PaymentReminderRequest {
    channel: "email" | "whatsapp" | "both",
    totalAmount: string,
    dias: string,
    productos: DebtProducts[],
    fecha_vencimiento: string,
    client_name: string,
    client_phone: string,
    client_email: string,
    business_name: string,
    business_phone: string,
    business_address: string
}