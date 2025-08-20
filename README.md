# Backend Integration & HubSpot Automation — Complete Solution

This repo contains:
- **Assignment 1:** A HubSpot Workflow that triggers a **Webhook (POST JSON)** to a `webhook.site` URL whenever a Contact Owner is **assigned or updated**.
- **Assignment 2:** **Node.js** scripts that create custom contact properties via API, create a contact assigned to a specific owner with those properties, and update an existing contact.

---

## 0) Prerequisites

- HubSpot account with permissions to create **Private App** (for API access) and **Workflows**.
- Node.js 18+
- A `webhook.site` URL (free, no login needed).

---

## 1) Assignment 1 — Webhook Trigger on Contact Assignment (No code needed)

### Goal
When the **Contact owner** is assigned/changed for a Contact, automatically send a JSON POST to `webhook.site` with candidate details.

### Steps in HubSpot (UI)
1. **Create/verify custom properties** (you can also do this using scripts in **Assignment 2**):
   - `candidate_name` (Text)
   - `candidate_past_company` (Text)
   - `candidate_experience` (Number)
   - `candidate_date_of_joining` (Date)

2. Go to **Automation → Workflows → Create workflow → From scratch**.
3. **Object:** Contact.
4. **Enrollment trigger:**  
   - Set to: `Contact property` → **Contact owner** → *is known*  
     Add **Re-enrollment** for: `Contact owner` **is updated** so the workflow runs again when ownership changes.
5. **Action:** **Send a webhook**. Configure:
   - **Method:** `POST`
   - **URL:** paste your unique `https://webhook.site/<your-id>` URL
   - **Headers:** `Content-Type: application/json`
   - **Request body:** Choose **JSON** and paste this payload. Replace HubSpot tokens as needed:
     ```json
     {
       "Candidate_name": "{{ contact.candidate_name }}",
       "Candidate_number": "{{ contact.phone }}"
     }
     ```
     > You can map `Candidate_number` to any phone property you use (e.g., `phone` or a custom field).

6. **Review & Turn On** the workflow.
7. **Test:** Assign a contact to an owner (or change the owner). Then open your `webhook.site` page to **see the incoming request** and **payload**.

### What to capture for submission
- Screenshot of the workflow settings (trigger + webhook action).
- Screenshot from `webhook.site` showing the **POST JSON** received (headers + body).
- Screenshot of the contact showing **Contact owner** and the **candidate\_*** properties used in the payload.

---

## 2) Assignment 2 — Create & Update Custom Properties and Contacts via API (Node.js)

### Setup
1. Create a **Private App** in HubSpot and copy the **Access Token**.
   - Scopes needed: `crm.objects.contacts.write`, `crm.objects.contacts.read`, `crm.schemas.contacts.write`, `crm.schemas.contacts.read`, `crm.userstokens.read` (owners).
2. Clone/download this folder and run:
   ```bash
   cd hubspot-backend-integration-assignment
   cp .env.example .env
   # Edit .env and paste your token + owner info
   npm install
   ```

### Scripts
- **Create properties** (idempotent):
  ```bash
  npm run create:properties
  ```

- **List owners** (to get owner IDs if needed):
  ```bash
  npm run owners
  ```

- **Create a contact** (assigned to an owner + set custom props):
  ```bash
  npm run create:contact
  ```

- **Update an existing contact** (set CONTACT_ID env var):
  ```bash
  CONTACT_ID=1234567890 npm run update:contact
  ```

### API Endpoints Used

**Create custom properties**  
`POST /crm/v3/properties/contacts`  
Example body (one per property):
```json
{
  "name": "candidate_name",
  "label": "Candidate Name",
  "type": "string",
  "fieldType": "text",
  "groupName": "contactinformation",
  "description": "Full name of the candidate"
}
```

**Get a property**  
`GET /crm/v3/properties/contacts/{propertyName}`

**List owners**  
`GET /crm/v3/owners/`

