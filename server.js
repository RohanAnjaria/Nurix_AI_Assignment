import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;
const WEBHOOK_SITE_URL = process.env.WEBHOOK_SITE_URL;

console.log("HubSpot Token Loaded:", !!HUBSPOT_TOKEN);
console.log("Webhook URL:", WEBHOOK_SITE_URL);

// HubSpot Webhook Receiver
app.post("/hubspot/events", async (req, res) => {
  try {
    console.log("📩 HubSpot Event Received:", JSON.stringify(req.body, null, 2));

    const events = Array.isArray(req.body) ? req.body : req.body.events || [];

    for (const event of events) {
      if (
        event.propertyName === "hubspot_owner_id" &&
        (event.changeSource === "CRM_UI" || event.changeSource === "API")
      ) {
        const contactId = event.objectId;

        // Fetch contact details
        const contact = await axios.get(
          `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname,phone`,
          { headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` } }
        );

        const props = contact.data.properties || {};
        const candidateName = `${props.firstname || ""} ${props.lastname || ""}`.trim();
        const candidatePhone = props.phone || "N/A";

        // Forward to webhook.site
        await axios.post(WEBHOOK_SITE_URL, {
          Candidate_name: candidateName,
          Candidate_number: candidatePhone,
        });

        console.log(`🚀 Forwarded contact ${candidateName} to webhook.site`);
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error handling event:", err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
