import { base } from '$lib/data/airtable.js'

export async function post(request) {
  const data = JSON.parse(request.body)
  const { airtableID, quanity } = data
  console.log(data)
  let newRecord = await updateConsumptionQuanitity(airtableID, quanity)
  return {
    body: { newRecord }
  }
}

async function updateConsumptionQuanitity() {
  const res = await base('Consuming').update([
    {
      "id": LAST_PART_ID,
      "fields": {
        "Quantity": parseInt(quant)
      }
    }
  ], function (err, records) {
    if (err) {
      alert('failed to update quantity')
      console.error(err);
      return;
    }
    records.forEach(function (record) {
      let cell = document.getElementById('log-table').rows[1].cells[2]
      cell.textContent = quant
      console.log("Quantity updated")
    })
  })
}




