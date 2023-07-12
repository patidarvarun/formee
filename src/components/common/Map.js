import React, { Component } from 'react';
import { GOOGLE_MAP_KEY } from '../../config/Config';
import { compose, withProps } from 'recompose';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker
} from 'react-google-maps';

export default class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultLocation: {},
            className: '',
        }
    }

    rendermarker = (list) => {
        // let temp = [{ lat: 11.059821, lng: 78.387451 }, { lat: 17.123184, lng: 79.208824 }, { lat: 23.473324, lng: 77.947998 }, { lat: 29.238478, lng: 76.431885 }, { lat: 21.295132, lng: 81.828232 }]
        return list.map((el, i) => {
            console.log('el.pickupLocation: ', el);
            let loc = {
                lat: '',
                lng: ''
            }
            if (el.lat !== undefined && el.lng !== undefined && el.lat !== null && el.lng !== null) {

                loc = {
                    lat: Number(el.lng),
                    lng: Number(el.lat),
                }
            } else if (el.city_data) {

                loc = {
                    lat: Number(el.city_data.Latitude),
                    lng: Number(el.city_data.Longitude),
                }
            } else if (el.latitude && el.longitude) {
                loc = {
                    lat: Number(el.longitude),
                    lng: Number(el.latitude),
                    
                }
            } else if (el.business_lat && el.business_lng) {
                loc = {
                    lat: Number(el.business_lat),
                    lng: Number(el.business_lng),
                }
            } else if (el.pickupLocation && el.pickupLocation.geoLocation.latitude && el.pickupLocation.geoLocation.longitude) {
                loc = {
                    lat: Number(el.pickupLocation.geoLocation.latitude),
                    lng: Number(el.pickupLocation.geoLocation.longitude),
                }
            }else if (el.basicPropertyInfo && el.basicPropertyInfo.position.latitude && el.basicPropertyInfo.position.longitude) {
                loc = {
                    lat: Number(el.basicPropertyInfo.position.latitude),
                    lng: Number(el.basicPropertyInfo.position.longitude),
                }
            }
            
            console.log('loc: ',el, loc, list);
            //{ lat: Number(el.lat), lng: Number(el.lng) }
            return (
                <Marker
                    key={i}
                    // key={el.classifiedid} 
                    position={loc} />
            )
        })
    }

    // getAddress = (latitude, longitude) => {
    //     
    //     return new Promise(function (resolve, reject) {
    //         var request = new XMLHttpRequest();

    //         var method = 'GET';
    //         var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true';
    //         var async = true;

    //         request.open(method, url, async);
    //         request.onreadystatechange = function () {
    //             if (request.readyState == 4) {
    //                 if (request.status == 200) {
    //                     var data = JSON.parse(request.responseText);
    //                     
    //                     var address = data.results[0];
    //                     
    //                     resolve(address);
    //                 }
    //                 else {
    //                     reject(request.status);
    //                 }
    //             }
    //         };
    //         request.send();
    //     });
    // };

    render() {
        const { list, className } = this.props;
        let defaultLocation = { lat: -27.51659, lng: 152.98373 }
        if (Array.isArray(list) && list.length) {
            console.log("list", list)
            if (list[0].lat !== undefined && list[0].lng !== undefined) {
                defaultLocation = { lat: Number(list[0].lat), lng: Number(list[0].lng) }
            } else if (list[0].city_data) {
                defaultLocation = { lat: Number(list[0].city_data.Latitude), lng: Number(list[0].city_data.Longitude) }
            } else if (list[0].latitude && list[0].longitude) {
                defaultLocation = { lat: Number(list[0].latitude), lng: Number(list[0].longitude) }
            } else if (list[0].business_lat && list[0].business_lng) {
                defaultLocation = { lat: Number(list[0].business_lat), lng: Number(list[0].business_lng) }
            } else if (list[0].pickupLocation && list[0].pickupLocation.geoLocation.latitude && list[0].pickupLocation.geoLocation.longitude) {
                defaultLocation = { lat: Number(list[0].pickupLocation.geoLocation.latitude), lng: Number(list[0].pickupLocation.geoLocation.longitude) }
            }else if (list[0].basicPropertyInfo && list[0].basicPropertyInfo.position.latitude && list[0]. basicPropertyInfo.position.longitude) {
                defaultLocation = { lat: Number(list[0].basicPropertyInfo.position.latitude), lng: Number(list[0].basicPropertyInfo.position.longitude) }
            }
            // this.getAddress(Number(list[0].lat), Number(list[0].lng)).then(console.log).catch(console.error);
                // defaultLocation = { lat: Number(list[0].lat), lng: Number(list[0].lng) }
            {console.log("defaultLocation", defaultLocation)}

        }
        const MyMapComponent = compose(
            withProps({
                googleMapURL: GOOGLE_MAP_KEY,
                loadingElement: <div style={{ height: `100%` }} />,
                containerElement: <div className={className} style={{ height: `272px` }} />,
                mapElement: <div style={{ height: `100%`, width: '100%' }} />
            }),
            withScriptjs,
            withGoogleMap
        )(props => (
            <GoogleMap defaultZoom={10} defaultCenter={defaultLocation}>
                {this.rendermarker(list)}
            </GoogleMap>
        ));

        return (
            <MyMapComponent />
        )
    }
}