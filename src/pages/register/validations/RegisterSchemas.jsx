import * as yup from 'yup'

export const registerSchema = yup.object({
  userName: yup
    .string()
    .required('Username is required.')
    .min(3, 'Username must be at least 3 characters.')
    .max(20, 'Username must be 20 characters or fewer.'),
  fullName: yup
    .string()
    .required('Full name is required.')
    .min(3, 'Full name must be at least 3 characters.')
    .max(20, 'Full name must be 20 characters or fewer.'),
  email: yup.string().required('Email is required.').email('Enter a valid email address.'),
  phoneNumber: yup.string().required('Phone number is required.'),
  password: yup
    .string()
    .required('Password is required.')
    .min(6, 'Password must be at least 6 characters.'),
})
