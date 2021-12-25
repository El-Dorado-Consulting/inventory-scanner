
<script context="module">
  // Import Inventory Library on Load
  export async function load ({fetch}) {
    const res = await fetch("/api/getInventory")
    const inventoryList = await res.json()
    return {
      props:{
        inventoryList
      }
    }
  }
</script>

<script>
  import {inventoryLibrary } from "$lib/data/stores.js";
  import "../app.css";
  import Nav from "$lib/components/Nav.svelte";
  
  //Load inventory into store
  export let inventoryList
  inventoryLibrary.update(n => {return inventoryList})


</script>
<div class="bg-gray-100 h-screen flex">
  <div class = "bg-white shadow max-w-screen-xl m-auto ">
    <Nav />
    <slot />
  </div>
</div>
