import { writable, derived } from "svelte/store";

//helpers


export const inventoryLibrary = writable([])
export const scanString = writable('')



export const currentItem = derived([inventoryLibrary, scanString],
  ([$inventoryLibrary, $scanString]) => {
    $inventoryLibrary.find((il) => il.partID === $scanString)
  })

export const lastAirtableRecord = writable('')
export const logs = writable([])


// Consume
