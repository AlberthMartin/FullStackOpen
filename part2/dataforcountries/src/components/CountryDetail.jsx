import { useEffect, useState } from 'react';
import axios from 'axios';

function CountryDetail({ country }) {
  const [data, setData] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY

  //Fetches the data for the country every time county value change
  useEffect(() => {
    if(!country) return;

    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country.name.common}`)
      .then(response =>{
        setData(response.data);

        const capital = response.data.capital[0];
        return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`)

      })
      .then(whetherResponse =>{
        setWeatherData(whetherResponse.data)
      })
      .catch(error =>{
        console.error("Error fetching data:", error)
      })
  }, [country]); // re-run every time country is changed

  if(!data || !weatherData){
    return <p>Loading...</p>
  }
  return (
    <div className='justify-center'>
      <h2>{data.name.common}</h2>
      <p>Capital: {data.capital}</p>
      <p>Area: {data.area} km²</p>

      <h3>Languages:</h3>
      <ul>
        {Object.values(data.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img src={data.flags.png} alt={`Flag of ${data.name.common}`} width="150" />

        <h2>Wheater in {data.capital[0]}</h2>
        <p>Temperature: {(weatherData.main.temp-273.15).toFixed(1)}°C</p>
        <p>Wind: {weatherData.wind.speed} m/s</p>
        
        <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}/>
         
      
    </div>
  );
}

export default CountryDetail;