INSERT INTO employees(
    employee_name,
    employee_dni,
    employee_email,
    employee_role_level,

)

SELECT user_id FROM users;

INSERT INTO employees (
  employee_admin_id,
  employee_name,
  employee_email,
  employee_dni,
  employee_role_level,
  employee_status,
  custom_roles
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7
);
