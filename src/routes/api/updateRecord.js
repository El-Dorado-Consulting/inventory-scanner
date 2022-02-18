import { base } from '$lib/data/airtable.js'

export async function post({request}) {
  const data = await request.json()
  let newRecord = await updateAirtableRecord(data)
  return {
    body: { newRecord }
  }
}

async function updateAirtableRecord(data) {
  const {table, id, fields} = data
  console.log(table, id, fields)
  return new Promise((resolve, reject) => {
    base(table).update([
      {
        "id": id,
        "fields": fields
      }
    ], function (err, records) {
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






