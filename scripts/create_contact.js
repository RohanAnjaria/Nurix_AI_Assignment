import { hs, getOwnerId } from "./hubspot_client.js";

const example = {
  email: "colepalmer10@gmail.com",
  phone: "+918934578012",
  candidate_name: "Cole Palmer",
  candidate_past_company: "A T & T services",
  candidate_experience: 5.5, // number of years
  // Date must be milliseconds since Unix epoch per HubSpot's date property
  candidate_date_of_joining: Date.UTC(2020, 2, 15) // March 15, 2020
};

async function main() {
  const ownerId = await getOwnerId();

  const res = await hs.post("/crm/v3/objects/contacts", {
    properties: {
      email: example.email,
      phone: example.phone,
      candidate_name: example.candidate_name,
      candidate_past_company: example.candidate_past_company,
      candidate_experience: example.candidate_experience,
      candidate_date_of_joining: example.candidate_date_of_joining,
      hubspot_owner_id: ownerId
    }
  });

  console.log("✔ Contact created");
  console.log(JSON.stringify(res.data, null, 2));
}

main().catch(err => {
  console.error(err.response?.data || err.message);
  process.exit(1);
});
