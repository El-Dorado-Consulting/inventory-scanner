<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { inventoryLibrary } from "$lib/data/stores.js";

  const dispatch = createEventDispatcher();

  function handleScan(scanString) {
    const record = $inventoryLibrary.find((il) => il.partId === scanString)
    if (!record) return alert("This scan was not recognized");
    return dispatch("message", {record});
  }

  onMount(() => {
    console.log("Scanner started");
    let now = "",
      then = "";
    let barcodeArray = [];
    let buffer = [];

    function filterChar(char) {
      if (char != "Shift" && char != "Backspace") return char;
    }
    document.addEventListener("keydown", function (e) {
      let thisChar = filterChar(e.key);
      buffer.push(thisChar);

      //Characters entered within 25ms are from barcode scanner
      now = new Date().getTime();
      if (now - then <= 25) {
        if (barcodeArray.length < 1) {
          barcodeArray.push(buffer[buffer.length - 2]);
        }
        barcodeArray.push(thisChar);
        if (thisChar == "Enter") {
          barcodeArray.pop(); //get rid of "enter"
          let completeString = barcodeArray.join("");
          barcodeArray = [];
          buffer = [];
          handleScan(completeString);
        }
      }
      then = now;
    });
  });
</script>
