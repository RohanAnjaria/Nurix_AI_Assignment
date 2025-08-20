# Backend Integration & HubSpot Automation Assignment

This repo contains code for:
- **Assignment 1 – Webhook Trigger on Contact Assignment:** Send payload to external webhook endpoint when a new contact is assigned to a contact owner or contact owner for a contact is updated in HubSpot.
- **Assignment 2 – Creating & Updating Custom Properties via API:** Create custom properties for contact object, Create a new contact via the HubSpot API and assign it to a Contact Owner and implement an API call to update these custom properties for an existing contact.

---

## Assignment 1 – Webhook Trigger on Contact Assignment

### Prerequisites and setup required

1. Create a HubSpot account.
2. Create a Private App in HubSpot and assign webhook target URL to local backend server.
3. Add these scopes to the app: crm.objects.carts.read, crm.objects.carts.write
4. Set Webhook target url for this app to local backend server in our case : https://270e66b06913.ngrok-free.app/hubspot/events
5. Setup local backend server using the commands

```
npm install -g ngrok

ngrok http 3000
```
6. Create a .env file. We will store our environment variables here

   Set the values of the following variables accordingly

   ```
    HUBSPOT_TOKEN={token for your HubSpot private app}

    HUBSPOT_OWNER_EMAIL={email id of the contact owner}

    WEBHOOK_SITE_URL={webhook.site URL where the payload for Assignment 1 is to be delivered}

    PORT={Port where your local backend server will run}
 
    HUBSPOT_OWNER_ID={Contact owner id of contact owner}

    CONTACT_ID={Contact ID of the contact to be updated in part 3 of Assignment 2}
   ```
7. Create an event subscription Contact.propertyChange for your HubSpot app to detect changes in contact owner
8. Setup an external webhook on webhook.site to send Candidate_name and Candidate_number payload in JSON format. The URL we are using is : https://webhook.site/f3182416-f9c7-4f14-968d-70f52de82057
9. For Assignment 1 we need to run express.js as follows:
    

```
npm init -y

npm install express axios body-parser dotenv

node express.js
```

---

## Assignment 2

1. Part 1 : Create Custom Properties for the Contact object

Run the command
```
node scripts\create_properties.js
```

2. Part 2 : Contact Creation

Run the command
```
node scripts\create_contact.js
```
Note the CONTACT_ID of the contact created from the log in the console. This will be useful in part 3 and we can update .env accordingly.

3. Part 3 : API Update

Run the command
```
node scripts\update_contact.js
```
