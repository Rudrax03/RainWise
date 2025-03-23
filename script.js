// 🌧️ Main function to calculate rainwater collection
async function calculateRainwater() {
  const roofSize = parseFloat(document.getElementById("roofSize").value);
  const location = document.getElementById("location").value.trim();

  if (!roofSize || isNaN(roofSize) || !location) {
    alert("Please enter a valid roof size and location.");
    return;
  }

  const apiKey = "75bce949e088a64c3069599e1f38d879";
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(weatherUrl);
    const data = await response.json();

    if (data.cod !== 200) {
      throw new Error(data.message || "Invalid location");
    }

    // 🌤️ Display weather information
    displayWeatherInfo(data);

    const rainfall = data.rain ? data.rain["1h"] || 0 : 0;
    const runoffCoefficient = 0.8;
    const collectedWater = (roofSize * rainfall * runoffCoefficient).toFixed(2);

    // 💧 Display results and storage recommendation
    const result = document.getElementById("result");
    if (rainfall > 0) {
      result.innerHTML = `
        <h3>💧 Estimated Collected Water:</h3>
        <p>${collectedWater} liters 🌧️</p>`;
      recommendStorage(collectedWater);
    } else {
      result.innerHTML = `<h3>☀️ No significant rainfall detected.</h3>`;
    }

    // 🌍 Display weather articles and precautions
    displayWeatherArticles();
    displayPrecautions(data);
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("result").innerHTML = `Error: ${error.message}`;
  }
}

// 🌤️ Display current weather information
function displayWeatherInfo(data) {
  const weatherInfo = document.getElementById("weatherInfo");

  weatherInfo.innerHTML = `
    <h2>🌤️ Current Weather</h2>
    <p>Temperature: ${data.main.temp}°C 🌡️</p>
    <p>Humidity: ${data.main.humidity}% 💧</p>
    <p>Condition: ${data.weather[0].description} 🌥️</p>`;
}

// 💧 Recommend appropriate storage solution
function recommendStorage(collectedWater) {
  const storageSolution = document.getElementById("storageSolution");

  let recommendation = "";
  collectedWater = parseFloat(collectedWater);

  if (collectedWater < 1000) {
    recommendation = "Small Storage Tank (500-1000 liters) 🛢️";
  } else if (collectedWater >= 1000 && collectedWater < 5000) {
    recommendation = "Medium Storage Tank (1000-5000 liters) 🚰";
  } else {
    recommendation = "Large Underground Recharge Pit 🌊";
  }

  storageSolution.innerHTML = `
    <h2>💡 Recommended Storage Solution:</h2>
    <p>${recommendation}</p>`;
}

// 🌍 Display local weather articles with valid links
function displayWeatherArticles() {
  const articlesContainer = document.getElementById("weatherArticles");

  const articles = [
    { title: "Rainfall Patterns", link: "https://weather.com" },
    {
      title: "Impact of Rainwater Harvesting",
      link: "https://smartwateronline.com/news/the-environmental-impact-of-rainwater-harvesting-and-using-water-tanks-at-home",
    },
    { title: "Climate Change Effects", link: "https://climate.nasa.gov" },
  ];

  let html = "<ul>";
  articles.forEach((article) => {
    html += `<li><a href="${article.link}" target="_blank">${article.title}</a></li>`;
  });
  html += "</ul>";

  articlesContainer.innerHTML = html;
}

// ⚠️ Display precautions based on weather conditions
function displayPrecautions(data) {
  const precautionsContainer = document.getElementById("precautionList");
  const temp = data.main.temp;
  const weather = data.weather[0].main;

  let precautions = [];

  if (weather.includes("Rain")) {
    precautions = [
      "Carry an umbrella ☔",
      "Wear waterproof shoes 🥾",
      "Avoid waterlogged areas 🚧",
    ];
  } else if (temp > 30) {
    precautions = [
      "Stay hydrated 💧",
      "Wear light clothing 👕",
      "Use sunscreen 🧴",
    ];
  } else {
    precautions = ["Carry a light jacket 🧥", "Check weather alerts 🚨"];
  }

  let html = "<ul>";
  precautions.forEach((item) => {
    html += `<li>${item}</li>`;
  });
  html += "</ul>";

  precautionsContainer.innerHTML = html;
}
