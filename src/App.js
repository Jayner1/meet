import React, {Component} from 'react';
import './App.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import { OfflineAlert } from './Alert';
import WelcomeScreen from './WelcomeScreen';
import EventGenre from './EventGenre';
import { getEvents, extractLocations, checkToken, getAccessToken } from'./api';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


class App extends Component {
  state = {
    events: [],
    location: "",
    locations: [],
    numberOfEvents: 32,
    offlineText: '',
    showWelcomeScreen: undefined
  }

  updateEvents = () => {
    const location = this.state.location;
    const numberofEvents = this.state.numberofEvents;
    
    getEvents().then((events) => {
      const locationEvents = 
      (location === "all")
      ? events
      : events.filter((event) => event.location === location);
      this.setState({
        events: locationEvents.slice(0, this.state.numberOfEvents)
      });
    });
  }

  updatelocation(location) {
    this.setState({
      location: location,
    }, () => {
      this.updateEvents();
    });
  }

  updateNumberOfEvents(number) {
    this.setState({
      numberOfEvents: number,
    }, () => {
      this.updateEvents();
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
    const accessToken = localStorage.getItem('access_token');
    const isTokenValid = (await checkToken(accessToken)).error ? false : true;
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    this.setState({ showWelcomeScreen: !(code || isTokenValid) });
    if ((code || isTokenValid) && this.mounted) {
      getEvents().then((events) => {
        if (this.mounted) {
          this.setState({
            events: events.slice(0, this.state.numberOfEvents),
            locations: extractLocations(events)});
        }
      });
    }
    
    if (!navigator.onLine) {
      this.setState({
        offlineText:
          "No internet connection. Data loaded from the cache.",
        });
      } else {
        this.setState({
          offlineText: '',
        });
      }

  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    if (this.state.showWelcomeScreen === undefined) return <div className="App" />;
    return (
      <div className="App">
        <div className='hero-container'>
          <h2> FIND YOUR </h2>
          <p> next big tech event. </p>
        </div>
        <OfflineAlert text={this.state.offlineText}/>
        <div className='top-container'> 
          <CitySearch 
            locations={this.state.locations}
            updateEvents={(location) => this.updatelocation(location)} />
          <NumberOfEvents
            num={this.state.numberOfEvents}
            updateNumberOfEvents={(num) => this.updateNumberOfEvents(num)}
          />
        </div>

        <div className='data-vis-wrapper'>
          <EventGenre events ={this.state.events} />
          <ResponsiveContainer height={400} >
            <ScatterChart margin={{right: 25}}>
              <CartesianGrid />
              <XAxis type="category" dataKey="city" name="city" stroke="white" />
              <YAxis type="number" dataKey="number" name="number of events" allowDecimals={false} stroke="white" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={this.getData()} fill="#fadba9" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className='events-container'> 
          <EventList events={this.state.events} />
        </div>
        <WelcomeScreen showWelcomeScreen={this.state.showWelcomeScreen} getAccessToken={() => { getAccessToken() }} />
      </div>
    );
  }
}

export default App;