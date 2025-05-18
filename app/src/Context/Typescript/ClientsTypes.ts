export interface FormClient{
    client_name: string
    client_dni?: string,
    client_email?: string,
    client_address?:string
}

export interface ClientInterface{
    client_id: string;
    client_name: string;
    manager_client_id: string;
    client_aditional_data: {
        client_dni?: string,
        client_email?: string,
        client_address?:string
    }
}