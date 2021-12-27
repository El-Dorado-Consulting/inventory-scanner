<script>
  import moment from "moment";
  import { currentItem, lastAirtableRecord, logs } from "$lib/data/stores.js";

  import Scanner from "$lib/components/Scanner.svelte";
  import Form from "$lib/components/Form.svelte";
  import Log from "$lib/components/Log.svelte";

  function updateLog(item) {
    console.log("update log called");
    let log = {
      time: moment().format('H:mm:ss'),
      description: item.description,
      quantity: 1,
    };
    logs.update((logs) => {
      logs.unshift(log);
      return logs;
    });
  }

  function incrementLog(item) {
    logs.update((logs) => {
      logs.shift();
      logs.unshift({
        time: moment().format('H:mm:ss'),
        description: item.description,
        quantity:item.quantity,
      });
      return logs;
    });
  }

  async function consumeItem(item) {
    const record = item
    const submit = await fetch("/api/newRecord", {
      method: "POST",
      body: JSON.stringify({table:'Consuming', record }),
    });
    const data = await submit.json();
    console.log(data.newRecord);
    if (typeof data.newRecord === "string") {
      lastAirtableRecord.update( item => {
        return data.newRecord;
      })
      updateLog(item)
    }
  }

  async function updateQuantity(item, recordId) {
    const record = {Quantity: item.quantity}
    console.log('cock',recordId, record)
    const submit = await fetch("/api/updateRecord", {
      method: "POST",
      body: JSON.stringify({table:'Consuming', recordId, record}),
    });
    const data = await submit.json();
    console.log('Last record Updated ', data.newRecord);
    if (typeof data.newRecord === "string") {
      lastAirtableRecord.update( item => {
        return data.newRecord;
      })
      incrementLog(item)
    }
  }

  function handleUpdate (item) {
    // if (item.quantity > 1) {
    //   console.log('handle quant')
    //   let recordId = $lastAirtableRecord
    //   updateQuantity(item, recordId)
    // } else {
      console.log('handle consume')
      consumeItem(item)
    // }
  }

  // Consume only when currentItem changes
  $: if($currentItem.description != ''){handleUpdate($currentItem)};
  

</script>

<Scanner />
<div class="flex my-6">
  <Form />
  <Log />
</div>
{$lastAirtableRecord}
{JSON.stringify($currentItem)}
