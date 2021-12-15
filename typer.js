const $PlayButton = document.querySelector(".play-button");
const $StopButton = document.querySelector(".stop-button");
const $Timer = document.querySelector(".timer");
const $Typespace = document.querySelector(".typespace")

let timer = {
  seconds: 0,
  minutes: 0,
  status: false,
  message: ""
}

function timeCounter() {
  let seconds = timer.seconds.toString();
  let minutes = timer.minutes.toString();
  if (seconds.length < 2) {
    seconds = `0${seconds}`
  }
  if (minutes.length < 2) {
    minutes = `0${minutes}`
  }
  $Timer.textContent = minutes + ":" + seconds + " Time Elapsed"
  timer.seconds++;
  if (timer.seconds > 59) {
    timer.minutes++;
    timer.seconds = 0;
  }
  timer.status = true;
}

const spanMaker = (char) => {
  const $NewSpanElement = document.createElement("span");
  $NewSpanElement.textContent = char;
  return $NewSpanElement;
}

const pressPlay = (Event) => {
  Event.preventDefault();
  if (timer.status === false) {
    console.log("Timer started!")
    fetch("https://uselessfacts.jsph.pl/random.json?language=en", {
      method: "Get"
    })
    .then(response => response.json())
    .then(data=> {
      console.log(data.text);
      timer.message = data.text
      for (let i = 0; i < timer.message.length; i++) {
        $Typespace.appendChild(spanMaker(timer.message[i]))
      }
    });
    timer.ticking = setInterval(timeCounter, 1000)
  }
}

const pressPause = (Event) => {
  Event.preventDefault();
  if (timer.status === true) {
    clearInterval(timer.ticking);
    timer.status = false;
    console.log("Timer paused!")
  }
}

const pressReset = (Event) => {
  Event.preventDefault();
  if (timer.status === false) {
    clearInterval(timer.ticking);
    timer.status = false;
    timer.seconds = 0;
    timer.minutes = 0;
    console.log("Timer reset!")
  }
}

$PlayButton.addEventListener("click", pressPlay)
$StopButton.addEventListener("click", pressPause)

const typingListener = (Event) => {
  console.log(Event.key)
}

document.addEventListener("keydown", typingListener)