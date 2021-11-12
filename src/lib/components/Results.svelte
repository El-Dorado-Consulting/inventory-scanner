<script>
  export let itemData = {}
$: quantity = 1;
let imgURL = assets + "no-image.png";
</script>

<h4 class="text-2xl">Scan Out</h4>
<table>
  <tr>
    <td class="py-4">Description:</td>
    <td id="scan-description">{itemData.description}</td>
  </tr>
  <td class="col-short">Quantity:</td>
  <td>
    <form on:submit|preventDefault={updateQuantity}>
      <input
        class="shadow p-2 text-center"
        type="text"
        bind:value={quantity}
      />
    </form>
  </td>
</table>
<br />
<div class="h-56 flex ">
  <img class="m-auto align-middle" src={itemData.image} alt="" />
</div>


