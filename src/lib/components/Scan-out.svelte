<script>
  import { logs, lastRecordID, lastItem } from "$lib/data/stores.js";

  export let itemData = {};

  $: quantity = 1;

  async function updateQuantity() {
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

  function clearLog () {
    logs.set([])
  }



</script>

<div class="mt-4 flex">
  <section class="flex-1 px-4">
    <div class="mx-4">
      <h4 class="text-2xl font-bold mb-8">Scan</h4>
        <div class="mb-4">
          <label class="block mb-2" for="description"> Description </label>
          <input
            class="shadow appearance-none border rounded w-full p-3 focus:outline-none focus:shadow-outline text-center text-lg font-bold"
            id="description"
            type="text"
            value={itemData.description}
            disabled
          />
        </div>
        <form on:submit|preventDefault={updateQuantity} class="mb-6">
          <label class="mb-2" for="quantity"> Quantity </label>
          <input
            class="shadow appearance-none border rounded w-full text-center p-3 mb-3 leading-tight focus:outline-none focus:shadow-outline text-xl font-bold"
            id="quanity"
            type="text"
            disabled
            bind:value={quantity} 
          />
        </form>
        <div class="h-56 w-56 mx-auto flex my-8">
          <img class="m-auto align-middle" src={itemData.image} alt="" />
        </div>
    </div>
  </section>
  <section class="flex-1 border-l-4 px-4">
    <div class="mx-4">
      <div class="flex justify-between">
        <h4 class="text-2xl font-bold">Consumption Log</h4>
        <button on:click={clearLog} class="text-blue-500 hover:text-blue-700">Clear Log</button>
      </div>
      <table class="table-auto w-full mt-8">
        <tr class="">
          <th class="">Time</th>
          <th class="">Description</th>
          <th>Quantity</th>
        </tr>
        {#each $logs as log}
          <tr>
            <th class="font-normal font-mono">{log.time}</th>
            <th class="font-normal text-left px-2"> {log.description}</th>
            <th class="font-normal">{log.quantity}</th>
          </tr>
        {/each}
      </table>
    </div>
  </section>
</div>
