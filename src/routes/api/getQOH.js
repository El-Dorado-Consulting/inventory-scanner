import { base } from '$lib/data/airtable.js'

export async function get(request) {
  let params = new URLSearchParams(request.url.search)
  const id = params.get('id')
  const record = await base('Supermarket').find(id)
  const qoh = record.fields.QOH
  console.log(qoh)
  return {
    body: qoh
  }
}





