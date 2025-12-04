// ملف script.js


const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const citySelect = document.getElementById('city-select');
const suggestionsContainer = document.getElementById('suggestions-container');
const weatherResult = document.getElementById('weather-result');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const errorMessage = document.getElementById('error-message');


const apiKey = '5f033e3605562dbed15cdbd56f5354e5';


const cities = [
      "Cairo", "Alexandria", "Giza", "Shubra El Kheima", "Port Said", "Suez", "Luxor", "Aswan", "Tanta", "Ismailia", "Fayyum", "Zagazig", "Asyut",
      "Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", "Tabuk",
      "London", "Manchester", "Birmingham", "Liverpool", "Bristol",
      "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
      "Paris", "Marseille", "Lyon", "Toulouse", "Nice",
      "Tokyo", "Osaka", "Kyoto",
      "Sydney", "Melbourne", "Brisbane"
];




searchBtn.addEventListener('click', () => {
      const city = cityInput.value;
      if (city) {
            getWeatherData(city);
      } else {
            showError('الرجاء إدخال اسم مدينة.');
      }
});


cityInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
            searchBtn.click();
      }
});


citySelect.addEventListener('change', () => {
      const selectedCity = citySelect.value;
      if (selectedCity) {
            cityInput.value = selectedCity;
            getWeatherData(selectedCity);
      }
});


cityInput.addEventListener('input', () => {
      const query = cityInput.value.toLowerCase();
      if (query.length < 2) {
            hideSuggestions();
            return;
      }
      const filteredCities = cities.filter(city => city.toLowerCase().includes(query));
      displaySuggestions(filteredCities);
});

document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-box') && !e.target.closest('.suggestions-container')) {
            hideSuggestions();
      }
});



async function getWeatherData(city) {
  
      let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ar`;

      try {
            let response = await fetch(apiUrl);

         
            if (!response.ok) {
                  console.log("البحث بالعربية فشل، جاري المحاولة بالإنجليزية...");
                  const englishApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
                  response = await fetch(englishApiUrl);

                  if (!response.ok) {
                        throw new Error('لم يتم العثور على المدينة. يرجى التحقق من الإملاء.');
                  }
            }

            const data = await response.json();
            displayWeather(data);
            hideSuggestions();
      } catch (error) {
            showError(error.message);
            hideSuggestions(); 
      }
}


function displayWeather(data) {
      cityName.textContent = data.name;
      temperature.textContent = `${Math.round(data.main.temp)}°C`;

  
      setWeatherAnimation(data.weather[0].description);

      description.textContent = data.weather[0].description;

      const iconCode = data.weather[0].icon;
      weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      weatherIcon.alt = data.weather[0].description;

      weatherResult.classList.remove('hidden');
      errorMessage.classList.add('hidden');
}


function showError(message) {
      errorMessage.textContent = message;
      errorMessage.classList.remove('hidden');
      weatherResult.classList.add('hidden');
}


function displaySuggestions(suggestions) {
      suggestionsContainer.innerHTML = ''; // مسح الاقتراحات القديمة

      if (suggestions.length === 0) {
            hideSuggestions();
            return;
      }

      suggestions.forEach(city => {
            const item = document.createElement('div');
            item.classList.add('suggestion-item');
            item.textContent = city;
            item.addEventListener('click', () => {
                  cityInput.value = city;
                  hideSuggestions();
                  getWeatherData(city);
            });
            suggestionsContainer.appendChild(item);
      });
      suggestionsContainer.classList.remove('hidden');
}

// 8. دالة لإخفاء الاقتراحات
function hideSuggestions() {
      suggestionsContainer.classList.add('hidden');
}

/**
 * دالة لتحديث أنيميشن وخلفية الموقع بناءً على حالة الطقس
 * @param {string} weatherCondition - وصف حالة الطقس (مثل: 'clear sky', 'rain', 'snow')
 */
function setWeatherAnimation(weatherCondition) {
      const body = document.body;
      // إزالة جميع كلاسات الطقس السابقة
      body.className = '';

      // إخفاء جميع عناصر الأنيميشن أولاً
      document.getElementById('weather-animation-container').querySelectorAll('div').forEach(el => {
            el.classList.add('hidden');
      });

      // تحويل حالة الطقس إلى حروف صغيرة لمطابقتها بسهولة
      const condition = weatherCondition.toLowerCase();

      // تحديد الأنيميشن المناسب بناءً على الكلمات المفتاحية
      if (condition.includes('clear') || condition.includes('sun')) {
            body.classList.add('sunny');
            document.querySelector('.sun').classList.remove('hidden');
      } else if (condition.includes('cloud')) {
            body.classList.add('cloudy');
            document.querySelector('.cloud').classList.remove('hidden');
      } else if (condition.includes('rain') || condition.includes('drizzle')) {
            body.classList.add('rainy');
            document.querySelector('.rain-container').classList.remove('hidden');
      } else if (condition.includes('snow')) {
            body.classList.add('snowy');
            document.querySelector('.snow-container').classList.remove('hidden');
      } else {
            // حالة افتراضية إذا لم تتطابق أي حالة
            body.classList.add('cloudy');
            document.querySelector('.cloud').classList.remove('hidden');
      }
}
