
export interface LoginData{
    user_email: string,
    user_id: string,
    user_name: string,
}

export interface LoginUserForm{
    user_email: string,
    user_password: string
}

export interface CreateUserForm extends LoginUserForm{
    user_name: string,
    confirm_password: string
}