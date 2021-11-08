import Airtable from 'airtable'
import Moment from 'moment'

const apiKey = 'keyyKoLrS4fQAkhML'
const baseID = 'appaXW95iIHcAeyWW'

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: apiKey
})

const base = Airtable.base(baseID);

export async function get () {
  let data = await getInventory()
  console.log('DATA', data)
    return {
      body: data
    }
}
async function getInventory () {
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



