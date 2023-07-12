import React, { Component } from 'react';
import {convertHTMLToText, displayTitle } from './index';

class ShowDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: 'Show More',
            buttonShow: false,
            charctersLimits: 150,
        };
    }

    /**
     * @method:  onClick
     * @desc: On clicking on show more and show less
     */
    handleShowMore = () => {
        if (this.state.buttonShow) {
            this.setState({
                buttonShow: !this.state.buttonShow,
                buttonText: 'Show More',
            });
        } else {
            this.setState({
                buttonShow: !this.state.buttonShow,
                buttonText: 'Show Less',
            });
        }
    }

    /**
    * @method:  componentDidMount
    * @desc: Called after mounting component
    */
    componentDidMount() {
        if (this.props.text.length < this.state.charctersLimits) {
            this.setState({
                buttonShow: false
            });
        }
    }

    /**
     * @method:  renderDescription
     * @desc: display the given text as per charcter limits
     */
    renderDescription = (text) => {
        if (text.length < this.state.charctersLimits) {
            return (
                <div>
                    {convertHTMLToText(text)}
                </div>
            );
        } else {
            const tempString = text.substr(0, this.state.charctersLimits);
            return (
                    <>
                        <div>{(this.state.buttonShow == true) ? convertHTMLToText(text) : `${tempString}......`} </div>
                        <a onClick={this.handleShowMore} >
                            <div className=" show-more" >{this.state.buttonText} <span className={this.state.buttonicons}></span > </div>
                            {this.state.buttonText === 'Show More' && (
                                <div></div>
                            )}
                        </a>
                    </>
                    
               
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderDescription(displayTitle(this.props.text))}
            </div>
        );
    }
}

export default ShowDescription