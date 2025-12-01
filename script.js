// ملف script.js

// 1. الحصول على العناصر من الـ HTML
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

// 2. مفتاح الـ API الخاص بك
const apiKey = '5f033e3605562dbed15cdbd56f5354e5';

// قائمة بسيطة من المدن للاقتراحات التلقائية (يمكنك توسيعها)
const cities = [
      "Cairo", "Alexandria", "Giza", "Shubra El Kheima", "Port Said", "Suez", "Luxor", "Aswan", "Tanta", "Ismailia", "Fayyum", "Zagazig", "Asyut",
      "Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", "Tabuk",
      "London", "Manchester", "Birmingham", "Liverpool", "Bristol",
      "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
      "Paris", "Marseille", "Lyon", "Toulouse", "Nice",
      "Tokyo", "Osaka", "Kyoto",
      "Sydney", "Melbourne", "Brisbane"
];

// --- الأحداث (Event Listeners) ---

// 3. إضافة حدث النقر على زر البحث
searchBtn.addEventListener('click', () => {
      const city = cityInput.value;
      if (city) {
            getWeatherData(city);
      } else {
            showError('الرجاء إدخال اسم مدينة.');
      }
});

// إضافة حدث الضغط على زر Enter في حقل الإدخال
cityInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
            searchBtn.click();
      }
});

// إضافة حدث للتغيير على القائمة المنسدلة
citySelect.addEventListener('change', () => {
      const selectedCity = citySelect.value;
      if (selectedCity) {
            cityInput.value = selectedCity;
            getWeatherData(selectedCity);
      }
});

// إضافة حدث الإدخال (input) لتفعيل الاقتراحات التلقائية
cityInput.addEventListener('input', () => {
      const query = cityInput.value.toLowerCase();
      if (query.length < 2) {
            hideSuggestions();
            return;
      }
      const filteredCities = cities.filter(city => city.toLowerCase().includes(query));
      displaySuggestions(filteredCities);
});

// إخفاء الاقتراحات عند النقر في أي مكان آخر في الصفحة
document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-box') && !e.target.closest('.suggestions-container')) {
            hideSuggestions();
      }
});


// --- الدوال (Functions) ---

// 4. الدالة الرئيسية لجلب بيانات الطقس (محدثة للبحث بالعربية والإنجليزية)
async function getWeatherData(city) {
      // محاولة البحث باللغة العربية أولاً
      let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ar`;

      try {
            let response = await fetch(apiUrl);

            // إذا فشل البحث بالعربية، جرب بالإنجليزية
            if (!response.ok) {
                  console.log("البحث بالعربية فشل، جاري المحاولة بالإنجليزية...");
                  const englishApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
                  response = await fetch(englishApiUrl);

                  // إذا فشل البحث بالإنجليزية أيضاً، أطلق خطأ
                  if (!response.ok) {
                        throw new Error('لم يتم العثور على المدينة. يرجى التحقق من الإملاء.');
                  }
            }

            const data = await response.json();
            displayWeather(data);
            hideSuggestions(); // إخفاء الاقتراحات بعد البحث الناجح

      } catch (error) {
            showError(error.message);
            hideSuggestions(); // إخفاء الاقتراحات في حالة الخطأ أيضاً
      }
}

// 5. دالة لعرض البيانات في الصفحة
function displayWeather(data) {
      cityName.textContent = data.name;
      temperature.textContent = `${Math.round(data.main.temp)}°C`;

      // استدعاء دالة الأنيميشن هنا
      setWeatherAnimation(data.weather[0].description);

      description.textContent = data.weather[0].description;

      const iconCode = data.weather[0].icon;
      weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      weatherIcon.alt = data.weather[0].description;

      weatherResult.classList.remove('hidden');
      errorMessage.classList.add('hidden');
}

// 6. دالة لعرض رسالة الخطأ
function showError(message) {
      errorMessage.textContent = message;
      errorMessage.classList.remove('hidden');
      weatherResult.classList.add('hidden');
}

// 7. دالة لعرض الاقتراحات التلقائية
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