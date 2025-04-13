export interface EmployeesInterface{
    employee_id: string,
    name: string,
    role: "level1" | "level2" | "level3" | "customized", 
    hireDate: Date | undefined, 
    state: boolean
}

export interface SectionsForRolesInterface {
  fast_actions: string,
  clients: string,
  debts: string,
  expirations: string,
  admin_dashboard: string,
  managment: string,
}

export type RoleLevel = 'level1' | 'level2' | 'level3' | 'custom'

export type RolesInterface = {
  [key in Exclude<RoleLevel, 'custom'>]: {
    access_to?: (keyof SectionsForRolesInterface)[]
  }
}

export type EmployeeRole = {
    level: 'level1' | 'level2' | 'level3' | 'custom',
    access_to: (keyof SectionsForRolesInterface)[]
}

export interface EmployeeFormData {
    employee_name: string,
    employee_dni: string,
    employee_email: string,
    employee_role: EmployeeRole
}