// this is the complete code, copy and use

import React from 'react';

const API = 'https://geoip-db.com/json';
const DEFAULT_QUERY = 'redux';

class IPAddress extends React.Component {
constructor(props) {
super(props);

    this.state = {
      hits: [],
isLoading: false,
    };

this.setStateHandler = this.setStateHandler.bind(this);

}

setStateHandler() {
this.setState({ isLoading: true });

fetch(API + DEFAULT_QUERY)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => 
        this.setState({ hits: data.IPv4, isLoading: false })
        )
      .catch(error => this.setState({ error, isLoading: false }));
  }

render() {
return (
    <div>
    <button onClick = {this.setStateHandler}>Click</button>
    <h2>Ip address{this.state.hits}</h2>
    </div>
    );
    }
}

export default IPAddress;