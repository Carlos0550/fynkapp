import { ClientsInterface } from "./ClientsTypes"
import { EditDebtHookInterface, FinancialClientData } from "./FinancialClientData"
import { LoginDataInterface, UserLoginFormValuesInterface, UserRegisterFormValuesInterface } from "./UsersTypes"

export interface DebtsHookInterface {
    financialClientData: FinancialClientData
    fetchDebts: () => Promise<boolean>
    getFinancialClientData: () => Promise<boolean>
    createDebt: (formValues: any, clientName: string) => Promise<boolean>,
    editDebtHook: EditDebtHookInterface
    setEditDebtHook: React.Dispatch<React.SetStateAction<EditDebtHookInterface>>,
    editDebts: (formValues: any) => Promise<boolean>,
}

export interface ClientsHookInterface {
    clients: ClientsInterface[]
    createClient: (clientData: ClientsInterface) => Promise<boolean>
    getClient: (searchQuery: string) => Promise<boolean>,
    editingClient: {
        isEditing: boolean,
        clientID: string
    } | null, 
    setEditingClient: React.Dispatch<React.SetStateAction<{
        isEditing: boolean,
        clientID: string
    } | null>>,
    editClient: (clientData: ClientsInterface) => Promise<boolean>,
    deleteClient: (clientID: string) => Promise<boolean>,
    getClientData: (clientID: string) => Promise<boolean>,
}

export interface UsersHookInterface {
    registerUser: (formData:UserRegisterFormValuesInterface) => Promise<boolean>,
    formSelection: number,
    setFormSelection: React.Dispatch<React.SetStateAction<number>>,
    loginUser: (formData: UserLoginFormValuesInterface) => Promise<boolean>,
    handleLogout: () => void
}

export interface AuthHookInterface{
    loginData: LoginDataInterface | null,
    verifyToken: () => Promise<void>,
    showSessionExpiredNotification: () => void,
    setCuentaRegresivaIniciada: React.Dispatch<React.SetStateAction<boolean>>
}

export interface AppContextValueInterface {
    width: number;
    isValidUUID: (uuid: string) => boolean;
    authHook: AuthHookInterface;
    clientsHook: ClientsHookInterface;
    usersHook: UsersHookInterface;
    debtsHook: DebtsHookInterface;
}