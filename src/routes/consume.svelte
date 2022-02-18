<script>
  import { consuming_log } from "$lib/data/stores.js";
  import { newRecord, updateRecord } from "$lib/helpers/fetchHelper.svelte";
  import { newLog, updateLog } from "$lib/helpers/logHelpers.svelte"

  import Scanner from "$lib/components/Scanner.svelte";
  import Form from "$lib/components/Form.svelte";
  import Log from "$lib/components/Log.svelte";

  let lastRecord = {
    partId: '',
    description: "",
    image:
      "https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg",
  };
  let lastAirtableId = "";
  let quantity = 1;
  let disabled = false

  async function newScan(record) {
    const {description, airtableId} = record
    const data = await newRecord("Consuming", {
      Description: description,
      Supermarket: [airtableId],
      Quantity: 1,
    });
    consuming_log.set(newLog($consuming_log, description))
    lastRecord = record;
    quantity = 1;
    disabled = false
    return (lastAirtableId = data.recordId);
  }

  async function repeatScan() {
    quantity++;
    const data = await updateRecord("Consuming", lastAirtableId, {
      Quantity: quantity,
    });
    consuming_log.set(updateLog($consuming_log, quantity))
    disabled = false
  return;
  }

  async function manualQuantity(e) {
    quantity = e.detail.quantity
    console.log(lastAirtableId, quantity)
    const data = await updateRecord("Consuming", lastAirtableId, {
      Quantity: quantity,
    });
    consuming_log.set(updateLog($consuming_log, quantity))
    disabled = true
    return;
  }

  function handleMessage(e) {
    const record = e.detail.record;
    if (record.partId === lastRecord.partId) return repeatScan(record)
    else return newScan(record)
  }

</script>

<Scanner on:message={handleMessage} />
<div class="flex my-6">
  <Form title={"Consume Item"} item={lastRecord} {quantity} {disabled} on:message={manualQuantity} />
  <Log logs={$consuming_log} />
</div>

