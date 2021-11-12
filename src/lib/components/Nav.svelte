<script>
  import Clock from "$lib/components/Clock.svelte";
  import { assets } from "$app/paths";
  let defaultLogo = assets + "ed-logo.png";
  let logo = assets + "unagi-logo.png";
  let city = "Oakland";
</script>

<header class="grid grid-cols-3 gap-0 h-20 w-full py-4 items-center font-mono text-2xl">
  <div class=" flex h-12">
    <div class=" h-full flex items-center">
      <img class=" max-h-11 px-4 object-bottom" src={logo} alt="" />
    </div>
    <h2 class="mt-auto">Inventory Scanner</h2>
  </div>
  <h2 class="text-center mt-auto"><Clock /></h2>
  <h2 class="text-right pr-20 mt-auto">{city}</h2>
</header>
<nav class="bg-gray-400 mt-1">
  <ul class="flex text-xl">
    <li><button class="p-3 px-20 hover:bg-yellow-400">Look up</button></li>
    <li><button class="p-3 px-20 hover:bg-yellow-400 bg-yellow-400" >Consume</button></li>
    <li><button class="p-3 px-20 hover:bg-yellow-400">Receive</button></li>
    <li><button class="p-3 px-20 hover:bg-yellow-400">Count</button></li>
  </ul>
</nav>
