import UserRepository from '../repositories/user.repository';

export default class AuthService {
  constructor(private userRepository: UserRepository) {}

  public async registration(registrationUserDto): Promise<any> {
    //check role User if role enum create role User
    //hash password
    //create user
    //generate tokens
    //send email
    //return tokens or exception
  }

  public async login(loginUserDto): Promise<any> {
    //check credentials
    //generate tokens
    //return tokens or exception
    return await this.userRepository.findAll();
  }

  public async logout() {
    //check token
    //remove refresh token
    //return true or exception
  }

  public async verifyUser() {
    //check link
    //update user is_verify to true
    //return true or exception
  }
}
