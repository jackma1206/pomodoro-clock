const workUp = document.querySelector("#work-up");
const workDown = document.querySelector("#work-down");
const restUp = document.querySelector("#rest-up");
const restDown = document.querySelector("#rest-down");

const workTime = document.querySelector("#workTime");
const restTime = document.querySelector("#restTime");
const countdownTime = document.querySelector("#countdownTimer");

const playButton = document.querySelector("#play");
const pauseButton = document.querySelector("#pause");
const resetButton = document.querySelector(".fa-redo-alt");

const circleAnim = document.querySelector(".circle_animation");

const workHead = document.querySelector(".workControls h2");
const restHead = document.querySelector(".restControls h2");

const audio = new Audio("./assets/Jump.mp3");

function adjWorkTime() {
  if (on) return;

  if (this.classList.contains("fa-chevron-up")) {
    workTimeCount++;
  } else {
    if (workTimeCount <= 1) {
      return;
    }
    workTimeCount--;
  }
  workTime.innerHTML = workTimeCount;
  countdownTime.innerHTML = `${workTimeCount}:00`;
}

function adjRestTime() {
  if (on) return;

  if (this.classList.contains("fa-chevron-up")) {
    restTimeCount++;
  } else {
    if (restTimeCount <= 1) {
      return;
    }
    restTimeCount--;
  }
  restTime.innerHTML = restTimeCount;
}

function msConverter(ms) {
  let minutes = Math.floor(ms / 60000);
  let seconds = ((ms % 60000) / 1000).toFixed(0);
  return seconds == 60
    ? minutes + 1 + ":00"
    : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function reset() {
  if (!on) {
    return;
  }
  on = false;
  clearInterval(workId);
  clearInterval(restId);
  clearTimeout(restTimeOut);
  circleAnim.style.strokeDashoffset = initialOffset;
  countdownTime.innerHTML = `${workTimeCount}:00`;
  pauseButton.classList.remove("fa-play");
  pauseButton.classList.add("fa-pause");
  playButton.classList.add("fa-play");
  playButton.classList.remove("fa-hourglass-start");
  playButton.classList.remove("playAnim");
  workHead.classList.remove("active");
  restHead.classList.remove("active");
  isPaused = false;
  workTimeNow = 1;
  restTimeNow = 1;
}

function pauseTime() {
  if (!on) {
    return;
  }
  if (isPaused) {
    isPaused = false;
    pauseButton.classList.remove("fa-play");
    pauseButton.classList.add("fa-pause");
    playButton.classList.add("playAnim");
  } else {
    isPaused = true;
    pauseButton.classList.remove("fa-pause");
    pauseButton.classList.add("fa-play");
    playButton.classList.remove("playAnim");
  }
}

let initialOffset = "440";
let workTimeNow = 1;
let restTimeNow = 1;
let isPaused = false;
let isWork = true;
let restTimeOut;
let workId;
let restId;
let workTimeCount = 25;
let restTimeCount = 5;
let on = false;

function workInterval(e) {
  if (on) {
    return;
  }
  circleAnim.style.stroke = "#2D332F";
  playButton.classList.remove("fa-play");
  playButton.classList.add("fa-hourglass-start");

  if (isWork) {
    workHead.classList.add("active");
    let time = workTimeCount * 60000 + 1;

    circleAnim.style.strokeDashoffset =
      initialOffset - 1 * (initialOffset / time);
    restTimeOut = setTimeout(restInterval, time + 2000);
    workId = setInterval(function() {
      on = true;
      let i = time - workTimeNow;
      convertedTime = msConverter(i);
      countdownTime.innerHTML = convertedTime;
      if (workTimeNow > time) {
        clearInterval(workId);
        circleAnim.style.strokeDashoffset = initialOffset;
        isWork = false;
        countdownTime.innerHTML = `${restTimeCount}:00`;
        workTimeNow = 1;
        workHead.classList.remove("active");
        audio.play();
        return;
      }
      if (!isPaused) {
        circleAnim.style.strokeDashoffset =
          initialOffset - (workTimeNow + 1) * (initialOffset / time);
        playButton.classList.add("playAnim");
        workTimeNow += 1000;
      }
    }, 1000);
  }
}

function restInterval() {
  if (!isWork) {
    clearTimeout(restTimeOut);
    circleAnim.style.stroke = "#294761";
    let time = restTimeCount * 60000 + 1;
    circleAnim.style.strokeDashoffset =
      initialOffset - 1 * (initialOffset / time);
    restId = setInterval(function() {
      restHead.classList.add("active");
      on = true;
      let i = time - restTimeNow;
      let convertedTime = msConverter(i);
      countdownTime.innerHTML = convertedTime;
      if (restTimeNow > time) {
        restHead.classList.remove("active");
        audio.play();
        reset();
        return;
      }
      if (!isPaused) {
        circleAnim.style.strokeDashoffset =
          initialOffset - (restTimeNow + 1) * (initialOffset / time);
        restTimeNow += 1000;
      }
    }, 1000);
  }
}
playButton.addEventListener("click", workInterval);
pauseButton.addEventListener("click", pauseTime);
resetButton.addEventListener("click", reset);
workUp.addEventListener("click", adjWorkTime);
workDown.addEventListener("click", adjWorkTime);
restUp.addEventListener("click", adjRestTime);
restDown.addEventListener("click", adjRestTime);
