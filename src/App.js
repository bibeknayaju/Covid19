import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem, Card, CardContent } from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import "./App.css";
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import Linegraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  //STATE = How to write a variable in REACT
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] =useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 28.3949, lng: 84.1240 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);



  useEffect(() => [
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  ], [])
  //Runs piece of code base on a given conditon.
  useEffect(() => {
    //the code inside here will run once when component loads not again after.
    //asynxc --> send a request, wait for it, something wait for info
    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // It  goes like Nepal, United State, France
            value: country.countryInfo.iso2, //it likes that UK, USA, FR, NP
          }));

            const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountryData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;


    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;


    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode);

      // All of the data from the country response
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          {/* header */}
          <h1>COVID-19 TRACKER<hr className="line"/></h1>
          {/* title + select input dropdown field */}
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              {/* Loops through all the countries and show the dropdown list of all countries */}
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox 
          isRed
          active={casesType === 'cases'}
          onClick={e => setCasesType('cases')}
           title="Corona Virus Cases"
           cases={prettyPrintStat(countryInfo.todayCases)}
           total={countryInfo.cases} 
          />
          <InfoBox 
          active={casesType === 'recovered'}
          onClick={e => setCasesType('recovered')}
           title="Corona Virus Recovered" 
           cases={prettyPrintStat(countryInfo.todayRecovered)} 
           total={countryInfo.recovered} 
          />
          <InfoBox
          isRed 
          active={casesType === 'deaths'}
          onClick={e => setCasesType('deaths')}
           title="Corona Virus Death" 
           cases={prettyPrintStat(countryInfo.todayDeaths)} 
           total={countryInfo.deaths} 
          />

          {/* Info Boxs */}
          {/* Infobox */}
          {/* Infobox */}
        </div>
        {/* Map */}
        <Map 
        casesType={casesType}
        countries={mapCountries}
        center={mapCenter}
        zoom={mapZoom}
        />
      </div>


      <Card className="app__right">
        <CardContent>
          <h3>Live case by Country</h3>
          <Table countries={tableData} />
        {/* Table */}

        {/* Graph */}
        <h3 className="app__graphTitle">WorldWide new {casesType}</h3>
        <Linegraph 
        className="app__grow" 
        casesType= {casesType}
        />

        </CardContent>
      </Card>
    </div>
  );
}

export default App;
