import { base } from '$lib/data/airtable.js'

export async function get() {
  let array = []
  try {
    const records = await base('Supermarket').select({ view: 'scanner' }).all()
    records.map((record) => {
      array.push({
        airtableId: record.id,
        partId: record.get("Product ID"),
        description: record.get("Description"),
        image: record.fields.Images ? record.fields.Images[0].thumbnails.large.url : undefined,
        category: record.get("Counting Category"),
        lastCounted: record.get("Last Counted")
      });
    })
    //console.table(array)
    return {
      body: array
    }
  } catch (e) {
    console.error(e)
  }
}


