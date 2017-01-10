import { } from '../../src';
import * as Redux from 'redux';
import * as React from "react";
import { Alert, ProgressBar, Well, Button, Badge, Glyphicon, Col, Row } from "react-bootstrap";
import { IState, Toggle } from './basic-automata';
import { ICanInvokeCapabilities } from 'redux-automata';

const { connect } = require('react-redux');

interface IViewProps {
    switcher?: IState;
    toggle?: () => void;
}

@connect(
    (state: IState) => ({ switcher: state }),
    (dispatch: Redux.Dispatch<any>) => ({ toggle: () => dispatch(Toggle(null)) })
)
class View extends React.Component<IViewProps, {}> {
    public render(): JSX.Element {
        return (
            <div>
                <div className="container">
                    <Well bsSize="large">
                        <h1>{this.props.switcher ? this.props.switcher.message : ""}</h1>
                        <Button bsStyle="success" onClick={this.props.toggle}>Toggle</Button>
                    </Well>
                </div>
            </div>
        )
    }
}

export default View;
