
class UserController {
    constructor(log, userService, httpSatus) {
        this.log = log;
        this.userService = userService;
        this.httpSatus = httpSatus;
    }

    async create(req, res) {
        try {
            const { body } = req;
            const result = await this.userService.createUser(body);

            res.send(result);
        } catch (err) {
            this.log.error(err.message);
            res.send(err);
        }
    }

    async createGoogle(username,email,accessToken) {
        try {

            const result = await this.userService.createUserGoogle(username,email,accessToken);

        } catch (err) {
            this.log.error(err.message);
            console.log(err.message)
        }
    }

    async get(req, res) {
        try{
            const { headers } = req;
            const { body } = req
            const result = await this.userService.getUser(headers.authorization,body);

            res.send(result);
        } catch (err) {
            this.log.error(err.message);
            res.send(err);
        }
    }

}

module.exports = UserController;