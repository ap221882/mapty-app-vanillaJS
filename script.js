'use strict';

// let map, mapEvent;

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
    this._setDescription();
    // console.log(this.type);
  }
  _setDescription() {
    // prettier-ignore
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.description = `${this.type} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    //min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    //min/km
    this.speed = this.distance / (this.duration / 60);
    return this.pace;
  }
}
const run1 = new Running([39, -12], 5.2, 24, 178);
const cycling = new Cycling([39, -12], 27, 95, 523);
console.log(run1, cycling);
// ===========================================
// Application architechture
// ===========================================
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField);
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
    }
  }
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }
  _showForm(mapEv) {
    this.#mapEvent = mapEv;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _hideForm() {
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';
    form.getElementsByClassName.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => {
      form.style.display = 'grid';
    }, 1000);
  }
  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _newWorkout(e) {
    // const validInputs = (...inputs) => {
    //   inputs.every(inp => Number.isFinite(inp));
    // };
    // const allPositive = (...inputs) => {
    //   inputs.every(inp => {
    //     inp > 0;
    //   });
    // };
    // e.preventDefault();
    // // 1.get data from form
    // const type = inputType.value;
    // const distance = +inputDistance.value;
    // const duration = +inputDuration.value;
    // const { lat, lng } = this.#mapEvent.latlng;
    // let workout;
    // console.log(type);
    // if (type === 'running') {
    //   const cadence = +inputCadence.value;
    //   // if (
    //   //   !validInputs(distance, duration, cadence) ||
    //   //   !allPositive(distance, duration, cadence)
    //   // ) {
    //   //   console.log(distance, duration, cadence);
    //   //   return alert('Inputs have to be a positive number');
    //   // }
    //   if (
    //     validInputs(distance, duration, cadence) &&
    //     allPositive(distance, duration, cadence)
    //   ) {
    //     workout = new Running([lat, lng], distance, duration, cadence);
    //     this.#workouts.push(workout);
    //     console.log(workout);
    //   } else if (
    //     !validInputs(distance, duration, cadence) ||
    //     !allPositive(distance, duration, cadence)
    //   ) {
    //     alert('Inputs have to be a positive number');
    //   }
    // }
    // if (type === 'cycling') {
    //   const elevation = +inputElevation.value;
    //   // if (
    //   //   !validInputs(distance, duration, elevation) ||
    //   //   !allPositive(distance, duration)
    //   // ) {
    //   //   return alert('Inputs have to be a positive number');
    //   // }
    //   if (
    //     validInputs(distance, duration, elevation) &&
    //     allPositive(distance, duration)
    //   ) {
    //     workout = new Cycling([lat, lng], distance, duration, elevation);
    //   } else {
    //     alert('Inputs have to be a positive number');
    //   }
    // }
    // console.log(workout);
    // this.#workouts.push(workout);
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If workout running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;

      // Check if data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers!');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers!');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array
    this.#workouts.push(workout);
    console.log(workout);
    // clear inputs
    this._hideForm();
    // Display marker
    this._renderWorkoutMarker(workout);
    // Display workout
    this._renderWorkout(workout);
    // console.log(mapEvent);
  }
  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
    console.log(workout.type);
  }
  _renderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id=${
      workout.id
    }>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;
    if (workout.type === 'running') {
      html += `<div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.pace.toFixed(1)}</span>
      <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
      <span class="workout__icon">🦶🏼</span>
      <span class="workout__value">${workout.cadence}</span>
      <span class="workout__unit">spm</span>
      </div></li>
      
      `;
    }
    if (workout.type === 'cycling') {
      html += `<div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li> 
`;
    }
    form.insertAdjacentHTML('afterend', html);
  }
}

const app = new App();
