import React, { Component } from "react";

 class Event extends Component {
   state = { collapsed: true };
   toggleDetails = () => {
     this.setState((prevState) => ({
       collapsed: !prevState.collapsed,
     }));
   };

   render() {
     const { event } = this.props;
     const { collapsed } = this.state;
     return (
       <div className="event">
         <h1 className="summary">{event.summary}</h1>
         <p className="event-start">
           {new Date(event.start.dateTime).toString()}
         </p>
         <p className="event-location">{`@${event.summary} | ${event.location}`}</p>
         {!collapsed && (
           <div className="event-details">
             <h2 className="about">About event:</h2>
             <a className="link" href={event.htmlLink}>
               See details on Google Calendar
             </a>
             <p className="description">{event.description}</p>
             </div>
         )}
         <button className="details-btn" onClick={() => this.toggleDetails()}>
           {collapsed ? "show" : "hide"} details
         </button>
       </div>
     );
   }
 }
 export default Event;