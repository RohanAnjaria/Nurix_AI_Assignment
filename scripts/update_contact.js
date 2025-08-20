import { hs } from "./hubspot_client.js";

const CONTACT_ID = process.env.CONTACT_ID || "REPLACE_WITH_CONTACT_ID";

if (CONTACT_ID === "REPLACE_WITH_CONTACT_ID") {
  console.error("Please set CONTACT_ID env var or edit scripts/update_contact.js");
  process.exit(1);
}

const updateProps = {
  candidate_experience: 4.8,
  candidate_past_company: "Orange SA",
  candidate_date_of_joining: Date.UTC(2022, 6, 12), // July 12, 2025
  candidate_name: "Enzo Fernandez"
};

async function main() {
  const res = await hs.patch(`/crm/v3/objects/contacts/${CONTACT_ID}`, {
    properties: updateProps
  });
  console.log("✔ Contact updated");
  console.log(JSON.stringify(res.data, null, 2));
}

main().catch(err => {
  console.error(err.response?.data || err.message);
  process.exit(1);
});
