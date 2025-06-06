const vertSlider = document.querySelector('#vertical-slider');
const vertSliderValue = document.querySelector('#vert-slider-value');

vertSlider.addEventListener('input', function () {
    // Synchronize input number with slider value
    vertSliderValue.value = vertSlider.value; 
    this.style.background = `linear-gradient(to top, rgba(7, 235, 123, 1) ${vertSlider.value}%,
     rgba(38, 42, 45, 1) ${vertSlider.value}%)`;
});


// Update the slider when the number input changes
vertSliderValue.addEventListener('input', function () {
    let value = parseInt(vertSliderValue.value, 10);
      if (value >= 0 && value <= 100) {
        vertSlider.value = value;
        vertSliderValue.value = vertSlider.value;
        vertSlider.style.background = `linear-gradient(to top, rgba(7, 235, 123, 1) ${vertSlider.value}%,
     rgba(38, 42, 45, 1) ${vertSlider.value}%)`;
      }
});

const horiSlider = document.querySelector('#hori-slider');
const horiSliderValue = document.querySelector('#hori-slider-value');

horiSlider.addEventListener('input', function () {
    // Synchronize input number with slider value
    horiSliderValue.value = horiSlider.value; 
    this.style.background = `linear-gradient(to right, rgba(7, 235, 123, 1) ${horiSlider.value}%,
     rgba(38, 42, 45, 1) ${horiSlider.value}%)`;
});

horiSlider.addEventListener('input', function () {
  let value = parseInt(horiSliderValue.value, 10);
    if (value >= 0 && value <= 100) {
      horiSlider.value = value;
      horiSliderValue.value = horiSlider.value;
      horiSlider.style.background = `linear-gradient(to right, rgba(7, 235, 123, 1) ${horiSlider.value}%,
    rgba(38, 42, 45, 1) ${horiSlider.value}%)`;
    }
});