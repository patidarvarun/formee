import React from "react";
import './popup.css';
import { Link, Redirect, withRouter } from 'react-router-dom';
const Popup = props => {

console.warn('props of popup',props);
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose}>x</span>
      
        	{
        		props.content.map(notificationData => (
       	      	<li>{notificationData.key}</li>,
       	      	<li>{notificationData.name}</li>,
       	      	<li>{notificationData.massage}</li>
       	    
       	  ))}

       	  <Link to='/notifications' title='Cart'>View All Notification</Link>

      </div>

    </div>
  );
};

export default Popup;