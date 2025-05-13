import { showNotification } from '@mantine/notifications'
import React, { useRef } from 'react'

function useBusinessForm() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleValidateFields = () => {
    if (inputRef.current) {
      const value = inputRef.current.value
      if (!value) {
        inputRef.current.focus()
        showNotification({
          title: "Error",
          message: "El nombre de la sucursal es requerido",
          color: "red",
          autoClose: 5000,
          position: "top-right",
        })
        return false
      }
      return true
    }
    return false
  }

  const onFinish = async(e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if(!handleValidateFields()) return
    console.log("onFinish", inputRef.current?.value)
  }

  return {
    inputRef,
    onFinish
  }
}

export default useBusinessForm
