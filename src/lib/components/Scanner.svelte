<script>
  import { onMount } from "svelte";
  import { scanEvent, inventoryLibrary } from "$lib/data/stores.js";
  
  function handleScan(newString, previousString) {
    const notFound =  $inventoryLibrary.find((il) => il.partID === newString).length < 1
    console.log(notFound)
    let type = 'new'
    if (notFound === true) type ='notFound'
    if (newString === previousString) type = 'repeat'
    scanEvent.set({
      string: newString, 
      previousString:previousString,
      type,
      timestamp:Date.now()})
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
          let finalString = barcodeArray.join("");
          barcodeArray = [];
          buffer = [];
          handleScan(finalString, $scanEvent.string);
        }
      }
      then = now;
    });
  });
</script>
