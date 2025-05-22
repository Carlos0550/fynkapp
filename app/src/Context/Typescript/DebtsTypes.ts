export type DebtProducts = {
    product_name: string,
    product_price: number,
    product_quantity: number
}
export interface DebtForm{
    debt_products: DebtProducts[],
    debt_total: string,
    debt_date: string
}

export interface EditingData extends DebtForm{
    debt_id: string
}