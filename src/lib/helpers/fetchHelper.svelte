<script context="module">
  export async function newRecord (table, fields) {
    const res = await fetch("/api/newRecord", {
      method: "post",
      body: JSON.stringify({table, fields})
    })
    const data = await res.json();
    return data
  }
  
  export async function updateRecord (table, id, fields) {
    const record = await fetch("api/updateRecord", {
      method: "post",
      body: JSON.stringify({table, id, fields}),
    })
  }
  </script>
