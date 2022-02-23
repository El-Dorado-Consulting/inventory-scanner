
<script context="module">
  // Import Inventory Library on Load
  export async function load ({fetch}) {
    const res = await fetch("/api/getInventory")
    const inventoryList = await res.json()
    const res2 = await fetch("/api/getConfig")
    const configList = await res2.json()
    return {
      props:{
        // configList,
        inventoryList
      }
    }
  }
</script>

<script>
  import {inventoryLibrary, config } from "$lib/data/stores.js";
  import "../app.css";
  import Nav from "$lib/components/Nav.svelte";
  
  //Load inventory into store
  export let inventoryList
  export let configList
  inventoryLibrary.update(n => {return inventoryList})
  config.update(n => {return configList})



</script>
<div class="bg-gray-100 h-screen flex py-16">
  <div class = "bg-white shadow max-w-screen-xl m-auto min-h-full">
    <Nav />
    <slot />
  </div>
</div>
