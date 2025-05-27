export interface PaymentBehaviorClient {
  id: string;
  name: string;
  pago: number;
  fecha_pago: string; 
  dias_retraso: number;
  fecha_vencimiento: string;
}

export interface PaymentBehaviorRange {
  total: number;
  cantidad: number;
  clientes: PaymentBehaviorClient[];
}

export interface PaymentBehavior {
  "0-15": PaymentBehaviorRange[];
  "16-30": PaymentBehaviorRange[];
  "31-60": PaymentBehaviorRange[];
  "60+": PaymentBehaviorRange[];
}

export interface AccountSummary {
  summary_id: string;
  manager_id: string;
  created_at: string;
  monthName: string;
  total_debt: number;
  total_deliver: number;
  best_customers: any[];
  worst_customers: any[];
  recovery_rate: number;
  payment_behavior: PaymentBehavior;
}

export interface SummaryCards {
  summary_name: string;
  summary_icon: React.ReactNode;
  summary_value: string;
  summary_color: string;
  summary_leyend_color: string;
}
export interface MonthOption {
  value: string;
  label: string;
}