import { writable, derived } from "svelte/store";


export const inventoryLibrary = writable([])
export const scanEvent = writable({string:'', previousString:'', type:'', timestamp:''})
// Derived Stores
export const currentItem = writable({
  description:'',
  quanity:'',
  image:'https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg'
})

export const allowInput = writable(false)
export const lastAirtableRecord = writable('')
export const logs = writable([])
