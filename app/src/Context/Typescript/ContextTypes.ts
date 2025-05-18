import { CreateUserForm, LoginData, LoginUserForm } from "./AuthenticationTypes"
import { ClientInterface, FormClient } from "./ClientsTypes"

export interface ModalsHookInterface {
    openedClientModal: boolean,
    openClientModal: () => void,
    closeClientModal: () => void,
    openedAddDeliverModal : boolean,
    openDeliverModal: () => void,
    closeDeliverModal: () => void,
    openedAddDebtModal: boolean,
    openDebtModal: () => void,
    closeDebtModal: () => void,
    openedAddClientModal: boolean,
    openAddClientModal: () => void,
    closeAddClientModal: () => void,
    selectedClientData: ClientInterface,
    clearClientData: () => void,
    setSelectedClientData: React.Dispatch<React.SetStateAction<ClientInterface>>
}

export interface AuthenticationHookInterface {
    loginData: LoginData,
    loginUser: (formValues: LoginUserForm) => Promise<void>,
    registerUser: (formValues: CreateUserForm) => Promise<boolean>
    validatingSession: boolean
}

export interface ClientsHookInterface {
    clients: ClientInterface[],
    saveClient: (formData: FormClient) => Promise<boolean>,
    getAllClients: () => Promise<boolean>
}
export interface AppContextValueInterface {
    width: number,
    modalsHook: ModalsHookInterface,
    authHook: AuthenticationHookInterface,
    clientsHook: ClientsHookInterface
}