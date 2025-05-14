import React, { useEffect, useState } from "react";
import { ClientInterfaceErrors, ClientsInterface } from "../../../../../../Context/Typescript/ClientsTypes";
import { useAppContext } from "../../../../../../Context/AppContext";
import { hideNotification, showNotification } from "@mantine/notifications";

function useClientForm(closeModal: () => void) {
  const {
    clientsHook: { createClient, editClient },
  } = useAppContext();

  const [formValues, setFormValues] = useState<ClientsInterface>({
    client_id: "",
    client_dni: "",
    client_fullname: "",
    client_email: "",
    client_phone: "",
  });

  const [errors, setErrors] = useState<ClientInterfaceErrors>({
    client_fullname: "",
  });

  const [savingClient, setSavingClient] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFields = (): boolean => {
    const newErrors: Partial<ClientInterfaceErrors> = {};

    if(formValues.client_dni){
      const regexDNI = /^\d{8}$/;
      if (!regexDNI.test(formValues.client_dni.toString())) {
        newErrors.client_dni = "DNI inválido";
      }
    }

    if (!formValues.client_fullname) {
      newErrors.client_fullname = "Campo requerido";
    }

    setErrors({
      client_dni: newErrors.client_dni || "",
      client_fullname: newErrors.client_fullname || "",
    });

    return Object.keys(newErrors).length === 0;
  };

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    const notificationID = Date.now().toString();

    if (validateFields()) {
      showNotification({
        id: notificationID,
        title: "Guardando...",
        message: "",
        color: "blue",
        loading: true,
        autoClose: false,
        position: "top-right",
      });

      setSavingClient(true);
      const result = await createClient(formValues);

      hideNotification(notificationID);
      setSavingClient(false);

      if (result) {
        setFormValues({
          client_id: "",
          client_dni: "",
          client_fullname: "",
          client_email: "",
          client_phone: "",
        });

        setErrors({
          client_dni: "",
          client_fullname: "",
        });

        closeModal();
      }
    } else {
      showNotification({
        title: "Verifique los campos",
        message: 'Los que tengan "*" en rojo son obligatorios, y verifique que estén correctos.',
        color: "red",
        autoClose: 2500,
        position: "top-right",
      });
    }
  };

  return {
    formValues,
    setFormValues,
    errors,
    setErrors,
    validateFields,
    onFinish,
    handleInputChange,
    savingClient,
  };
}

export default useClientForm;