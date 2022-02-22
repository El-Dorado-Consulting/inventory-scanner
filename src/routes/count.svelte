<script>
  import { inventoryLibrary, counting_log } from "$lib/data/stores.js";
  import { newRecord, updateRecord } from "$lib/helpers/fetchHelper.svelte";
  import { newLog } from "$lib/helpers/logHelpers.svelte";

  import Form from "$lib/components/Form.svelte";
  import Log from "$lib/components/Log.svelte";
  import moment from "moment";

  let i = 0;

  $: count = `${i + 1} of ${orderedList.length}`;

  function isPastDue(category, lastCounted) {
    let days = 0
    if (category === 'A') {days = 7}
    if (category === 'B') {days = 30}
    if (category === 'C') {days = 30}
    let diff = moment().diff(moment(lastCounted), "days");
    return diff > days 
  }

  let currentList = $inventoryLibrary.filter((item) => {
    const {category, lastCounted} = item
    if (isPastDue(category, lastCounted)) return item;
  });

  let orderedList = currentList.sort((a, b) => a.category.localeCompare(b.category))
  
  async function getQoh(id) {
    const res = await fetch(`/api/getQOH?id=${id}`);
    const qoh = await res.json();
    return qoh;
  }

  async function updateDate() {
    const { airtableId } = orderedList[i];
    await updateRecord("Supermarket", airtableId, { "Last Counted": moment() });
    return;
  }

  async function newAdjustment(quantity) {
    const { description, airtableId } = orderedList[i];
    await newRecord("Counting", {
      Description: description,
      Supermarket: [airtableId],
      Quantity: quantity,
    });
  }

  async function handleSubmit(e) {
    const { airtableId, description } = orderedList[i];
    const qoh = await getQoh(airtableId);
    const count = e.detail.quantity;
    const adjustment = count - qoh;
    console.log(adjustment, count, qoh);
    const record = await newAdjustment(adjustment);
    const nextRecord = await updateDate();
    counting_log.set(newLog($counting_log, description, count));
    i++;
  }
</script>

<div class="flex my-6">
  {#if i < orderedList.length}
    <Form
      item={orderedList[i]}
      title="Cycle Count"
      {count}
      on:message={handleSubmit}
    />
  {/if}
  {#if i === orderedList.length}
    <div class="flex-1">Cycle count complete!</div>
  {/if}
  <Log logs={$counting_log} />
</div>
