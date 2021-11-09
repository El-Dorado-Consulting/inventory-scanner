<script>
    import { onMount } from "svelte";
    import { scanValue, lastItem, inventoryLibrary} from "$lib/data/stores.js"

    $: scannerInput = "";

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
                    $scanValue = finalString
                    console.log(finalString)
                    checkID(finalString)
                    barcodeArray = [];
                    buffer = [];
                }
            }
            then = now;
        });
    });

function checkID (scan) {
    console.log('check id called')
  let item = $inventoryLibrary.filter(x => {
    if (scan === x.partID) {
      $lastItem = x
      return x
    }
  })
  // item no found
  if (item.length < 1) {
    alert(`${scan} was not found in the database`)
    return
  } else {
    consumePart(item[0])
  }
}



</script>

