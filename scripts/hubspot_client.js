import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.HUBSPOT_TOKEN;
if (!token) {
  console.error("Missing HUBSPOT_TOKEN in .env");
  process.exit(1);
}

export const hs = axios.create({
  baseURL: "https://api.hubapi.com",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  timeout: 20000
});

export async function getOwnerId() {
  if (process.env.HUBSPOT_OWNER_ID) {
    return process.env.HUBSPOT_OWNER_ID;
  }
  const email = process.env.HUBSPOT_OWNER_EMAIL;
  if (!email) {
    throw new Error("Please set HUBSPOT_OWNER_ID or HUBSPOT_OWNER_EMAIL in .env");
  }
  const res = await hs.get("/crm/v3/owners/");
  const match = res.data.results.find(o => (o.email || "").toLowerCase() === email.toLowerCase());
  if (!match) {
    throw new Error(`Owner not found for email ${email}`);
  }
  return match.id;
}
