import { hs } from "./hubspot_client.js";

const PROPS = [
  {
    name: "candidate_experience",
    label: "Candidate Experience",
    type: "number",
    fieldType: "number",
    groupName: "contactinformation",
    description: "Total years of experience for the candidate"
  },
  {
    name: "candidate_date_of_joining",
    label: "Candidate Date Of Joining",
    type: "date",
    fieldType: "date",
    groupName: "contactinformation",
    description: "Expected / actual date of joining (UTC ms since epoch)"
  },
  {
    name: "candidate_name",
    label: "Candidate Name",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
    description: "Full name of the candidate"
  },
  {
    name: "candidate_past_company",
    label: "Candidate Past Company",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
    description: "Previous employer"
  }
];

async function ensureProperty(def) {
  try {
    // Check if property exists
    await hs.get(`/crm/v3/properties/contacts/${def.name}`);
    console.log(`✔ Property '${def.name}' already exists`);
  } catch (e) {
    if (e.response && e.response.status === 404) {
      // Create property
      const res = await hs.post("/crm/v3/properties/contacts", def);
      console.log(`+ Created property '${res.data.name}'`);
    } else {
      console.error(`Failed to verify/create property ${def.name}`, e.response?.data || e.message);
      throw e;
    }
  }
}

async function main() {
  for (const p of PROPS) {
    await ensureProperty(p);
  }
  console.log("Done.");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
