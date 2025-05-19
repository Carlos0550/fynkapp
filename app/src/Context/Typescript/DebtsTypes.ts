export type DebtProducts = {
    product_name: string,
    product_price: number,
    product_quantity: number
}
export interface DebtForm{
    debt_products: DebtProducts[],
    debt_total: number,
    debt_date: string
}