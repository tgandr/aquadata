import { apiRequest } from "./apiRequest"

export class RegisterUserUseCase {
  constructor(
    name,email,password,
    farmName,farmAddress,
    profile,phone
  )
  {
    this.name = name
    this.email = email
    this.password = password
    this.farmName = farmName
    this.farmAddress = farmAddress
    this.profile = profile
    this.phone = phone
  }
}

export class LoginUseCase {
  constructor(
    email,
    password
  )
  {
    this.email = email
    this.password = password
  }
}



export const signIn = async (user) => {
  return apiRequest('users/signin', 'POST', user)
}

export const signUp = async (user) => {
  return apiRequest('users/signup', 'POST', user)
}