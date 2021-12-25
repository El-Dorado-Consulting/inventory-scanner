import {base} from '$lib/data/airtable.js'

export async function get () {
  let data = await getInventory()
    return {
      body: data
    }
}
  
async function getInventory () {
  console.log('Get inventory called')
  let array = []
  try {
    const records = await base('Supermarket').select({ view:'scanner' }).all()
    records.map((record) => {
      array.push({
        airtableID:record.id,
        partID:record.get("Product ID"),
        description:record.get("Description"),
        image: record.fields.Images !== undefined ? record.fields.Images[0].thumbnails.large.url : undefined,
        quantity: 1
      });
    })
  } catch (e) {
    console.error(e)
  }
  return array  
}



