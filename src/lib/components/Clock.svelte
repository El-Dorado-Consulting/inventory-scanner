<script>
import moment from 'moment'



$: time = moment().format('H:mm:ss')

function startTimer() {
  setInterval(() => {
      time = moment().format('H:mm:ss')
  }, 1000)
}

startTimer()

</script>

<p>{time}</p>

