<script context="module">
  import moment from "moment";
  import { consuming_log, receiving_log, counting_log } from "$lib/data/stores";

  export function newLog(array, description, quantity = 1) {
      array.unshift({
        time: moment().format("H:mm:ss"),
        description,
        quantity,
      });
      console.log(array)
      return array;
  }

  export function updateLog(array, quantity) {
      let description = array[0].description
      array.shift()
      array.unshift({
        time: moment().format("H:mm:ss"),
        description,
        quantity,
      });
      return array;
    };
  

  export function clearLog(path) {
    if (path === "/consume") consuming_log.set([]);
    if (path === "/receive") receiving_log.set([]);
    if (path === "/count") counting_log.set([]);
  }
</script>
