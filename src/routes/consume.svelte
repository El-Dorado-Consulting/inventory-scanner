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
      logs.push(log);
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

  async function updateQuantity(item) {
    const record = {Quantity: item.quantity}
    const id = $lastAirtableRecord
    const submit = await fetch("/api/updateRecord", {
      method: "POST",
      body: JSON.stringify({table:'Consuming', id, record}),
    });
    const data = await submit.json();
    console.log(data.newRecord);
    if (typeof data.newRecord === "string") {
      lastAirtableRecord.update( item => {
        return data.newRecord;
      })
      incrementLog(item)
    }
  }

  function handleUpdate (item) {
    if (item.quantity > 1) {
      updateQuantity(item)
    } else {
      consumeItem(item)
    }
  }

  // Consume only when currentItem changes
  $: if($currentItem.description != ''){handleUpdate($currentItem)};
  

</script>

<Scanner />
<div class="flex my-6">
  <Form />
  <Log />

</div>
