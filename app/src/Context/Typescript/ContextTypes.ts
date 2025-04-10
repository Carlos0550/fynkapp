import { ClientsInterface } from "./ClientsTypes"
import { ClientsForDebtsInterface } from "./DebtsTypes"
import { DeliverDataInterface, EditDeliverHookInterface } from "./DeliversTypes"
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
    deleteDebt: (debtID: string) => Promise<boolean>,
    clientsForDebts: ClientsForDebtsInterface[],
    setClientsForDebts: React.Dispatch<React.SetStateAction<ClientsForDebtsInterface[]>>,
    findClientsForDebts: (searchValue: string) => Promise<boolean>;
    cancelDebt: () => Promise<boolean>;
    gettingClientData: boolean;
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
    getClientData: (clientID: string) => Promise<{ client: ClientsInterface }>;
    deleting: boolean;
    gettingClients: boolean
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
    handleCloseSession: () => void
}

export interface DeliversHookInterface {
    createDeliver: (deliverData: DeliverDataInterface) => Promise<boolean>
    editDeliver: (deliverData: DeliverDataInterface) => Promise<boolean>
    deleteDeliver: (deliverID: string) => Promise<boolean>
    editDeliverHook: EditDeliverHookInterface
    setEditDeliverHook: React.Dispatch<React.SetStateAction<EditDeliverHookInterface>>
}


export interface AppContextValueInterface {
    width: number
    isValidUUID: (uuid: string) => boolean
    authHook: AuthHookInterface
    clientsHook: ClientsHookInterface
    usersHook: UsersHookInterface
    debtsHook: DebtsHookInterface
    deliversHook: DeliversHookInterface
}