const apiKey = '6d775e5885840081f275e179c7ac675c';

const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const weatherInfoContainer = document.querySelector('#weather-info-container');
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const cityName = cityInput.value.trim();

    if (cityName) {
        getWeather(cityName);
        getForecast(cityName);
    } else {
        alert('กรุณาป้อนชื่อเมือง');
    }
});
async function getWeather(city) {
    weatherInfoContainer.innerHTML = `<p>กำลังโหลดข้อมูล...</p>`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('ไม่พบข้อมูลเมืองนี้');
        }
        const data = await response.json();
        displayWeather(data);

        // เรียกใช้ฟังก์ชันพยากรณ์อากาศ
        getForecast(city);
    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

async function getForecast(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('ไม่พบข้อมูลพยากรณ์อากาศ');
        }
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error(error.message);
    }
}

function displayWeather(data) {
    const { name, main, weather } = data;
    const { temp, humidity } = main;
    const { description, icon } = weather[0];

    const weatherHtml = `
        <h2>${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p style="font-size: 2rem; font-weight: bold;">${temp.toFixed(1)}°C</p>
        <p>${description}</p>
        <p>ความชื้น: ${humidity}%</p>
    `;
    weatherInfoContainer.innerHTML = weatherHtml;
}

function displayForecast(data) {
    const forecastContainer = document.createElement('div');
    forecastContainer.classList.add('forecast-container');

    
    const forecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);

    const forecastHtml = forecasts.map(item => {
        const { dt_txt, main, weather } = item;
        const { temp } = main;
        const { description, icon } = weather[0];

        return `
            <div class="forecast-item">
                <p>${new Date(dt_txt).toLocaleDateString('th-TH', { weekday: 'long' })}</p>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
                <p>${temp.toFixed(1)}°C</p>
                <p>${description}</p>
            </div>
        `;
    }).join('');

    forecastContainer.innerHTML = forecastHtml;
    weatherInfoContainer.appendChild(forecastContainer);
}