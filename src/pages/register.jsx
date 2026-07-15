import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerSchema } from './register/validations/RegisterSchemas'
import axiosInstance from '../api/axiosInstance'

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({ resolver: yupResolver(registerSchema) })
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  async function registerUser(data) {
    setMessage('')
    setErrorMessage('')

    try {
      await axiosInstance.post('/auth/Account/Register', data)
      setMessage('Your account has been created successfully.')
      reset()
    } catch (error) {
      const serverErrors = error.response?.data?.errors

      if (serverErrors) {
        Object.entries(serverErrors).forEach(([field, messages]) => {
          const normalizedField = field.replace(/^\$\./, '')
          const fieldName = normalizedField.charAt(0).toLowerCase() + normalizedField.slice(1)
          setError(fieldName, {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : messages,
          })
        })
        setErrorMessage('Please correct the highlighted fields and try again.')
        return
      }

      setErrorMessage(error.response?.data?.message || error.response?.data?.title || 'Registration failed. Please try again.')
    }
  }

  return (
    <section className="register-page">
      <form className="register-form" onSubmit={handleSubmit(registerUser)}>
        <h1>Create an account</h1>

        <label>
          Email
          <input type="email" {...register('email')} />
          {errors.email && <span className="field-error">{errors.email.message}</span>}
        </label>

        <label>
          Password
          <input
            type="password"
            {...register('password')}
          />
          {errors.password && <span className="field-error">{errors.password.message}</span>}
        </label>

        <label>
          Username
          <input {...register('userName')} />
          {errors.userName && <span className="field-error">{errors.userName.message}</span>}
        </label>

        <label>
          Full name
          <input {...register('fullName')} />
          {errors.fullName && <span className="field-error">{errors.fullName.message}</span>}
        </label>

        <label>
          Phone number
          <input type="tel" {...register('phoneNumber')} />
          {errors.phoneNumber && <span className="field-error">{errors.phoneNumber.message}</span>}
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>

        {message && <p className="form-success">{message}</p>}
        {errorMessage && <p className="form-error">{errorMessage}</p>}
      </form>
    </section>
  )
}
