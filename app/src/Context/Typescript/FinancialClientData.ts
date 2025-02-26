export interface DebtProduct {
    product_name: string;
    product_price: number;
    product_quantity: number;
}

export interface ClientDebt {
    debt_id: string;
    client_debt_id: string;
    fk_user_id: string;
    debt_products: DebtProduct[]; 
    debt_date: Date;
    created_at: Date;
    debt_total: number;
    debt_exp: Date;
    debt_status: "Vencido" | "Al día"
}

export interface ClientDeliver {
    deliver_id: string;
    client_debt_id: string;
    fk_user_id: string;
    deliver_amount: number;
    deliver_date: Date;
    created_at: Date;
}

export interface FinancialClientData {
    clientDebts: ClientDebt[];
    clientDelivers?: ClientDeliver[]; 
    totalDebtAmount: number;
    totalDeliverAmount?: number;
}