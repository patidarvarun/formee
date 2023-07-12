import React, { Component } from 'react';
import Icon from '../customIcons/customIcons';

export default class Back extends Component {

    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        return (
            <span
                className='back-link '
                onClick={this.goBack}
            >
                <Icon icon='arrow-left' size='13' className='mr-3' />
                Back
            </span>
        )
    }
}