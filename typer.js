const $PlayButton = document.querySelector(".play-button");
const $StopButton = document.querySelector(".stop-button");
const $Timer = document.querySelector(".timer");
const $Typespace = document.querySelector(".typespace")
const $Stats = document.querySelector("#stats");
const $TimeStat = document.querySelector("#time-stat");
const $CorrectStat = document.querySelector("#correct-stat");
const $IncorrectStat = document.querySelector("#incorrect-stat");

let timer = {
  seconds: 0,
  minutes: 0,
  status: false,
  index: 0,
  letters: $Typespace.children,
  totalstrokes: 0,
  incorrectstrokes: 0,
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

const setText = () => {
  console.log("Timer started!")
  fetch("https://uselessfacts.jsph.pl/random.json?language=en", {
    method: "Get"
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.text);
      const tempString = data.text.trim();
      const tildaRemove = tempString.replaceAll("`", "'");
      const doubleSpaceRemove = tildaRemove.replaceAll("  ", " ");
      timer.message = doubleSpaceRemove;
      for (let i = 0; i < timer.message.length; i++) {
        $Typespace.appendChild(spanMaker(timer.message[i]))
      }
      timer.letters[timer.index].className = "current";
    });
  timer.ticking = setInterval(timeCounter, 1000)
}

const pressPlay = (Event) => {
  Event.preventDefault();
  console.log(timer.status);
  if (timer.status === false && $PlayButton.textContent === "Play") {
    setText();
  }
  else if (timer.status === false && $PlayButton.textContent === "Again?") {
    cleanoutTimerObj();
    $Stats.classList.toggle("hidden", true);
    timer.status = true;
    setText();
  }
  else if (timer.status === false && $PlayButton.textContent === "Resume?") {
    console.log("Timer resumed!")
    $PlayButton.textContent = "Play";
    $StopButton.textContent = "Pause";
    timer.ticking = setInterval(timeCounter, 1000)
    timer.status = true;
  }
}

const pressPause = (Event) => {
  Event.preventDefault();
  console.log(timer.status);
  if (timer.status === true && $StopButton.textContent === "Pause") {
    timer.status = false;
    clearInterval(timer.ticking);
    console.log("Timer paused!")
    $PlayButton.textContent = "Resume?";
    $StopButton.textContent = "Reset?";
  }
  else if (timer.status === false && $StopButton.textContent === "Reset?") {
    cleanoutTimerObj();
    $PlayButton.textContent = "Play";
    $StopButton.textContent = "Pause";
    console.log("Timer reset!")
  }
}

const cleanoutTimerObj = () => {
  removeAllChildren($Typespace);
  clearInterval(timer.ticking);
  removeAllChildren($Typespace);
  timer = {
    seconds: 0,
    minutes: 0,
    status: false,
    index: 0,
    letters: $Typespace.children,
    totalstrokes: 0,
    incorrectstrokes: 0
  }
  $TimeStat.textContent = "Time:"
  $CorrectStat.textContent = "Correct Percentage:";
  $IncorrectStat.textContent = "Incorrect Strokes:";
}

$PlayButton.addEventListener("click", pressPlay)
$StopButton.addEventListener("click", pressPause)

const typingFinished = () => {
  console.log("Done!");
  timer.status = false;
  clearInterval(timer.ticking);
  console.log(timer);
  $PlayButton.textContent = "Again?";
  $Stats.classList.toggle("hidden", false);
  $TimeStat.textContent = $TimeStat.textContent + "\t" + timer.minutes.toString() + " minutes " + (timer.seconds.toString().length < 2 ? "0" + timer.seconds.toString() : timer.seconds.toString()) + " seconds"
  const correctPercentage = ((timer.message.length - timer.incorrectstrokes) / timer.message.length) * 100;
  $CorrectStat.textContent += "\t" + correctPercentage.toString()[0] + correctPercentage.toString()[1] + (correctPercentage.toString()[2] === "0" ? "0" : "" )+ "%";
  $IncorrectStat.textContent += "\t" + timer.incorrectstrokes.toString() + " mistypes"
}

const removeAllChildren = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

const typingListener = Event => {
  Event.preventDefault();
  if (timer.status) {
    const keyChar = Event.key;
    if (keyChar === timer.message[timer.index]) {
      timer.totalstrokes++;
      timer.letters[timer.index].className = "correctly-typed";
      timer.index++;
      if (timer.index < timer.message.length) {
        timer.letters[timer.index].className = "current"
      } else {
        typingFinished();
      }
    } else if (keyChar !== timer.message[timer.index] && Event.shiftKey !== true) {
      timer.totalstrokes++;
      timer.incorrectstrokes++;
      timer.letters[timer.index].className = "incorrectly-typed current";
    }
  }
}

window.addEventListener("keydown", typingListener)
