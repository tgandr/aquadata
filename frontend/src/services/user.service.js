import apiRequest  from "./apiRequest"

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
    this.farm_name = farmName
    this.farm_address = farmAddress
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

export async function signIn(user) {
  return apiRequest('users/signin', 'POST', user)
}

export async function signUp(user) {
  return apiRequest('users/signup', 'POST', user)
}