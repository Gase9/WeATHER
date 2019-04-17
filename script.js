const form = document.getElementById('form');
const cityInput = document.getElementById('city');
const options = document.querySelector('.options');

let cityName = 'New York';

let date = new Date();
let currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

form.addEventListener('submit', searchCity);
cityInput.addEventListener('click', resetForm);

const warn = document.querySelector('.warn');
const warnMsg = document.querySelector('.warnMsg');

class message {
    static addMsg(msg) {
        warn.classList.add('reveal');
        warnMsg.innerHTML = msg;
        setTimeout(message.removeMsg, 4000);
    }
    static removeMsg() {
        warn.classList.remove('reveal');
    }
}

const celc = document.querySelector('.celc');
const fahr = document.querySelector('.fahr');
let measure = 'celc'

celc.addEventListener('click', changeMeasure);
fahr.addEventListener('click', changeMeasure);

function changeMeasure(e) {
    if(e.target.classList.contains('celc')) {
        if(measure === 'celc') {
            return;
        } else {
            measure = 'celc';
            fetchWeather(cityName)
        }
    } else {
        if(measure === 'fahr') {
            return;
        } else {
            measure = 'fahr';
            fetchWeather(cityName)
        }
    }
}

// let latitude;
// let longitude;

// if ("geolocation" in navigator) {
//     // Do something with coordinates returned
//     function processCoords(position) {
//         latitude = position.coords.latitude;
//         longitude = position.coords.longitude;
//         fetchWeather();
//     }

//     // Fetch Coordinates
//     navigator.geolocation.getCurrentPosition(processCoords);
// }

function searchCity(e) {
    e.preventDefault();
    if(cityInput.value === '') {
        message.addMsg(`Please enter a valid city name.`);
    }

    // OLD VERSION OF FINDING THE CITIES - USING CITIES.JSON GITHUB
    // fetch('node_modules/cities.json/cities.json')
    // .then(res => res.json())
    // .then((data) => {

    //     const filter = data.filter(city => city.name.toLowerCase() === cityInput.value.toLowerCase());

    //     if(filter.length === 0) {
    //         message.addMsg(`Couldn't find '${cityInput.value}'. Please try again.`);
    //         console.log(filter);
    //         resetForm();
    //     } else {
    //         console.log(filter);
    //         cityName = filter[0].name;
    //         fetchWeather(cityName);
    //         // filter.forEach(filtered => {
    //         //     options.innerHTML += `<li>${filtered.name}, ${filtered.country}</li>`
    //         // })
    //         resetForm();
    //     }
    // })  

    fetch(`https://api.apixu.com/v1/search.json?key=a212b25bf67c40dc827123850191204&q=${cityInput.value}`)
    .then(res => res.json())
    .then((data) => {
        const filter = data.filter(city => city.name.toLowerCase().includes(cityInput.value.toLowerCase()));
        
        if(filter.length === 0) {
            message.addMsg(`Couldn't find '${cityInput.value}'. Please try again.`);
            resetForm();
        } else {
            cityName = filter[0].name;
            fetchWeather(cityName);
            resetForm();
        }
    })
    .catch(function(error) {
        console.clear();
        console.log(error);
    });
}

function resetForm() {
    cityInput.value = '';
}

