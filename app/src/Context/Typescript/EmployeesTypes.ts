export interface EmployeesInterface{
    employee_id: string,
    name: string,
    role: "level1" | "level2" | "level3" | "customized", 
    hireDate: Date | undefined, 
    state: boolean
}