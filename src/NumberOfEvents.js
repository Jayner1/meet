import React, { Component } from "react";
import { ErrorAlert } from "./Alert";

 class NumberOfEvents extends Component {
   state = { 
    num: 32,
   errorText: "",
  };

  changeNum = (value) => {
    this.setState({ num: value });
    this.props.updateNumberOfEvents(value);
    if (value < 1 || value > 32) {
      this.setState({ errorText: "Select number from 1 to 32" });
    } else this.setState({ errorText: "" });
  };

  componentDidMount() {
    this.setState({ num: this.props.num || 32 });
  }

  render() {
    const { num, errorText } = this.state;

    return (
      <div>
        <ErrorAlert text={errorText} />
        <label>
          Number of events
          <input
            className="num"
            type="number"
            value={num}
            onChange={(event) => this.changeNum(event.target.value)}
          ></input>
        </label>
      </div>
    );
  }
}

 export default NumberOfEvents;