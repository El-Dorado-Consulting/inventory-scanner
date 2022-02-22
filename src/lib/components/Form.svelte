<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
 
  export let disabled = false
  export let title = 'Scan'
  export let count = ''
  export let quantity
  export let item = {
  }

function updateQuantity() {
  dispatch('message', {quantity});
  quantity = null
}

</script>

  <section class="flex-1 px-4">
    <div class="mx-4">
      <div class="flex justify-between">
        <h4 class="text-2xl font-bold mb-8">{title}</h4>
        <h4 class="text-2xl mb-8">{count}</h4>
      </div>
        <div class="mb-4">
          <label class="block mb-2" for="description"> Name </label>
          <input
            class="shadow appearance-none border rounded w-full p-3 focus:outline-none focus:shadow-outline text-center text-lg font-bold"
            id="description"
            type="text"
            value={item.description}
            disabled
          />
        </div>
        <form class="mb-6" on:submit|preventDefault={updateQuantity}>
          <label class="mb-2" for="quantity"> Quantity </label>
          <input
            class="shadow appearance-none border rounded w-full text-center p-3 mb-3 leading-tight focus:outline-none focus:shadow-outline text-xl font-bold"
            id="quantity"
            type="number"
            bind:value={quantity} 
            {disabled}
          />
        </form>
        <div class="h-56 w-56 mx-auto flex my-8">
          <img class="m-auto align-middle" src={item.image} alt="" />
        </div>
    </div>
  </section>
