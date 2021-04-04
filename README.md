## Tiny Jwt

First edit the .env file to match your needs.
Choose if you want to connect to db with HOST:PORT or connection string.

To generate your secret use 
```bash
node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```

### Install dependencies
```bash
npm install
```

### Run the server 
```bash
node server.js
```

### Usage
Send a POST request to /register
```json
{
	"username" : "test",
	"password" : "password",
   	 "email": "test@mytest.com"
}
```
You ll get a Token as response.
Put that Token in the header and send a POST request to /login

```json
{
	"username" : "test",
	"password" : "password"
}
```
Tokens expires in 60 days so be sure you check for the refresh token in the login response.
If you get a new token you have to replace the old token on client-side.


You can also do with your email:
```json
{
	"email" : "test@mytest.com",
	"password" : "password"
}
```
!Note⚠️
Passwords are never stored into the database

### Google login (optional)

If you want to login with google just send a GET request to /logingoogle

That's it !
