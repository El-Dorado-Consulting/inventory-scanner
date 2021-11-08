<script>

  export let data
  $: partId = ''

function checkID () {
  let item = data.filter(x => {
    if (partId === x.partID) {
      return x
    }
  })
  // item no found
  if (item.length < 1) {
    alert(`${partId} was not found in the database`)
    return
  } else {
    consumePart(item[0])
  }
}

 async function consumePart (item) {
   let {airtableID, description} = item
   console.log(airtableID, description)
   const submit = await fetch ('/api/consumePart', {
     method: 'POST',
     body: JSON.stringify({airtableID, description})
   })

  console.log('SUBMIT', submit)
 }
</script>



<form on:submit|preventDefault={checkID}>
  <label>ID</label>
  <input type="text" name='id' bind:value={partId}/>
  <input type="submit">

</form>

