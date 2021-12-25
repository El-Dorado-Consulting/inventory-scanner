<script>
  import { assets } from "$app/paths";
  import { goto } from "$app/navigation";
  import config from "../../scannerConfig.json";
  import Clock from "$lib/components/Clock.svelte";

  const { city, logo } = config;
</script>

<header
  class="grid grid-cols-3 gap-0 h-20 w-full py-4 items-center font-mono text-2xl"
>
  <div class=" flex h-12">
    <div class=" h-full flex items-center">
      <img class=" max-h-11 px-4 object-bottom" src={assets + logo} alt="" />
    </div>
    <h2 class="mt-auto">Inventory Scanner</h2>
  </div>
  <h2 class="text-center mt-auto"><Clock /></h2>
  <h2 class="text-right pr-20 mt-auto capitalize">{city}</h2>
</header>
<nav class="bg-gray-400 mt-1 flex text-xl">
  <a href="lookup" class="p-3 px-20 hover:bg-yellow-400">Lookup</a>
  <a href="consume" class="p-3 px-20 hover:bg-yellow-400">Consume</a>
  <a href="receive" class="p-3 px-20 hover:bg-yellow-400">Receive</a>
  <a href="count" class="p-3 px-20 hover:bg-yellow-400">Count</a>
</nav>
