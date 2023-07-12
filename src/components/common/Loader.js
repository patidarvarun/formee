import React, { Component } from 'react';

/* loader component  */
export class Loader extends Component {
    
    /**
     * @method render
     * @description render component
     */
    render() {
        return (
            <div className='sf-cstm-loader d-flex align-content-center flex-direction-column'>
                <div className='loader-position spinner-border text-primary' role='status'>
                    <span className='sr-only'>Loading...</span>
                </div>
            </div>
        )
    }
}