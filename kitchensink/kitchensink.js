const slider = document.querySelector('.slider');
const sliderValue = document.querySelector('#slider-value');

slider.addEventListener('input', function () {
    var val = ((this.value - this.min) / (this.max - this.min)) * 100; // Calculate percentage)
    console.log(val); // Log the value to the console
    const percentage = Math.round(100 - (val / this.max) * 100); // Reverse the percentage calculation
    console.log("percentage: ", percentage);
    slider.style.setProperty('--slider-value', `${percentage}%`);
    sliderValue.textContent = percentage; // updates the displayed value for slider
    // Update the track's background
    this.style.background = `linear-gradient(to top, rgba(7, 235, 123, 1) ${percentage}%, rgba(38, 42, 45, 1) ${percentage}%)`; // Update background
});