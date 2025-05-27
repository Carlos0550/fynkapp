export interface MonthOption {
  value: string;
  label: string;
}

export interface AccountSummary {
  summary_id: string; 
  manager_id: string; 
  monthsAvailable: string[];
  as_of: string; 
  total_debt: number;
  total_payments: number;
  best_customers: {
    id: string;
    name: string;
    deuda: number;
    atraso_prom: number;
    historial: number;
    riesgo: number;
  }[];
  worst_customers: {
    id: string;
    name: string;
    deuda: number;
    atraso_prom: number;
    historial: number;
    riesgo: number;
  }[];
  payment_behavior: {
    [rango: string]: {
      clientes: {
        id: string;
        name: string;
        pago: number;
        dias_retraso: number;
        fecha_pago: string;
        fecha_vencimiento: string;
      }[];
      total: number;
      cantidad: number;
    };
  };
  recovery_rate: number;
  created_at: string;
}
