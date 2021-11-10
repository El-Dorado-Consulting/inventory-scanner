<script>

  import { logs, lastRecordID } from '$lib/data/stores.js'
  import { assets } from "$app/paths";

  export let itemData = {}

  $: quantity = 1;
  let imgURL = assets + "no-image.png";

  async function updateQuantity () {
    const submit = await fetch("/api/updateQuantity", {
      method: "POST",
      body: JSON.stringify({
        id: $lastRecordID,
        quantity: quantity
      })
    })
    const data = await submit.json()
    logs.update(logs => {
      let lastRecord = logs[0]
      logs.shift()
      logs.unshift({
        time:lastRecord.time, 
        description:lastRecord.description,
        quantity
      })
      return logs
    })
    //reset view
    quantity = 1
    itemData.description = ''

  }


</script>

<div class="mt-4 flex">
  <section class="flex-1 px-4">
    <h4 class="text-2xl">Scan Out</h4>
    <table>
      <tr>
        <td class="py-4">Description:</td>
        <td id="scan-description">{itemData.description}</td>
      </tr>
      <td class="col-short">Quantity:</td>
      <td>
        <form on:submit|preventDefault={updateQuantity}>
          <input
            class="shadow p-2 text-center"
            type="text"
            bind:value={quantity}
          />
        </form>
      </td>
    </table>
    <br />
    <div class="h-56 flex ">
      <img class="m-auto align-middle" src={itemData.image} alt="" />
    </div>
  </section>
  <section class="flex-1 border-l-4 px-4">
    <div class="flex justify-between">
      <h4 class="text-2xl">Scan Log</h4>
      <button class="text-blue-500 hover:text-blue-700">Clear Log</button>
    </div>
    <table class="table-auto w-full mt-4 ">
      <tr class=" bg-gray-200 ">
        <th class="">Time</th>
        <th class="">Description</th>
        <th>Quantity</th>
      </tr>
      {#each $logs as log}
        <tr>
          <th class="font-normal">{log.time}</th>
          <th class="font-normal"> {log.description}</th>
          <th class="font-normal">{log.quantity}</th>
        </tr>
      {/each}
    </table>
  </section>
</div>
{$lastRecordID}

<style>
  th {
    padding-top: 1rem;
  }
</style>
