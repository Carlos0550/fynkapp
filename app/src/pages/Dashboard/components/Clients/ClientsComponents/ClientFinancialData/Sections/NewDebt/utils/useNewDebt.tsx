import { useEffect, useRef, useState } from 'react'
import { DebtForm, DebtProducts } from '../../../../../../../../../Context/Typescript/DebtsTypes'
import { useAppContext } from '../../../../../../../../../Context/AppContext';
import dayjs from "dayjs"
import { DateValue } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';

function useNewDebt() {
  const {
    debtsHook: {
      saveDebt, editingDebt
    }
  } = useAppContext()

  const [formData, setFormData] = useState<DebtForm>({
    debt_products: [],
    debt_total: "",
    debt_date: ""
  });

  const [productsText, setProductsText] = useState(""); // 🆕 texto visible en el Textarea
  const [errors, setErrors] = useState<string[]>([]);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const handleProductsChange = (productString: string) => {
    setProductsText(productString); // 🆕 actualizamos el valor visible

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    const products: DebtProducts[] = [];
    const lineErrors: string[] = [];

    const trimmed = productString.trim();
    const all_products = trimmed
      .split("\n")
      .filter(line => line.trim() !== "");

    all_products.forEach((line, idx) => {
      const parts = line.trim().split(" ");
      if (parts.length < 3) {
        lineErrors.push(`Error en la línea ${idx + 1}: el formato debe ser "CANTIDAD | PRODUCTO | PRECIO".`);
        return;
      }

      const quantity = Number(parts[0]);
      const price = Number(parts[parts.length - 1]);
      const name = parts.slice(1, -1).join(" ");

      if (isNaN(quantity)) {
        lineErrors.push(`Error en la línea ${idx + 1}: la cantidad no es válida.`);
        return;
      }

      if (isNaN(price)) {
        lineErrors.push(`Error en la línea ${idx + 1}: el precio no es válido.`);
        return;
      }

      if (/[,.]/.test(name)) {
        lineErrors.push(`Error en la línea ${idx + 1}: el nombre del producto no puede contener comas ni puntos.`);
        return;
      }

      products.push({
        product_name: name,
        product_price: price,
        product_quantity: quantity
      });
    });

    setFormData(prev => ({
      ...prev,
      debt_products: products
    }));

    debounceTimeout.current = setTimeout(() => {
      setErrors(trimmed.length > 0 ? lineErrors : []);
    }, 500);
  };

  const handleSaveDate = (date: DateValue) => {
    if (!date) return;

    const daysLimit = 45;
    const today = dayjs().startOf("day");
    const selectedDate = dayjs(date).startOf("day");

    if (selectedDate.isBefore(today.subtract(daysLimit, "days"))) {
      showNotification({
        title: "Fecha no válida",
        message: `La fecha de deuda no puede ser mayor a ${daysLimit} días`,
        color: "red",
        autoClose: 5000,
        position: "top-right"
      });
      return;
    } else if (selectedDate.isAfter(today)) {
      showNotification({
        title: "Fecha no válida",
        message: "La fecha de deuda no puede ser en el futuro",
        color: "red",
        autoClose: 5000,
        position: "top-right"
      });
      return;
    }

    const currentHour = dayjs().hour();
    const currentMinute = dayjs().minute();
    const currentSecond = dayjs().second();

    const combinedDate = dayjs(date)
      .hour(currentHour)
      .minute(currentMinute)
      .second(currentSecond);

    const formattedDate = combinedDate.format("YYYY-MM-DD HH:mm:ss");

    setFormData(prev => ({
      ...prev,
      debt_date: formattedDate
    }));
  };

  const calculateTotal = () => {
    if (formData.debt_products.length === 0) return;
    let total = 0;
    formData.debt_products.forEach(product => {
      total += parseFloat(product.product_price.toString()) * parseInt(product.product_quantity.toString());
    });
    setFormData(prev => ({
      ...prev,
      debt_total: total.toString()
    }));
  }

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSaveDebt = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await saveDebt(formData);
    setSaving(false);
    if (result) setSaved(true);
  }

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [formData.debt_products]);

  useEffect(() => {
    if (editingDebt && editingDebt.debt_id) {
      const text = editingDebt.debt_products
        .map(p => `${p.product_quantity} ${p.product_name} ${p.product_price}`)
        .join('\n');

      setFormData({
        debt_date: editingDebt.debt_date,
        debt_products: editingDebt.debt_products,
        debt_total: editingDebt.debt_total
      });

      setProductsText(text); // ✅ cargar texto en edición
    } else {
      setFormData(prev => ({
        ...prev,
        debt_date: dayjs().format("YYYY-MM-DD HH:mm:ss")
      }));
      setProductsText(""); // 🧼 limpiar textarea si es nuevo
    }
  }, [editingDebt?.debt_id]);

  return {
    formData,
    productsText, 
    errors,
    handleProductsChange,
    handleSaveDate,
    handleSaveDebt,
    saving,
    saved
  };
}

export default useNewDebt;
