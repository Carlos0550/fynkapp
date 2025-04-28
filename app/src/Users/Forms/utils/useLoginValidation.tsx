import { useEffect, useRef, useState } from "react";
import { UserLoginFormValuesInterface } from "../../../Context/Typescript/UsersTypes";

import { useAppContext } from "../../../Context/AppContext";
import { useNavigate } from "react-router-dom";
function useLoginValidation() {
    const [errors, setErrors] = useState<UserLoginFormValuesInterface>({
      user_email: "",
      user_password: ""
    }); 

    const [formValues, setFormValues] = useState<UserLoginFormValuesInterface>({
      user_email: "",
      user_password: ""
    })

    const userLoginFormRef = useRef<HTMLFormElement>(null)

    const {
      usersHook
    } = useAppContext()
  const { loginUser } = usersHook

    const navigate = useNavigate()

    const validateFields = () => {
        setErrors({
          user_email: "",
          user_password: ""
        })

        let errors: Partial<UserLoginFormValuesInterface> = {}

        for (const field in formValues){
          if(!formValues[field as keyof UserLoginFormValuesInterface]){
            errors[field as keyof UserLoginFormValuesInterface] = "Campo requerido"
          }
        }

        if(Object.keys(errors).length > 0){
          setErrors(prevErrors => ({...prevErrors, ...errors}))
          return false
        }
        return true
    }

    const [loggingIn, setLoggingIn] = useState(false)
    const onFinish = async(e: React.FormEvent) => {
        e.preventDefault()
        if(validateFields()){
          setLoggingIn(true)
          const result = await loginUser(formValues)
          setLoggingIn(false)
          if(result) navigate("/clients")
        }
    } 


    useEffect(()=>{
      if(userLoginFormRef.current){
        const fields = Array.from(userLoginFormRef.current.querySelectorAll<HTMLInputElement>("input"))
        if(fields.length > 0){
          fields.forEach(f => {
            f.addEventListener("input", () => {
              setFormValues(prevValues => ({
                ...prevValues,
                [f.id]: f.value
              }))
            })
          })
          fields[0].focus()
        }

        return () => {
          fields.forEach(f => {
            f.removeEventListener("input", () => {
              setFormValues(prevValues => ({
                ...prevValues,
                [f.id]: f.value
              }))
            })
          })
        }
      }
    },[])

  return {
    onFinish,
    errors,
    userLoginFormRef,
    loggingIn
  }
}

export default useLoginValidation