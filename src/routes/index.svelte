<script context="module">
  export async function load ({fetch}) {
    const res = await fetch("/api/getInventory")
    const inventoryList = await res.json()
    return {
      props:{
        inventoryList
      }
    }
  }
</script>

<script>
  import moment from 'moment'
  import {lastRecordID, logs} from '$lib/data/stores.js'

  import Scanner from '$lib/components/Scanner.svelte'
  import ScanOut from "$lib/components/Scan-out.svelte"

  export let inventoryList
  let lastScan = ''
  let itemData = {
    description:''
  }
  

  function handleScan (event) {
    lastScan = event.detail.string
    // Find the item data in the inventory list
    itemData = inventoryList.find(x => x.partID === lastScan );
    itemData === undefined ? alert (`${lastScan} was not found`) : handleMethods(itemData)
  }

  async function consumeItem (item) {
    console.log('consume item called')
    const submit = await fetch("/api/consumePart", {
      method: "POST",
      body: JSON.stringify(item)
    })
    const data = await submit.json()
    $lastRecordID = data.newRecord

    updateLog(item)
  }

  async function handleMethods (itemData) {
    //TODO method types go here
    await consumeItem(itemData)
  }

  function updateLog (item) {
    const log = {
      time: moment().format('H:mm:ss'),
      description: item.description,
      quantity: 1
    }
    logs.update(currentList => {
      currentList.unshift(log) 
      return currentList})
  }


</script>
<p>{lastScan}</p>
<Scanner on:message={handleScan} />
<ScanOut {itemData} />



 