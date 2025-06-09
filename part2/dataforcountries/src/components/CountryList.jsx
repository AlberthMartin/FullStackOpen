function CountryList({ countries, onShow }) {
    return (
      <ul>
        {countries.map(c => (
          <li key={c.name.common}>
            {c.name.common}
            <button onClick={() => onShow(c)}>show</button>
          </li>
        ))}
      </ul>
    );
  }
  
  export default CountryList;