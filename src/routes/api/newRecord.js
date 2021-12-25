
import { base } from '$lib/data/airtable.js'
import { Table } from 'airtable'

export async function post(request) {
  const data = JSON.parse(request.body)
  let newRecord = await createConsumptionRecord(data)
  return {
    body: { newRecord }
  }
}

async function createConsumptionRecord(data) {
  const {table, record} = data
  return new Promise((resolve, reject) => {
    base(table).create([
      {
        "fields": {
          "Description": record.description,
          "Quantity": 1,
          "Supermarket": [record.airtableID]
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
