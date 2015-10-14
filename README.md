# Cloud Foundry Deploy

A Cloud Foundry deploy tool written in Node specifically designed to support various continuous integration and deployment workflows especially with an eye towards self-service CI/CD tools like Travis or Circle CI.

**This Is Not Production Ready Yet**

### Getting This to Work

To work on this, you'll need to add a `config.json` file to this repo that looks something like this:

```javascript
{
  "endpoint": "https://api.endpoint.com",
  "username": "username@domain.com",
  "password": "secret-password",
  "name": "Application Name"
}
```