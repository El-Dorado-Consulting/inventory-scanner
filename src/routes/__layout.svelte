<script>
  import "../app.css";
  import Nav from "$lib/components/Nav.svelte";
</script>

<div class="bg-gray-100 h-screen flex">
  <div class = "bg-white shadow max-w-screen-xl m-auto ">
    <Nav />
    <slot />
  </div>
</div>
