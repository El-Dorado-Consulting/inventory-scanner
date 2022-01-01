import { writable, derived } from "svelte/store";


export const inventoryLibrary = writable([])
export const scanEvent = writable({string:'', previousString:'', type:'', timestamp:''})

export let emptyItem = {
  description:'',
  quanity:'',
  image:'https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg'
}

// Derived Stores
export const currentItem = writable({})

// Check if currentItemcomes back undefined

export const lastAirtableRecord = writable('')

export const logs = writable([])

//New Scan
// Case One - Not found
  // - currentItem returns undefined
// Case Two - Found and not the same as previous
// Case three - Found and is the same as previous


//Variable names
// scanEvent
// Can updating an object be detected by svelte?
