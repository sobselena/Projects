'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
class Workout {
  constructor(id, distance, duration, coords, type, date) {
    this.id = id;
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
    this.type = type;
    this.date = date;
  }
}
class Running extends Workout {
  constructor(id, distance, duration, coords, type, date, cadence) {
    super(id, distance, duration, coords, type, date);
    this.cadence = cadence;
  }
}

class Cycling extends Workout {
  constructor(id, distance, duration, coords, type, date, elevationGain) {
    super(id, distance, duration, coords, type, date);
    this.elevationGain = elevationGain;
  }
}

class App {
  constructor() {
    this.workouts = [];
    this.map;
    this.mapEvent;
    this._getPosition();
    this._toggleElevationField();
    this._showForm();
    this._moveToMarker();
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude } = position.coords;
          const { longitude } = position.coords;

          const coords = [latitude, longitude];
          this._loadMap(coords);

          this._loadWorkouts();
        },
        function () {
          alert('Bad decision dude');
        }
      );
    }
  }

  _loadMap(position) {
    this.map = L.map('map').setView(position, 10);
    this.map.on('click', mapEvent => {
      this.mapEvent = mapEvent;
      form.classList.remove('hidden');
      inputDistance.focus();
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    console.log(
      `https://www.google.com/maps/@${position[0]},${position[1]},2z?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D`
    );
  }
  _showMarker(workout) {
    const popup = L.popup({
      minWidth: 100,
      maxWidth: 250,
      closeButton: false,
      closeOnClick: false,
      autoClose: false,
      className: workout.type === 'running' ? 'running-popup' : 'cycling-popup',
    });

    popup;
    L.marker(workout.coords)
      .addTo(this.map)
      .bindPopup(popup)
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️Running' : '🚴‍♀️Cycling'} on ${
          months[workout.date.getMonth()]
        } ${workout.date.getDate()}`
      )
      .openPopup();
  }

  _showForm() {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const { lat, lng } = this.mapEvent.latlng;
      if (
        inputDistance.value === '' ||
        inputDuration.value === '' ||
        (inputType.value === 'running' && inputCadence.value === '') ||
        (inputType.value === 'cycling' && inputElevation.value === '')
      )
        return;

      this._newWorkout();
      this._showWorkout(this.workouts.at(-1));
      this._showMarker(this.workouts.at(-1));
      console.log(this.workouts);
      inputDistance.value =
        inputDuration.value =
        inputCadence.value =
        inputElevation.value =
          '';
      form.classList.add('hidden');
    });
  }

  _toggleElevationField() {
    inputType.addEventListener('change', function () {
      inputElevation
        .closest('.form__row')
        .classList.toggle('form__row--hidden');
      inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
      if (inputType.value === 'running') {
        inputCadence.value = inputElevation.value;
      } else if (inputType.value === 'cycling') {
        inputElevation.value = inputCadence.value;
      }
    });
  }

  _newWorkout() {
    const { lat, lng } = this.mapEvent.latlng;
    const date = new Date();
    const values = [
      this.workouts.length + 1,
      inputDistance.value,
      inputDuration.value,
      [lat, lng],
      inputType.value,
      date,
    ];
    let workout;
    if (inputType.value === 'running') {
      workout = new Running(...values, inputCadence.value);
    } else if (inputType.value === 'cycling') {
      workout = new Cycling(...values, inputElevation.value);
    }
    console.log(workout);

    this.workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(this.workouts));
  }

  _showWorkout(workout) {
    const li = document.createElement('li');
    console.log(workout);
    const isRunning = workout.type === 'running';
    const date = new Date(workout.date);
    li.classList.add(
      'workout',
      isRunning ? 'workout--running' : 'workout--cycling'
    );
    li.dataset.id = workout.id;
    li.innerHTML = `<h2 class="workout__title">${
      isRunning ? 'Running' : 'Cycling'
    } on ${months[date.getMonth()]} ${date.getDate()}</h2>
  <div class="workout__details">
    <span class="workout__icon">${isRunning ? '🏃' : '🚴‍♀️'}</span>
    <span class="workout__value">${workout.distance}</span>
    <span class="workout__unit">km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⏱</span>
    <span class="workout__value">${workout.duration}</span>
    <span class="workout__unit">min</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${
      Math.trunc((workout.duration / workout.distance) * 100) / 100
    }</span>
    <span class="workout__unit">min/km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">${isRunning ? '🦶🏼' : '⛰'}</span>
    <span class="workout__value">${
      isRunning ? workout.cadence : workout.elevationGain
    }</span>
    <span class="workout__unit">spm</span>
  </div>`;

    containerWorkouts.insertAdjacentElement('beforeend', li);
  }
  _loadWorkouts() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;
    this.workouts = data.map(item => {
      if (item.type === 'running') {
        return new Running(
          item.id,
          item.distance,
          item.duration,
          item.coords,
          item.type,
          new Date(item.date),
          item.cadence
        );
      } else if (item.type === 'cycling') {
        return new Cycling(
          item.id,
          item.distance,
          item.duration,
          item.coords,
          item.type,
          new Date(item.date),
          item.elevationGain
        );
      }
    });

    this.workouts.forEach(workout => {
      this._showWorkout(workout);
      this._showMarker(workout);
    });
  }

  _moveToMarker() {
    containerWorkouts.addEventListener('click', e => {
      const card = e.target.closest('.workout');
      if (!card) return;
      const id = Number(card.dataset.id);

      const marker = this.workouts.find(workout => workout.id === id);
      console.log(marker);
      this.map.setView(marker.coords);
    });
  }
}

const app = new App();

// Доделать метод, при котором при нажатии на соответсвующую карточки меняется расположение курсора на карте, соотв координатам места тренировки в этой карточке

// Соответсвенно аналогично при нажатии на саму метку будет меняться расположение курсора на карте
