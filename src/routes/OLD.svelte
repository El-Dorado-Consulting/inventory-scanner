
<script>
  import moment from 'moment'
  import {lastRecordID, logs, scanValue} from '$lib/data/stores.js'

  import Scanner from '$lib/components/Scanner.svelte'
  import ScanOut from "$lib/components/Scan-out.svelte"
  
  import { assets } from "$app/paths";


  export let inventoryList
  let lastScan = ''
  let itemData = {
    description:'',
    image: 'https://blog.greendot.org/wp-content/uploads/sites/13/2021/09/placeholder-image.png'
  }
  
  function handleScan (event) {
    lastScan = event.detail.string
    // Find the item data in the inventory list
    itemData = inventoryList.find(x => x.partID === lastScan )
    if (itemData === undefined) {
      alert (`${lastScan} was not found`)
      return
    }
    if (lastScan === $scanValue ) {
       incrementItem()

    } else {
      consumeItem()
    }
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

  async function incrementItem() {
    console.log('update quantity')
    const submit = await fetch("/api/updateQuantity", {
      method: "POST",
      body: JSON.stringify({
        id: $lastRecordID,
        quantity: quantity,
      }),
    });
    const data = await submit.json();
    logs.update((logs) => {
      let lastRecord = logs[0];
      logs.shift();
      logs.unshift({
        time: lastRecord.time,
        description: lastRecord.description,
        quantity,
      });
      return logs;
    });
    //reset view
    quantity = 1;
    itemData.description = "";
    document.getElementById('quantity').blur()
    console.log('blur called')
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

<Scanner on:message={handleScan} />
<ScanOut {itemData} />



 