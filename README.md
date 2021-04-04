## Tiny Jwt

Api for authentication , grant type is user and password. <br/>
First edit the .env file to match your needs. <br/>
Choose if you want to connect to db with HOST:PORT or connection string. <br/>

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
You ll get a Token as response. <br/>
Put that Token in the header and send a POST request to /login <br/>

```json
{
	"username" : "test",
	"password" : "password"
}
```
Tokens expires in 60 days so be sure you check for the refresh token in the login response. <br/>
If you get a new token you have to replace the old token on client-side. <br/>


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

If you want to login with google just send a GET request to /logingoogle <br/>
 
That's it !
