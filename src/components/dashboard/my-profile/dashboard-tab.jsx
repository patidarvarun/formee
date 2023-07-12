import React, { Component } from 'react';

class Dashboardtab extends React.Component {
    render() { 
        return <div>
              <ul>
               <li><a onClick={() => { this.props.history.push('/dashboard') }} className="tabview-btn retail-btn">DASHBOARD</a></li>
               <li><a onClick={() => { this.props.history.push('/retail-orders') }} className="tabview-btn retail-btn">RETAIL</a></li>
               <li><a onClick={() => { this.props.history.push('/classifieds') }} className="tabview-btn classifield-btn">CLASSFIEDS</a></li>
               <li><a onClick={() => { this.props.history.push('/my-bookings') }} className="tabview-btn booking-btn">BOOKING</a></li>
               <li><a onClick={() => { this.props.history.push('/food-scanner') }} className="tabview-btn food-scanner">FOOD SCANNER</a></li>
               </ul>
               
        </div>;
    }
}
 
export default Dashboardtab;