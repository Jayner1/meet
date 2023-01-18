import React, {Component} from 'react';
import './App.css';
import './nprogress.css';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

import EventList from './EventList';
import EventGenre from './EventGenre';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import { OfflineAlert } from './Alert';

import { extractLocations, getEvents, checkToken, getAccessToken } from './api';
import WelcomeScreen from './WelcomeScreen';



class App extends Component {

  state = {
    events: [],
    locations: [],
    currentLocation: "all",
    currentEventCount: 32,
    infoText: "",
    showWelcomeScreen: undefined,
  }


  updateEvents = (location, eventCount) => {

    if (!navigator.onLine) this.setState({ infoText: "This page is currently being displayed in offline mode." });
    else this.setState({ infoText: "" });

    if (location === null) {
      location = this.state.currentLocation;
    }

    if (eventCount === null) {
      eventCount = this.state.currentEventCount;
    }

    getEvents().then((events) => {
      const locationEvents = (location === 'all') ?
        events :
        events.filter((event) => event.location === location);
      const updatedEvents = locationEvents.slice(0, eventCount);
      this.setState({
        events: updatedEvents,
        currentLocation: location,
        currentEventCount: eventCount
      });
    });
  }

  getData = () => {
    const {locations, events} = this.state;
    const data = locations.map((location)=>{
      const number = events.filter((event) => event.location === location).length
      const city = location.split(', ').shift()
      return {city, number};
    })
    return data;
  };

  async componentDidMount() {
    this.mounted = true;
    const accessToken = localStorage.getItem("access_token");
    const isTokenValid =
      !window.location.href.startsWith("http://localhost") &&
      !(accessToken && !navigator.onLine) &&
      (await checkToken(accessToken)).error
        ? false
        : true;
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    this.setState({ showWelcomeScreen: !(code || isTokenValid) });
    if ((code || isTokenValid) && this.mounted) {
      getEvents().then((events) => {
        if (this.mounted) {
          this.setState({
            events: events.slice(0, this.state.currentEventCount),
            locations: extractLocations(events),
          });
        }
      });
    }
  }


  componentWillUnmount(){
    this.mounted = false;
  }

  render() {
    const { showWelcomeScreen } = this.state;    
    if (showWelcomeScreen === undefined) {
      return <div className="App" />;
    } else if (showWelcomeScreen === true) {
      return (
        <WelcomeScreen
          showWelcomeScreen={showWelcomeScreen}
          getAccessToken={() => {
            getAccessToken();
          }}
        />
      );
    } else {
      return <div className="App">
        <CitySearch locations={this.state.locations} updateEvents={this.updateEvents}/>
        <NumberOfEvents updateEvents={this.updateEvents}/>
        <OfflineAlert text={this.state.infoText}/>

        <div className="data-vis-wrapper">
          <EventGenre events={this.state.events}/>
          <ResponsiveContainer className="scatterChart" height={400}> 
            <ScatterChart 
              margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="category" dataKey="city" name="City" />
              <YAxis type="number" dataKey="number" name="Number of events" allowDecimals={false} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={this.getData()} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <EventList events={this.state.events}/>
      </div>
    }
  }


}

export default App;