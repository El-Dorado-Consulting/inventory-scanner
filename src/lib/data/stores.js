import { writable } from "svelte/store";

export const scanValue = writable('JP01123')
export const lastRecordID = writable('')
export const inventoryLibrary = writable([])
export const lastItem = writable({
  description: '',
  image: 'https://via.placeholder.com/200'
})
export const logs = writable([
])