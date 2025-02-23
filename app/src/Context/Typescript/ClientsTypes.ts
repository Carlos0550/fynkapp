export interface ClientsInterface {
    client_id : string,
    client_dni: number,
    client_fullname: string,
    client_email: string,
    client_address: string,
    client_city: string,
    client_phone: number
}

export interface ClientInterfaceErrors{
    client_dni: string,
    client_fullname: string,
    client_email: string,
    client_address: string,
    client_city: string,
    client_phone: string
}