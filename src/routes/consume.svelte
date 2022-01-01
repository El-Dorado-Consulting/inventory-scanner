<script>
  import moment from "moment";
  import {
    scanEvent,
    currentItem,
    lastAirtableRecord,
    inventoryLibrary,
    allowInput,
    logs,
  } from "$lib/data/stores.js";

  import Scanner from "$lib/components/Scanner.svelte";
  import Form from "$lib/components/Form.svelte";
  import Log from "$lib/components/Log.svelte";

  function updateLog(item) {
    const time = moment().format("H:mm:ss");
    console.log('quant', item.quantity)
    if (item.quantity > 1) {
      console.log('log quant update', )
      logs.update((logs) => {
        logs.shift();
        logs.unshift({
          time,
          description: item.description,
          quantity: item.quantity,
        });
        return logs;
      });
    } else {
      let log = {
        time,
        description: item.description,
        quantity: 1,
      };
      logs.update((logs) => {
        logs.unshift(log);
        return logs;
      });
    }
  }

  async function consumeItem(item) {
    console.log("Consume item called");
    const record = item;
    const submit = await fetch("/api/newRecord", {
      method: "POST",
      body: JSON.stringify({ table: "Consuming", record }),
    });
    const data = await submit.json();
    console.log(data.newRecord);
    if (typeof data.newRecord === "string") {
      lastAirtableRecord.update((item) => {
        return data.newRecord;
      });
      updateLog(item)
      $allowInput = false
    }
  }

  async function updateQuantity(item) {
    console.log("Update quanity called");
    const record = { Quantity: item.quantity };
    const recordId = $lastAirtableRecord;
    console.log(record, recordId)
    const submit = await fetch("/api/updateRecord", {
      method: "POST",
      body: JSON.stringify({ table: "Consuming", recordId, record }),
    });
    const data = await submit.json();
    console.log("Last record Updated ", data.newRecord);
    if (typeof data.newRecord === "string") {
      lastAirtableRecord.update((item) => {
        return data.newRecord;
      });
      updateLog(item)
    }
  }

  function updateCurrentItem(event) {
    console.log("Type: ", event.type);
    if (event.type === "new") {
      let item = $inventoryLibrary.filter(
        (il) => il.partID === event.string
      )[0];
      currentItem.set({ ...item });
    }
    if (event.type === "repeat") {
      console.log("b");
      $currentItem.quantity += 1;
    }
  }

  function handleUpdate(item) {
    if (Object.keys(item).length === 0) return;
    if (item.quantity > 1) {
      updateQuantity(item);
      return;
    } else if (item.description !== '') {
      consumeItem(item);
      return;
    }
  }

  $: updateCurrentItem($scanEvent);
  $: handleUpdate($currentItem);
</script>

<Scanner />
<div class="flex my-6">
  <Form item={$currentItem} on:message={updateQuantity($currentItem)} />
  <Log logType="Consuming" />
</div>

