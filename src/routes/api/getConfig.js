import { base } from '$lib/data/airtable.js'

export async function get() {
  let array = []
  try {
    const records = await base('Configuration').select({ view: 'scanner' }).all()
    records.map((record) => {
      array.push({
        key: record.get("Key"),
        value: record.get("Value"),
      });
    })
    console.table(array)
    return {
      body: array
    }
  } catch (e) {
    console.error(e)
  }
}


