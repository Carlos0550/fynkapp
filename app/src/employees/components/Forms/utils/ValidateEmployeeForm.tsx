import { EmployeeFormData } from './useEmployeeForm'

export function validateEmployeeForm(formData: EmployeeFormData): { valid: boolean, errors: string[] } {
  const errors: string[] = [];

  for (const key in formData) {
    const typedKey = key as keyof EmployeeFormData;
    const value = formData[typedKey];

    if (typedKey === "employee_role") {
      const role = value as EmployeeFormData["employee_role"];

      if (role.level === "custom" && role.access_to.length === 0) {
        errors.push("El rol personalizado debe tener al menos un permiso asignado.");
      }
    } else {
      if (typeof value === "string" && value.trim() === "") {
        const fieldName = typedKey.replace("employee_", "").replace("_", " ");
        const traductions = {
            "name": "Nombre completo",
            "dni": "DNI",
            "email": "Correo electrónico"
        }
        errors.push(`El campo "${traductions[fieldName]}" está vacío.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
