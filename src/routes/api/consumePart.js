
import {base} from '$lib/data/airtable.js'

export async function post (request) {
  const data = JSON.parse(request.body)
  const {airtableID, description} = data
  console.log(data)
  let newRecord = await consumePart(airtableID, description)
    return {
      body: {newRecord}
    }
}
async function consumePart (id, description) {
  console.log('consume part called')
    //Push to Airtable
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
        return;
      }
      records.forEach(function (record) {
        LAST_PART_ID = record.getId()
        console.log(LAST_PART_ID)
        return LAST_PART_ID
      });
    })
  }