const country = document.getElementById('country');
const town = document.getElementById('town');
const time = document.getElementById('time');
const pic = document.getElementById('pic');
const status = document.getElementById('status');
const temp = document.getElementById('temp');
const feels = document.getElementById('feels');
const hum = document.getElementById('hum');
const wind = document.getElementById('wind');

        
function fetchWeather(cityName) {

    fetch(`https://api.apixu.com/v1/current.json?key=a212b25bf67c40dc827123850191204&q=${cityName}`)
    .then((res) => res.json())
    .then((data) => {
        const current = document.querySelector('.current');
        todayTemp = data.current.temp_c;
        country.innerHTML = data.location.country;
        town.innerHTML = data.location.name;
        pic.src = data.current.condition.icon;
        status.innerHTML = data.current.condition.text;
        if(measure === 'celc') {
            temp.innerHTML = `<span>Temperature:</span> ${data.current.temp_c} C°`;
            feels.innerHTML = `<span>Feels Like:</span> ${data.current.feelslike_c} C°`;
        } else {
            temp.innerHTML = `<span>Temperature:</span> ${data.current.temp_f} F°`;
            feels.innerHTML = `<span>Feels Like:</span> ${data.current.feelslike_f} F°`;
        }
        hum.innerHTML = `<span>Humidity:</span> ${data.current.humidity}%`;
        wind.innerHTML = `<span>Wind Speed:</span> ${data.current.wind_kph} km/h`;

        addBg(data.current.condition.text, current);
    })
    .catch(function(error) {
        console.clear();
        console.log(error);
    });



    fetch(`https://api.apixu.com/v1/forecast.json?key=a212b25bf67c40dc827123850191204&q=${cityName}&days=7`)
    .then((res) => res.json())
    .then((data) => {
        
        time.innerHTML = data.forecast.forecastday[0].date;

        data.forecast.forecastday.forEach((item, index) => {
            if(index === 0 || index === 6) {
                return;
            }

            const forCard = document.getElementById(`${index}`);
            const dayFor = forCard.querySelector('.day');
            const timeFor = forCard.querySelector('.time');
            const picFor = forCard.querySelector('.pic');
            const statusFor = forCard.querySelector('.status');
            const tempFor = forCard.querySelector('.temp');
            const feelsFor = forCard.querySelector('.feels');
            const humFor = forCard.querySelector('.hum');
            const windFor = forCard.querySelector('.wind');
            const set = forCard.querySelector('.set');
            const rise = forCard.querySelector('.rise');
            
            addBg(item.day.condition.text, forCard);

            let myDay = new Date(item.date);

            dayFor.innerHTML = days[myDay.getDay()];
            timeFor.innerHTML = item.date;
            picFor.src = item.day.condition.icon;
            statusFor.innerHTML = item.day.condition.text;
            if(measure === 'celc') {
                tempFor.innerHTML = `<span>Min:</span> ${item.day.mintemp_c} C°`;
                feelsFor.innerHTML = `<span>Max:</span> ${item.day.maxtemp_c} C°`;     
            } else {
                tempFor.innerHTML = `<span>Min:</span> ${item.day.mintemp_f} F°`;
                feelsFor.innerHTML = `<span>Max:</span> ${item.day.maxtemp_f} F°`;  
            }
            humFor.innerHTML = `<span>Average Humidity:</span> ${item.day.avghumidity}%`;
            windFor.innerHTML = `<span>Max Wind Speed:</span> ${item.day.maxwind_kph} km/h`;

            set.innerHTML = item.astro.sunset;
            rise.innerHTML = item.astro.sunrise;
        })
    })
    .catch(function(error) {
        console.clear();
        console.log(error);
    });
}

