<script>
  import { logs } from '$lib/data/stores.js'
</script>


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


