
## RepairRabbit-Quickbooks Integration

The RepairRabbit team has written this **RepairRabbit-Quickbooks integration** app to provide working example of how you can use RepairRabbit API to integrate RepairRabbit with other systems.


### Getting Started

Before beginning, It is advicable to refer RepairRabbit [website](https://www.repairrabbit.co). You can get to know everything about RepairRabbit.

It is also expected that your development environment is properly set up for Node.js and NPM.

Note: this app was tested with Node.js versions v6.0.0, v7.0.0, and v8.0.0.

#### Setup

Clone the repository:
```
git clone https://github.com/IntuitDeveloper/oauth2-nodejs.git
```

Install NPM dependencies:
```
cd RepairRabbit-Quickbooks
npm install
```

Create `.env` file (reference `example.env`).

Launch your app:
```
node app.js
```

Your app should be running!  If you direct your browser to `https://localhost:3000`, you should see the welcome screen.  Please note - the app will not be fully functional until we finish configuring it.

### Configuring your app

All configuration for this app is located in `config.json`.  Locate and open this file.

You will be required to update 3 items:

- `clientId`
- `clientSecret`
- `redirectUri`

All of these values must match **exactly** with what is listed in your app settings on [developer.intuit.com](https://developer.intuit.com).  If you haven't already created an app, you may do so there.  Please read on for important notes about client credentials, scopes, and redirect urls.

#### Client Credentials

Once you have created an app on Intuit's Developer Portal, you can find your credentials (Client ID and Client Secret) under the "Keys" section.  These are the values you'll have to copy into `config.json`.

#### Redirect URI

You'll have to set a Redirect URI in both `config.json` *and* the Developer Portal ("Keys" section).  With this app, the typical value would be `http://localhost:3000/callback`, unless you host this sample app in a different way (if you were testing HTTPS, for example).

**Note:** Using `localhost` and `http` will only work when developing, using the sandbox credentials.  Once you use production credentials, you'll need to host your app over `https`.

#### Scopes

While you are in `config.json`, you'll notice the scope sections.

```
  "scopes": {
      "connect_to_quickbooks": [
      "com.intuit.quickbooks.accounting",
      "com.intuit.quickbooks.payment"
    ]
  }
```
It is important to ensure that the scopes you are requesting match the scopes allowed on the Developer Portal.  For this sample app to work by default, your app on Developer Portal must support both Accounting and Payment scopes.  If you'd like to support Accounting only, simply remove the`com.intuit.quickbooks.payment` scope from `config.json`.

----------

### Run your app!

After setting up both Developer Portal and your `config.json`, try launching your app again!
```
node app.js
```
All flows should work.  The sample app supports the following flows:

**Sign In With Intuit** - this flow requests OpenID only scopes.  Feel free to change the scopes being requested in `config.json`.  After authorizing (or if the account you are using has already been authorized for this app), the redirect URL (`/callback`) will parse the JWT ID token, and make an API call to the user information endpoint.

**Connect To QuickBooks** - this flow requests non-OpenID scopes.  You will be able to make a QuickBooks API sample call (using the OAuth2 token) on the `/connected` landing page.

**Import customers to RepairRabbit** - Once you are connected with Quickbooks by doing Oauth, You can import your customers from quickbooks to repairrabbit by clicking on button `Import Customers To RepairRabbit`.


----------
