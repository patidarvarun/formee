import React, { Fragment } from 'react';
import { Steps } from 'antd';
import StepFirst from './StepFirst';
import StepSecond from './StepSecond';
const { Step } = Steps;

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            bussiness: false
        };
    }

    /**
     * @method next
     * @description called to go next step
     */
    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { current } = this.state;
        const steps = [
            {
                title: 'Step First',
                content: <StepFirst nextStep={() => this.next()} callNext={(isBussiness) =>
                    this.setState({
                        bussiness: isBussiness,
                    })
                } />,
            },
            {
                title: 'Step Second',
                content: <StepSecond next={() => this.setState({ current: this.state.current + 1 })} bussiness={this.state.bussiness} />,
            },
        ];
        return (
            <Fragment>
                <div className='wrap pb-40 signup-box'>
                    <div className='steps-content'>{steps[current].content}</div>
                    {/* <Steps progressDot current={current}>
                        {steps.map(item => (
                            <Step key={item.title} />
                        ))}
                    </Steps> */}
                </div>
            </Fragment>
        )
    }
}

export default SignUp
