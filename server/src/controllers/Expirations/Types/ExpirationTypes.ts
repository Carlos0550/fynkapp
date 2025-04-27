export interface ExpirationClient {
    client_debt_id: string;
    client_fullname: string;
    debt_date: string; 
    exp_date: string;  
    last_deliver_date: string | null; 
    days_remaining: number; 
    exp_type: 'toOvercome' | 'expired'; 
  }
  