import { writable } from "svelte/store";

export const scanValue = writable('JP01123')
export const lastPartId = writable('0000000')
export const inventoryLibrary = writable([])
export const lastItem = writable({
  description: '',
  image: 'https://via.placeholder.com/200'
})
export const logs = writable([
  {
    time: '18:25:32',
    description: 'Large hinge block',
    quantity: 4
  },
  {
    time: '18:25:32',
    description: 'Large hinge block',
    quantity: 4
  },
  {
    time: '18:25:32',
    description: 'Large hinge block',
    quantity: 4
  },

])