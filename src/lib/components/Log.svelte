<script>
  import { page } from "$app/stores";
  import { clearLog } from "$lib/helpers/logHelpers.svelte"
  export let logs 
  let path = $page.url.pathname;

  function handleClick() {
    clearLog(path)
  }

</script>

<section class="flex-1 border-l-4 ">
  <div class="mx-4">
    <div class="flex justify-between">
      <h4 class="text-2xl font-bold">Log</h4>
      <button on:click={handleClick} class="text-blue-500 hover:text-blue-700"
        >Clear Log</button
      >
    </div>
    <table class="table-fixed w-full mt-8">
      <tr class="">
        <th class="">Time</th>
        <th class="w-80">Description</th>
        <th>Quantity</th>
      </tr>
      {#each logs as log}
        <tr>
          <th class="font-normal font-mono">{log.time}</th>
          <th class="font-normal text-left whitespace-nowrap truncate overflow-hidden"> {log.description}</th>
          <th class="font-normal">{log.quantity}</th>
        </tr>
      {/each}
    </table>
  </div>
</section>
