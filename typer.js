const $PlayButton = document.querySelector(".play-button");
const $StopButton = document.querySelector(".stop-button");

let timer = {
  time: 0,
  status: false
}

function minuteCounter() {
  timer.time++;
  timer.status = true;
  console.log(timer.time)
}

const pressPlay = (Event) => {
  Event.preventDefault();
  if (timer.status === false) {
    console.log("Timer started!")
    timer.ticking = setInterval(minuteCounter, 1000)
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
    timer.time = 0;
    console.log("Timer reset!")
  }
}

$PlayButton.addEventListener("click", pressPlay)
$StopButton.addEventListener("click", pressPause)
