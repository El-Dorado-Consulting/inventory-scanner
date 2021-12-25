import { base } from '$lib/data/airtable.js'

export async function post(request) {
  console.log('update record')
  const data = JSON.parse(request.body)
  let newRecord = await updateQuanity(data)
  return {
    body: { newRecord }
  }
}

async function updateQuanity(data) {
  const {table, id, record} = data
  return new Promise((resolve, reject) => {
    base(table).update([
      {
        "id": id,
        "fields": record
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






