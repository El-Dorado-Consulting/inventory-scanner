<!-- <script context="module">
  export async function load ({fetch}) {
    const res = await fetch("/api/getInventory")
    const data = await res.json()
    return {
      props:{
        data
      }
    }
  }
</script> -->


<script>
  import { scanValue, inventoryLibrary } from "$lib/data/stores.js"
  import Scanner from '$lib/components/Scanner.svelte'
  import ScanOut from "$lib/components/Scan-out.svelte"

  export let data
  // $:inventoryLibrary = data
  
  // $scanValue
  // $: console.log('Scan value:', scanValue)

</script>


<Scanner />
<ScanOut />



 