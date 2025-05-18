export interface ClientsRequest{
    client_name: string
    client_dni?: string,
    client_email?: string,
    client_address?:string
    editing_client?: string,
    client_id?: string
}

export interface ClientsFromDB{
    client_id: string,
    client_name: string,
    manager_client_id: string
    aditional_client_data:{
        client_dni: string,
        client_email: string,
        client_address:string
    }
}