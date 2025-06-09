import { useState, useEffect } from 'react';
import axios from 'axios';
import CountryList from './components/CountryList';
import CountryDetail from './components/CountryDetail';

function App() {
  //the inputted searchterm
  const [searchterm, setSearchterm] = useState('');

  //the filtered countries that is searched for
  const [filteredCountries, setFilteredCountries] = useState([]);
  
  //The selected country to be shown
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (searchterm === '') {
      setFilteredCountries([]);
      return;
    }

    axios
      //get all the countries as json objects from api
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
        //filter them
        const filtered = response.data.filter(country =>
          //if the country name is equal to the searchterm 
          country.name.common.toLowerCase().includes(searchterm.toLowerCase())
        );
         // set the filteredCountrier to the found countries that matches the search term
        setFilteredCountries(filtered);

        setSelected(null);
      });
  }, [searchterm]);


  return (
    <div>
      <label>Type in the country you want to find: </label>
      {/**The value is the searchtesm */}
      <input value={searchterm} onChange={e => setSearchterm(e.target.value)} />

      {selected ? 
      <CountryDetail country={selected}/> : 
        filteredCountries.length > 10 ?
        <p>To many countries, please select a more specific filter</p> : 
        <CountryList countries={filteredCountries} onShow={setSelected}/>
      }
      
    </div>
  );
}

export default App;
