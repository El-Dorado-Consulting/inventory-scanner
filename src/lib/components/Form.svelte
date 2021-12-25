<script>
  import {currentItem} from "$lib/data/stores.js";
  const updateQuantity = () => {
  }

</script>

  <section class="flex-1 px-4">
    <div class="mx-4">
      <h4 class="text-2xl font-bold mb-8">Scan</h4>
        <div class="mb-4">
          <label class="block mb-2" for="description"> Description </label>
          <input
            class="shadow appearance-none border rounded w-full p-3 focus:outline-none focus:shadow-outline text-center text-lg font-bold"
            id="description"
            type="text"
            value={$currentItem.description}
            disabled
          />
        </div>
        <form on:submit|preventDefault={updateQuantity} class="mb-6">
          <label class="mb-2" for="quantity"> Quantity </label>
          <input
            class="shadow appearance-none border rounded w-full text-center p-3 mb-3 leading-tight focus:outline-none focus:shadow-outline text-xl font-bold"
            id="quanity"
            type="text"
            disabled
            bind:value={$currentItem.quantity} 
          />
        </form>
        <div class="h-56 w-56 mx-auto flex my-8">
          <img class="m-auto align-middle" src={$currentItem.image} alt="" />
        </div>
    </div>
  </section>
