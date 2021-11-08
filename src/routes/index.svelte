<script context="module">

  export async function load ({fetch}) {
    const res = await fetch("/api/getInventory")
    const data = await res.json()
    return {
      props:{
        data
      }
    }
  }
</script>


<script>
  //import Scanner from '$lib/components/Scanner.svelte'
  import ScanOut from "$lib/components/Scan-out.svelte"
  import InputForm from "$lib/components/InputForm.svelte"

  export let data

</script>

<ScanOut />
<InputForm {data}/>
<p></p>
 