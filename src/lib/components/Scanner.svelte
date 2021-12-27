<script>
  import { onMount } from "svelte";
  import { inventoryLibrary, currentItem } from "$lib/data/stores.js";

  function handleScan(string) {
    const inventoryLookup = $inventoryLibrary.find((x) => x.partID === string);
    
    //Check if record is recognised
    if (inventoryLookup === undefined) {
      alert(`${string} was not found`);
      return;
    }
    
    //Check if record is the same as previous
    // if ($currentItem.partID === string) {
    //   console.log('Scanner - Update Quantity')
    //   currentItem.update(item => {
    //     item.quantity = item.quantity + 1
    //     return item
    //   })
    // }
    
    // Otherwise update current item with new item
    // else {
      console.log('Scanner - Update Item')
      currentItem.update(item => {
        item = inventoryLookup
        return item
      });
    // }
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
          handleScan(finalString);
        }
      }
      then = now;
    });
  });
</script>
