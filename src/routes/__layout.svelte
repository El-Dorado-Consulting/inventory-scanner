<script>
  import "../app.css";
  import Nav from "$lib/components/Nav.svelte";
</script>

<div class="bg-gray-100 h-screen flex">
  <div class = "bg-white shadow w-8/12 m-auto">
    <Nav />
    <slot />
  </div>
</div>
