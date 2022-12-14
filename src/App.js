import React, { Component } from 'react';
import './App.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import { getEvents, extractLocations } from './api';
import './nprogress.css';

class App extends Component {
  state = {
    events: [],
    locations: [],
    numberOfEvents: 32
  }

  updateEvents = (location, eventCount) => {
    if (eventCount === undefined) {
      eventCount = this.state.numberOfEvents;
    } else this.setState({ numberOfEvents: eventCount });

    getEvents().then((events) => {
      const locationEvents =
        location === 'all'
          ? events
          : events.filter((event) => event.location === location);
      const filteredEvents = locationEvents.slice(0, eventCount);
      this.setState({
        events: filteredEvents,
        currentLocation: location,
      });
    });
  };


  componentDidMount() {
    this.mounted = true;
    getEvents().then((events) => {
      if (this.mounted) {
        this.setState({ events, locations: extractLocations(events) });
      }
    });
  }

  componentWillUnmount(){
    this.mounted = false;
  }

  render() {
    return (
      <div className="App">
        <CitySearch locations={this.state.locations} updateEvents={this.updateEvents} />
        <EventList events={this.state.events} />
        <NumberOfEvents />
      </div>
    );
  }
}

export default App;