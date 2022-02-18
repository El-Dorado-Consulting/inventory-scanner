
import { base } from '$lib/data/airtable.js'

export async function post({ request }) {
  let data = await request.json()
  let recordId = await newAirtableRecord(data)
  return {
    body: { recordId }
  }
}

async function newAirtableRecord(data) {
  console.log(data)
  const { table, fields } = data
  return new Promise((resolve, reject) => {
    base(table).create([{ fields }], function (err, records) {
      if (err) {
        console.error(err);
        reject(err);
      }
      records.forEach(function (record) {
        resolve(record.getId())
      });
    });
  })
}
