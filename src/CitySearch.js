import React, { Component } from 'react';

class CitySearch extends Component {
        render() {
            return (
              <div className="CitySearch">
                <input
                  type="text"
                  className="city"
                />
                <ul className="suggestions">
                </ul>
              </div>
            );
            }
}

export default CitySearch;