function addBg(condition, pic) {
    const logoClouds = document.querySelector('#logoClouds');
    if(condition.toLowerCase().includes('sunny') || condition.toLowerCase().includes('clear')) {
        const random = Math.floor(Math.random() * 3) + 1; 
        pic.style.background = `url(imgs/sunny_${random}.jpg)`;
        filter(pic);
        // if(pic.classList.contains('current')) {
        //     logoClouds.src = 'imgs/icons/wi-day-sunny.svg'
        // }
    } else if(condition.toLowerCase().includes('cloud')) {
        const random = Math.floor(Math.random() * 3) + 1; 
        pic.style.background = `url(imgs/cloud_${random}.jpg)`;
        filter(pic);
        // if(pic.classList.contains('current')) {
        //     logoClouds.src = 'imgs/icons/wi-cloudy.svg'
        // }
    } else if(condition.toLowerCase().includes('overcast')) {
        pic.style.background = 'url(imgs/overcast.jpg)';
        filter(pic);
        // if(pic.classList.contains('current')) {
        //     logoClouds.src = 'imgs/icons/wi-day-sunny-overcast.svg'
        // }
    } else if(condition.toLowerCase().includes('mist')) {
        pic.style.background = 'url(imgs/mist.jpg)';
        filter(pic);
        // if(pic.classList.contains('current')) {
        //     logoClouds.src = 'imgs/icons/wi-fog.svg'
        // }
    } else if(condition.toLowerCase().includes('rain')) {
        const random = Math.floor(Math.random() * 4) + 1; 
        pic.style.background = `url(imgs/rain_${random}.jpg)`;
        filter(pic);
        // if(pic.classList.contains('current')) {
        //     logoClouds.src = 'imgs/icons/wi-rain.svg'
        // }
    } else if(condition.toLowerCase().includes('snow')) {
        const random = Math.floor(Math.random() * 4) + 1; 
        pic.style.background = `url(imgs/snow${random}.jpg)`;
        filter(pic);
        // if(pic.classList.contains('current')) {
        //     logoClouds.src = 'imgs/icons/wi-snow.svg'
        // }
    } else if(condition.toLowerCase().includes('sleet')) {
        const random = Math.floor(Math.random() * 4) + 1; 
        pic.style.background = `url(imgs/sleet${random}.jpg)`;
        filter(pic);
        // if(pic.classList.contains('current')) {
        //     logoClouds.src = 'imgs/icons/wi-sleet.svg'
        // }
    } else if(condition.toLowerCase().includes('drizzle')) {
        pic.style.background = 'url(imgs/sleet_1.jpg)';
        filter(pic);
        // if(pic.classList.contains('current')) {
        //     logoClouds.src = 'imgs/icons/wi-showers.svg'
        // }
    } else if(condition.toLowerCase().includes('thundery')) {
        const random = Math.floor(Math.random() * 2) + 1; 
        pic.style.background = `url(imgs/thunder_${random}.jpg)`;
        filter(pic);
        // if(pic.classList.contains('current')) {
        //     logoClouds.src = 'imgs/icons/wi-night-sleet-storm.svg'
        // }
    } else if(condition.toLowerCase().includes('fog')) {
        pic.style.background = 'url(imgs/fog.jpg)';
        filter(pic);
        // if(pic.classList.contains('current')) {
        //     logoClouds.src = 'imgs/icons/wi-fog.svg'
        // }
    } else if(condition.toLowerCase().includes('blizzard')) {
        pic.style.background = 'url(imgs/blizzard.jpg)';
        pic.style.backgroundPosition = 'left-bottom';
        pic.style.backgroundSize = 'cover';
        // if(pic.classList.contains('current')) {
        //     logoClouds.src = 'imgs/icons/wi-snow.svg'
        // }
    } else if(condition.toLowerCase().includes('ice')) {
        const random = Math.floor(Math.random() * 3) + 1; 
        pic.style.background = `url(imgs/ice_${random}.jpg)`;
        filter(pic);
        // if(pic.classList.contains('current')) {
        //     logoClouds.src = 'imgs/icons/wi-snowflake-cold.svg'
        // }
    } else if(condition.toLowerCase().includes('rain with thunder')) {
        pic.style.background = 'url(imgs/thunderstorm.jpg)';
        filter(pic);
        // if(pic.classList.contains('current')) {
        //     logoClouds.src = 'imgs/icons/wi-thunderstorm.svg'
        // }
    } else if(condition.toLowerCase().includes('snow with thunder')) {
        pic.style.background = 'url(imgs/thundersnow.jpg)';
        filter(pic);
        // if(pic.classList.contains('current')) {
        //     logoClouds.src = 'imgs/icons/wi-thunderstorm.svg'
        // }
    } 
}

function filter(pic) {
    pic.style.backgroundPosition = 'center';
    pic.style.backgroundSize = 'cover';
    pic.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    pic.style.backgroundBlendMode = 'screen';
    pic.style.backgroundRepeat = 'no-repeat';
}