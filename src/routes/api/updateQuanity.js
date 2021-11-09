import {base} from '$lib/data/airtable.js'

export async function post (request) {
  const data = JSON.parse(request.body)
  const {airtableID, quanity} = data
  console.log(data)
  let newRecord = await updateConsumptionQuanitity(airtableID, quanity)
    return {
      body: {newRecord}
    }
}



async function updateConsumptionQuanitity () {
  let array = []
  try {
    const records = await base('Supermarket').select({ view:'scanner' }).all()
    records.map((record) => {
      array.push({
        airtableID:record.id,
        partID:record.get("Product ID"),
        description:record.get("Description"),
        image: record.fields.Images !== undefined ? record.fields.Images[0].thumbnails.large.url : undefined
      });
    })
  } catch (e) {
    console.error(e)
  }
  return array
}



