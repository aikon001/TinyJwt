

class UserService {
  constructor(log, mongoose, httpStatus, errs) {
    this.log = log
    this.mongoose = mongoose
    this.httpStatus = httpStatus
    this.errs = errs
  }

  async createUser(body) {

    const Users = this.mongoose.model('Users');
    const { username } = body
    const { password } = body

    const user = await Users.findOne({ username });

    if (user) {
      const err = new this.errs.InvalidArgumentError(
        'User with username already exists'
      );
      return err;
    }

    let newUser = new Users(body)

    newUser.setPassword(password)
    let generatedToken = newUser.toAuthJSON()

    newUser = await newUser.save()

    this.log.info('User Created Successfully');
    return generatedToken;
  }

  async createUserGoogle(username,email,accessToken) {

    const Users = this.mongoose.model('Users');

    const user = await Users.findOne({ username });

    if (user) {
      const err = new this.errs.InvalidArgumentError(
        'User with username already exists'
      );
      return err;
    }

    console.log(username)
    console.log(email)

    let newUser = new Users({
      username: username,
      email: email
    })

    let generatedToken = accessToken

    newUser = await newUser.save()

    this.log.info('User Created Successfully');
    return generatedToken;
  }

  async getUser(authorization,body) {
    const Users = this.mongoose.model('Users');

    const { password } = body
    const { username } = body
    var user = await Users.findOne({ username });


    if (!user) {
      const { email } = body
      user = await Users.findOne({ email });

      if (!email) {

        const err = new this.errs.NotFoundError(
          `User with username - ${username} does not exists`
        );
        return err
      }
    }

    if (user.validPassword(password)) {

      if (user.validToken(authorization)){

        this.log.info('User fetched Successfully');
        return user

      }else{
        

          const err = new this.errs.NotFoundError(
            `Invalid Token!`
          );
          return err
      }
    } else {
      const err = new this.errs.NotFoundError(
        `Wrong password!`
      );
      return err;
    }
  }
}

module.exports = UserService;