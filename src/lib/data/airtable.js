import Airtable from 'airtable'
import Moment from 'moment'

const apiKey = 'keyyKoLrS4fQAkhML'
const baseID = 'appaXW95iIHcAeyWW'

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: apiKey
})

export const base = Airtable.base(baseID);

