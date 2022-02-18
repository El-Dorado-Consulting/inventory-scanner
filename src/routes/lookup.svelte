<script>
  import Scanner from "$lib/components/Scanner.svelte";
  import Form from "$lib/components/Form.svelte";
  import Log from "$lib/components/Log.svelte";

  const emptyLog = []
  const disabled = true
  let lastRecord = {
    partId: '',
    description: "",
    image:
      "https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg",
  };

  function handleMessage(e) {
    lastRecord = e.detail.record;
  }

</script>

<Scanner on:message={handleMessage} />
<div class="flex my-6">
  <Form item={lastRecord} {disabled} title={"Lookup Item"} />
  <Log logs={emptyLog} />
</div>

