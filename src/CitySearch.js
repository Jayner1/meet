import React, { Component } from "react";
import { InfoAlert } from "./Alert";

class CitySearch extends Component {
  state = {
    query: "",
    suggestions: [],
    showSuggestions: false,
    infoText: "",
  };

  handleInputChanged = (event) => {
    const value = event.target.value;
    this.setState({ showSuggestions: true });
    const suggestions = this.props.locations.filter((location) => {
      return location.toUpperCase().indexOf(value.toUpperCase()) > -1;
    });
    if (suggestions.length === 0) {
      this.setState({
        query: value,
        infoText:
          "We cannot find the city you are looking for. Please try another city",
      });
    } else {
      return this.setState({
        query: value,
        suggestions,
        infoText: "",
      });
    }
  };

  handleItemClicked = (suggestion) => {
    this.setState({
      query: suggestion,
      suggestions: [],
      showSuggestions: false,
      infoText: "",
    });
    this.props.updateLocation(suggestion);
  };

  getSuggestionsStyle = () => {
    return this.state.showSuggestions
      ? {
          top: this.state.infoText === "" ? "48px" : "70px",
        }
      : { opacity: 0 };
  };

  hideSuggestions = () => {
    this.setState({
      showSuggestions: false,
    });
  };

  render() {
    return (
      <div className="CitySearch" onBlur={this.hideSuggestions}>
        <InfoAlert text={this.state.infoText} />
        <input
          type="text"
          className="city"
          value={this.state.query}
          onChange={this.handleInputChanged}
          placeholder="Search for location..."
          onFocus={() => {
            this.setState({ showSuggestions: true });
          }}
        />
        <ul className="suggestions" style={this.getSuggestionsStyle()}>
          {this.state.suggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => this.handleItemClicked(suggestion)}
            >
              {suggestion}
            </li>
          ))}
          <li onClick={() => this.handleItemClicked("all")}>
            <b>See all cities</b>
          </li>
        </ul>
      </div>
    );
  }
}

export default CitySearch;