<script>
  import Clock from '$lib/components/Clock.svelte'
  import {assets} from '$app/paths'
  let logo = assets + 'ed-logo.png'
  let city = 'Oakland'
</script>



<header class="flex h-24 w-full py-4 items-center">
  <div class= "flex-1 flex items-center">
    <div class= " max-h-full">
      <img class= "max-h-16 px-8" src={logo} alt="">
    </div>
    <h2 class="text-2xl">Inventory Scanner</h2>
  </div>
  <h2 class="flex-1 text-center text-3xl"><Clock/></h2>
  <h2 class="flex-1 text-right text-3xl pr-20">{city}</h2>
</header>
<nav>
    <ul class="nav">
        <li><button id="but-lookup">Look up</button></li>
        <!-- <li><button id="but-checkin">Scan in</button></li> -->
        <li><button id="but-checkout">Scan out</button></li>
        <!-- <li><button id="but-cycle-count">Cycle count</button></li> -->
        <form></form>
    </ul>
</nav>