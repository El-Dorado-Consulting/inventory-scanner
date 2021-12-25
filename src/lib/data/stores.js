import { writable } from "svelte/store";

export const currentItem = writable({
  description: '',
  image: 'https://via.placeholder.com/200'
})

export const lastItemString = writable()

export const scanString = writable('JP01123')
export const scanItem = writable ({})
export const lastRecordID = writable('')
export const inventoryLibrary = writable([])


export const logs = writable([
])
export const lastAirtableRecord = writable('')


// Consume
