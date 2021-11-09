<script>
  import { lastItem, logs } from "$lib/data/stores.js";

  import { assets } from "$app/paths";
  $: description = "fuck";
  $: quantity = 1;
  $: imgURL = assets + "no-image.png";

  async function updateQuantity () {
    console.log(quantity, ' was submitted')

  }



</script>

<div class="mt-4 flex">
  <section class="flex-1 px-4">
    <h4 class="text-2xl">Scan Out</h4>
    <table>
      <tr>
        <td class="py-4">Description:</td>
        <td id="scan-description">{$lastItem.description}</td>
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
      <img class="m-auto align-middle" src={$lastItem.image} alt="" />
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

<style>
  th {
    padding-top: 1rem;
  }
</style>
