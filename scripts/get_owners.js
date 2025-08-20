import { hs } from "./hubspot_client.js";

async function main() {
  const res = await hs.get("/crm/v3/owners/");
  console.table(res.data.results.map(o => ({
    id: o.id,
    firstName: o.firstName,
    lastName: o.lastName,
    email: o.email,
    archived: o.archived
  })));
}
main().catch(err => {
  console.error(err.response?.data || err.message);
  process.exit(1);
});
