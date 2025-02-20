import { useEffect, useRef, useState } from "react"
import { UserRegisterFormValuesInterface } from "../../../Context/Typescript/UsersTypes"
import { message } from "antd"

function useRegisterValidation() {
    const registerFormInputsRef = useRef<HTMLFormElement>(null)
    const [formValues, setFormValues] = useState<UserRegisterFormValuesInterface>({
        user_email: "",
        user_password: "",
        user_name: "",
        user_last_name: "",
        confirm_password: ""
    })

    useEffect(() => {
        if (!registerFormInputsRef.current) return

        const fields = Array.from(registerFormInputsRef.current.querySelectorAll<HTMLInputElement>("input"))
        
        if(fields.length > 0){
            fields[0].focus()
        }
        
        const handleInputChange = (event: Event) => {
            const target = event.target as HTMLInputElement
            setFormValues(prevValues => ({
                ...prevValues,
                [target.id]: target.value
            }))
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLInputElement
            const currentIndex = fields.indexOf(target)

            if (event.key === "ArrowDown") {
                event.preventDefault()
                const nextField = fields[currentIndex + 1]
                if (nextField) nextField.focus()
            } 
            else if (event.key === "ArrowUp") {
                event.preventDefault()
                const prevField = fields[currentIndex - 1]
                if (prevField) prevField.focus()
            }
        }

        fields.forEach(field => {
            field.addEventListener("input", handleInputChange)
            field.addEventListener("keydown", handleKeyDown)
        })

        return () => {
            fields.forEach(field => {
                field.removeEventListener("input", handleInputChange)
                field.removeEventListener("keydown", handleKeyDown)
            })
        }
    }, [])

    const [errors, setErrors] = useState<UserRegisterFormValuesInterface>({
        user_email: "",
        user_password: "",
        user_name: "",
        user_last_name: "",
        confirm_password: ""
    })
    const validateFields = () => {
        let newErrors: Partial<UserRegisterFormValuesInterface> = {}
    
        for (const field in formValues) {
            if (!formValues[field as keyof UserRegisterFormValuesInterface]) {
                newErrors[field as keyof UserRegisterFormValuesInterface] = "Campo requerido"
            }
        }
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(prevErrors => ({ ...prevErrors, ...newErrors }))
            return false
        }
    
        return true
    }
    

    const onFinish = async(e: React.FormEvent) => {
        e.preventDefault()
        if (validateFields()) {
            console.log("Formulario enviado:", formValues)
            message.success("yes")
        }
    }

    return {
        registerFormInputsRef,
        formValues,
        onFinish,
        errors
    }
}

export default useRegisterValidation
