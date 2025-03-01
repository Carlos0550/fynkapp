import { showNotification } from "@mantine/notifications";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../../Context/AppContext.tsx"
import { ClientsInterface } from "../../../../../Context/Typescript/ClientsTypes.ts";
import { DebtProduct } from "../../../../../Context/Typescript/FinancialClientData.ts";
interface ProductsInterface {
  product_name: string;
  product_price: number;
  product_quantity: number;
}

function useDebtForm(clientData: ClientsInterface, closeModal: () => void, isEditing?: boolean) {
  const [formValues, setFormValues] = useState({
    debt_products: "",
    debt_date: new Date(),
    client_id: clientData.client_id
  });

  const { debtsHook, } = useAppContext()
  const { 
    createDebt, 
    editDebtHook:{debtData},
    editDebts
   } = debtsHook

  const [validationsErrors, setValidationsErrors] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductsInterface[]>([]);
  const [dateError, setDateError] = useState<string>("");
  const [total, setTotal] = useState<number>(0);

  const validateProducts = (input: string): string[] => {
    const errors: string[] = [];
    const lines = input.split("\n");
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        errors.push(`Línea ${index + 1}: Línea vacía, elimínela o agregue un producto.`);
        return;
      }

      const parts = trimmedLine.split(/\s+/);
      if (parts.length < 3) {
        errors.push(`Línea ${index + 1}: Formato incorrecto. Debe ser: CANTIDAD PRODUCTO PRECIO`);
        return;
      }

      const [quantityStr, ...rest] = parts;
      const priceStr = rest.pop()!;
      const productName = rest.join(" ");

      if (!/^\d+$/.test(quantityStr)) {
        errors.push(`Línea ${index + 1}: La cantidad debe ser un número entero sin decimales.`);
      } else {
        const quantity = parseInt(quantityStr);
        if (quantity <= 0) {
          errors.push(`Línea ${index + 1}: La cantidad debe ser mayor a 0.`);
        }
      }

      if (!productName.trim()) {
        errors.push(`Línea ${index + 1}: El nombre del producto no puede estar vacío.`);
      }

      if (!/^(\d+|\d{1,3}(,\d{3})*)(\.\d+)?$/.test(priceStr.replace(/\s/g, ""))) {
        errors.push(`Línea ${index + 1}: El precio debe tener formato numérico (ej: 25.000,50).`);
      } else {
        const price = parseFloat(priceStr.replace(",", "."));
        if (price <= 0) {
          errors.push(`Línea ${index + 1}: El precio debe ser mayor a 0.`);
        }
      }
    });
    return errors;
  };

  const validateDate = (date: Date): string => {
    const today = dayjs().startOf("day");
    const selectedDate = dayjs(date).startOf("day");

    if (!selectedDate.isValid()) {
      return "La fecha no es válida.";
    }

    if (selectedDate.isAfter(today)) {
      return "La fecha no puede ser futura.";
    }

    const tolerancePastDays = 45;

    if (selectedDate.isBefore(today.subtract(tolerancePastDays, "day"))) {
      return "La fecha no puede ser anterior a 45 dias.";
    }

    return "";
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormValues((prev) => ({ ...prev, debt_products: value }));

    const errors = validateProducts(value);
    setValidationsErrors(errors);

    if (errors.length === 0) {
      const parsedProducts = value.split("\n").map((line) => {
        const [quantityStr, ...rest] = line.trim().split(/\s+/);
        const priceStr = rest.pop()!;
        return {
          product_quantity: parseInt(quantityStr),
          product_name: rest.join(" "),
          product_price: parseFloat(priceStr.replace(",", ".")),
        };
      });
      setProducts(parsedProducts);
    }
  };

  const handleDateChange = (date: Date | null) => {
    const newDate = date || formValues.debt_date; 
    const error = validateDate(newDate);
    setDateError(error);
    setFormValues((prev) => ({ ...prev, debt_date: newDate }));
  };

  
  const dateParser = (input: string): Date | null => {
    if (input.toLowerCase() === "hoy") return dayjs().toDate();
    const parsed = dayjs(input, "DD/MM/YYYY", true);
    return parsed.isValid() ? parsed.toDate() : null;
  };

  const onFinish = async(e: React.FormEvent) => {
    e.preventDefault()
    if(validationsErrors.length > 0) return showNotification({
      title: "Hay errores en el formulario",
      message: "Verifique todos los campos esten completos y no hayan errores.",
      color: "red",
      position: "top-right",
      autoClose: 3500
    });

    if(!!dateError) return showNotification({
      title: "Hay errores en el formulario",
      message: dateError,
      color: "red",
      position: "top-right",
      autoClose: 3500
    });
    const formData = new FormData();

    formData.append("debt_products", JSON.stringify(products))
    formData.append("debt_date", dayjs(formValues.debt_date).format("YYYY-MM-DD"))
    !isEditing && formData.append("client_id", formValues.client_id.toString())


    const result = isEditing
    ? await editDebts(formData)
    : await createDebt(formData, clientData.client_fullname)

    if(result){
      closeModal()
    }
  }

  useEffect(()=>{
    if(products.length > 0){
      const total = products.reduce((acc, product) => acc + product.product_quantity * product.product_price, 0);
      setTotal(total);
    }
  },[products])

  const parseProducts = (debtProducts: DebtProduct) => {
    if(Array.isArray(debtProducts) && debtProducts.length > 0){
      return debtProducts.map((product) => `${product.product_quantity} ${product.product_name} ${product.product_price}`).join("\n")
    }
  } 

  useEffect(()=>{
    if(isEditing && debtData && Object.keys(debtData).length > 0){
      console.log(debtData.debt_date)
      setFormValues({
        debt_id: debtData.debt_id,
        debt_products: parseProducts(debtData.debt_products),
        debt_date: dayjs(debtData.debt_date).toDate()
      })
      setProducts(debtData.debt_products)

    }
  },[isEditing, debtData])

  return {
    formValues,
    setFormValues,
    handleTextChange,
    handleDateChange,
    dateParser,
    validationsErrors,
    dateError,
    products,
    total,
    onFinish
  };
}

export default useDebtForm;