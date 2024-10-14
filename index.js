const weatherApiKey = 'MJLR9C6EM9R8XDNVVNCD4EG64';
const giphyApiKey = 'R1noaxMZ6afkxn3UNSDwdZv9tD2xGVlW';

async function getWeather(location, unit = 'metric') {
    try {
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit === 'metric' ? 'metric' : 'us'}&key=${weatherApiKey}&contentType=json`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weatherInfo').innerHTML = `<p>Failed to fetch weather data. Please try again.</p>`;
    }
}

async function getWeatherGif(description) {
    try {
        const response = await fetch(
            `https://api.giphy.com/v1/gifs/translate?api_key=${giphyApiKey}&s=${description}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.data.images.original.url;
    } catch (error) {
        console.error('Error fetching GIF:', error);
    }
}

async function displayWeather(data, unit) {
    const temperature = data.currentConditions.temp;
    const description = data.currentConditions.conditions;
    const unitSymbol = unit === 'metric' ? '°C' : '°F';

    document.getElementById('weatherInfo').innerHTML = `
    <h2>${data.address}</h2>
    <p><strong>Temperature:</strong> ${temperature} ${unitSymbol}</p>
    <p><strong>Condition:</strong> ${description}</p>
  `;

    changeBackground(description);

    const gifUrl = await getWeatherGif(description);
    if (gifUrl) {
        document.getElementById('weatherGif').src = gifUrl;
    }
}

function changeBackground(description) {
    if (description.includes('Rain')) {
        document.body.style.backgroundColor = '#a3d2ca'; 
    } else if (description.includes('Clear') || description.includes('Sunny')) {
        document.body.style.backgroundColor = '#ffdda1'; 
    } else if (description.includes('Snow')) {
        document.body.style.backgroundColor = '#d3e0ea';
    } else {
        document.body.style.backgroundColor = '#f5f5f5'; 
    }
}

document.getElementById('searchBtn').addEventListener('click', async() => {
    const location = document.getElementById('locationInput').value;
    const unit = document.getElementById('unitToggle').checked ? 'metric' : 'imperial';

    if (location) {
        const weatherData = await getWeather(location, unit);
        if (weatherData) {
            displayWeather(weatherData, unit);
        }
    } else {
        document.getElementById('weatherInfo').innerHTML = '<p>Please enter a location.</p>';
    }
});

document.getElementById('unitToggle').addEventListener('change', async() => {
    const location = document.getElementById('locationInput').value;
    const unit = document.getElementById('unitToggle').checked ? 'metric' : 'imperial';

    if (location) {
        const weatherData = await getWeather(location, unit);
        if (weatherData) {
            displayWeather(weatherData, unit);
        }
    }
});