"use strict";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class Workout {
  date = new Date()
  id = Date.now().toString().slice(-10)
  constructor(coords, distanse, duration) {
    this.coords = coords
    this.distanse = distanse
    this.duration = duration
  }
}

class Running extends Workout {
  constructor(coords, distanse, duration, cadence) {
    super(coords, distanse, duration)
    this.cadence = cadence
    this.calcPace()
  }
  calcPace() {
    this.pace = this.duration / this.distanse
    return this.pace
  }
}

class Cycling extends Workout {
  constructor(coords, distanse, duration, elevation) {
    super(coords, distanse, duration)
    this.elevation = elevation
    this.calcSpeed()
  }
  calcSpeed() {
    this.speed = this.distanse / (this.duration / 60)
    return this.speed
  }
}

class App {
  _map
  _mapEvent
  _workouts = []
  constructor() {
    this._getPosition()
    form.addEventListener("submit", this._newWorkout.bind(this))
    inputType.addEventListener("change", this._toggleField.bind(this))
  }
  _getPosition() {
    if(navigator.geolocation)
  navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),
    function() {
      alert("Вы не предоставили доступ к своей локации")
    })
  }
  _loadMap(position) {

      const {latitude} = position.coords
      const {longitude}  = position.coords
      const coords = [latitude, longitude]
      this._map = L.map('map').setView(coords, 13);

      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this._map);

      this._map.on('click', this._showForm.bind(this))
  }
  _showForm(mapE) {
      this._mapEvent = mapE
      form.classList.remove("hidden");
      inputDistance.focus();
  }
  _toggleField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
  }
  _newWorkout(e) {
    e.preventDefault();
    const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp))
    const allPositive = (...inputs) => inputs.every(inp => inp > 0)

    // данные из формы
    const type = inputType.value
    const distance = +inputDistance.value
    const duration = +inputDuration.value

    const {lat, lng} = this._mapEvent.latlng
    let workout

    if(type == "running") {
      const cadence = +inputCadence.value
      if(!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence)) {
        return alert("Необходимо ввести целое положительное число")
      }
      workout = new Running([lat, lng], distance, duration, cadence)
      this._workouts.push(workout)
    }

    if(type == "cycling") {
      const elevation = +inputElevation.value
      if(!validInputs(distance, duration, elevation) || !allPositive(distance, duration)) {
        return alert("Необходимо ввести целое положительное число")
      }
      workout = new Cycling([lat, lng], distance, duration, elevation)
      this._workouts.push(workout)
    }

    // очистка полей ввода
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''

    // рендер маркера тренировки на карте
    this.renderWorkMarker(workout)
    
  }
  renderWorkMarker(workout) {
    L.marker(workout.coords).addTo(this._map)
    .bindPopup(L.popup({
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: 'mark-popup'
    }))
    .setPopupContent(String(workout.distanse))
    .openPopup();
  }
}

const app = new App();
