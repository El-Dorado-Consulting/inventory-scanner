import Airtable from 'airtable'

// Unagi Production
// const apiKey = 'keyyKoLrS4fQAkhML'
// const baseID = 'appaXW95iIHcAeyWW'

//DEV
const apiKey = 'keyVZp2ocQihZwVe2'
const baseID = 'app98KmsE3o1c2H7W'


Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: apiKey
})

export const base = Airtable.base(baseID);

