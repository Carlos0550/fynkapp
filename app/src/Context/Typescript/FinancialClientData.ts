import { DeliverDataInterface } from "./DeliversTypes";

export interface DebtProduct {
    product_name: string;
    product_price: number;
    product_quantity: number;
}

export interface ClientDebt {
    debt_id: string;
    client_debt_id: string; //id del cliente
    fk_user_id: string; // id del usuario administrador
    debt_products: DebtProduct[]; 
    debt_date: Date;
    created_at: Date;
    debt_total: number;
    debt_exp: Date;
    debt_status: "Vencido" | "Al día"
}

export interface FinancialClientData {
    clientDebts: ClientDebt[];
    totalDebtAmount: number;
    clientDelivers?: DeliverDataInterface[]; 
    totalDeliverAmount?: number;
}

type debtDataTypes = {
    debt_id: string,
    debt_products: DebtProduct[],
    debt_date: Date | "",
}

export interface EditDebtHookInterface{
    editingDebt: boolean,
    debtID: string
    debtData: debtDataTypes
}