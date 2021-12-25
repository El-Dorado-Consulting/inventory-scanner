<script>
  import { logs } from '$lib/data/stores.js'

  const clearLog = () => {
    
  }

</script>


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


