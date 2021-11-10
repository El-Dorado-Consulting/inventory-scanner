
import { base } from '$lib/data/airtable.js'


export async function post(request) {
  const data = JSON.parse(request.body)
  const { airtableID, description } = data
  console.log(data)
  let newRecord = await consumePart(airtableID, description)
  console.log('newRecord', newRecord)
  return {
    body: { newRecord }
  }
}


async function consumePart(id, description) {
  return new Promise((resolve, reject) => {
    base('Consuming').create([
      {
        "fields": {
          "Description": description,
          "Quantity": 1,
          "Supermarket": [id]
        }
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


console.log('consume part called')
//Push to Airtable

