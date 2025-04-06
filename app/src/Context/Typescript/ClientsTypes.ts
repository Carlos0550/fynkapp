export interface ClientsInterface {
    client_id : string,
    client_dni: string,
    client_fullname: string,
    client_email: string,

    client_phone: string
}

export interface ClientInterfaceErrors{
    client_dni: string,
    client_fullname: string,
    client_email: string,

    client_phone: string
}