**Create a contact**  
`POST /crm/v3/objects/contacts`  
Body (sample):
```json
{
  "properties": {
    "email": "abhisek@example.com",
    "phone": "+91700999999",
    "candidate_name": "Abhisek",
    "candidate_past_company": "Acme Corp",
    "candidate_experience": 5.5,
    "candidate_date_of_joining": 1736899200000,
    "hubspot_owner_id": "123456789"
  }
}
```

**Update a contact**  
`PATCH /crm/v3/objects/contacts/{contactId}`  
Body:
```json
{
  "properties": {
    "candidate_experience": 6.0,
    "candidate_past_company": "Globex",
    "candidate_date_of_joining": 1738368000000,
    "candidate_name": "Abhisek Kumar"
  }
}
```

### Authentication
Use **Private App Token** in the header:
```
Authorization: Bearer <HUBSPOT_PRIVATE_APP_TOKEN>
Content-Type: application/json
```

---

## 3) Example cURL Requests

> Replace `YOUR_TOKEN`, `OWNER_ID`, and contact IDs as appropriate.

**Create Property (candidate\_name):**
```bash
curl -X POST "https://api.hubapi.com/crm/v3/properties/contacts"   -H "Authorization: Bearer YOUR_TOKEN"   -H "Content-Type: application/json"   -d '{
    "name": "candidate_name",
    "label": "Candidate Name",
    "type": "string",
    "fieldType": "text",
    "groupName": "contactinformation",
    "description": "Full name of the candidate"
  }'
```

**Create Contact with owner & custom properties:**
```bash
curl -X POST "https://api.hubapi.com/crm/v3/objects/contacts"   -H "Authorization: Bearer YOUR_TOKEN"   -H "Content-Type: application/json"   -d '{
    "properties": {
      "email": "abhisek@example.com",
      "phone": "+91700999999",
      "candidate_name": "Abhisek",
      "candidate_past_company": "Acme Corp",
      "candidate_experience": 5.5,
      "candidate_date_of_joining": 1736899200000,
      "hubspot_owner_id": "OWNER_ID"
    }
  }'
```

**Update existing Contact:**
```bash
curl -X PATCH "https://api.hubapi.com/crm/v3/objects/contacts/CONTACT_ID"   -H "Authorization: Bearer YOUR_TOKEN"   -H "Content-Type: application/json"   -d '{
    "properties": {
      "candidate_experience": 6.0,
      "candidate_past_company": "Globex",
      "candidate_date_of_joining": 1738368000000,
      "candidate_name": "Abhisek Kumar"
    }
  }'
```

---

## 4) Testing & Evidence Checklist

- **Assignment 1 (Workflow)**
  - [ ] Assign or change **Contact owner** for a test contact.
  - [ ] Confirm **POST** appears on `webhook.site` (payload shows `Candidate_name` and `Candidate_number`).
  - [ ] Take screenshots of webhook request details.

- **Assignment 2 (APIs)**
  - [ ] Run `npm run create:properties` (take console screenshot).
  - [ ] Run `npm run owners` to capture owner list.
  - [ ] Run `npm run create:contact` (screenshot contact JSON + HubSpot UI contact record showing custom fields and assigned owner).
  - [ ] Run `npm run update:contact` and verify updated properties in HubSpot (screenshot).

---

## Notes & Best Practices

- **Dates:** HubSpot date properties expect **UTC milliseconds since epoch**.
- **Owner Assignment:** `hubspot_owner_id` must match an active owner’s ID. Use the `owners` script or UI to find it.
- **Idempotency:** The property creation script checks for existence to avoid errors on re-run.
- **Security:** Store tokens in `.env` — never commit them.
- **Webhooks vs. Custom Code:** The workflow-based webhook keeps things low-code and debuggable; if you need custom signing/logic, you can replace `webhook.site` with your own endpoint and verify requests server-side.

Good luck with your submission!
