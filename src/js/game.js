'use strict';

function Game() {
  const dom = {};
  let level;
  let score;
  let timer;
  let levelTime;
  let color;
  let colors = [];
  let target = {};
  let options;

  function init() {
    cacheDom();
    bindEvents();
    reset();
    timer = Timer(dom.timer, levelTime);
    color = Color();
    target = {
      name: color.pick().name,
      color: color.pick().value
    };
    colors = color.pick(options); // @todo must include the target color
    render();
  }

  function cacheDom() {
    dom.game = document.getElementById('game');
    dom.timer = document.getElementById('timer');
    dom.score = document.getElementById('score');
    dom.level = document.getElementById('level');
    dom.start = document.getElementById('start');
  }

  function bindEvents() {
    document.addEventListener('click', _ => console.log(target))
  }

  function render() {
    let div = document.createElement('div');
    div.textContent = target.name;
    div.classList.add('target');
    div.style.color = target.color;
    dom.game.appendChild(div);
    let ul = document.createElement('ul');
    ul.classList.add('options');
    for (let i = 0; i < colors.length; i++) {
      let li = document.createElement('li');
      li.textContent = colors[i].name;
      ul.appendChild(li);
    }
    dom.game.appendChild(ul);
  }

  function reset() {
    level = 1;
    score = 0;
    options = 4;
    levelTime = 3000;
  }

  function nextLevel() {
    level += 1;
    timer.increment(1000);
  }

  return {
    init
  }
}

function Timer(elem, time) {
  let id = 0;
  let total = time;
  let remaining = time;
  let interval = 100;

  function incrementTime(by) {
    remaining += by;
  }

  function start() {
    return new Promise((resolve, reject) => {
      elem.style.transitionDuration = interval + 'ms';

      id = setInterval(function() {
        incrementTime(-interval);
        setTimerWidth();

        if (isDone()) {
          reset();
          return resolve();
        }
      }, interval);
    });
  }

  function stop() {
    clearInterval(id);
  }

  function reset() {
    stop();
    remaining = time;
    setTimerWidth();
  }

  function wait(time) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, time);
    });
  }

  function setTimerWidth() {
    if (!elem) {
      return false;
    }
    elem.style.width = (remaining / total) * 50 + '%';
  }

  function isDone() {
    return remaining <= 0;
  }

  return {
    start: start,
    stop: stop,
    reset: reset,
    wait: wait,
    increment: incrementTime
  }
}

function Color() {

  let colors = [
    {name: 'Red', value: '#ff4436'},
    {name: 'Purple', value: '#9c27b0'},
    {name: 'Blue', value: '#2196f3'},
    {name: 'Green', value: '#4caf50'},
    {name: 'Orange', value: '#ff9800'},
    {name: 'Brown', value: '#795548'},
    {name: 'Grey', value: '#9e9e9e'}
  ];

  function pick(num) {
    colors = shuffle(colors);
    if (num === undefined || num === 1) {
      return colors[0];
    }
    if (num < 1 || num > colors.length) {
      return undefined;
    }
    return colors.slice(0, num);
  }

  function shuffle(array) {
    let i = array.length;
    let temp;
    let random;

    while (i !== 0) {
      random = Math.floor(Math.random() * i);
      i -= 1;
      temp = array[i];
      array[i] = array[random];
      array[random] = temp;
    }
    return array;
  }

  return {
    pick: pick
  }
}

document.addEventListener('DOMContentLoaded', function(e) {
  const game = Game();
  game.init();
});
