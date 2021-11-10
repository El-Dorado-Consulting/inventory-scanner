import { base } from '$lib/data/airtable.js'

export async function post(request) {
  console.log('hello')
  const data = JSON.parse(request.body)
  const {id, quantity} = data
  let newRecord = await updateConsumptionQuanitity(id, quantity)
  return {
    body: { newRecord }
  }
}

async function updateConsumptionQuanitity(id, quanity) {
  const res = await base('Consuming').update([
    {
      "id": id,
      "fields": {
        "Quantity": parseInt(quanity)
      }
    }
  ], function (err, records) {
    if (err) {
      alert('failed to update quantity')
      console.error(err);
      return;
    }
    records.forEach(function (record) {
      return record

    })
  })
}




