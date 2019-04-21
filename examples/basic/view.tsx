import * as React from "react";
import { Alert, Badge, Button, Col, Glyphicon, ProgressBar, Row, Well } from "react-bootstrap";
import * as Redux from "redux";
import { CanInvokeCapabilities } from "redux-automata";
import { basicAutomata, State, Toggle } from "./basic-automata";
import { Statechart } from "./Statechart";

const { connect } = newFunction();

interface ViewProps {
    switcher?: State;
    toggle?: () => void;
}

@connect(
    (state: State) => ({ switcher: state }),
    (dispatch: Redux.Dispatch<any>) => ({ toggle: () => dispatch(Toggle(null)) })
)
class View extends React.Component<ViewProps, {}> {
    public render(): JSX.Element {
        return (
            <div>
                <div className="container">
                    <Well bsSize="large">
                        <h1>{this.props.switcher ? this.props.switcher.message : ""}</h1>
                        <Button bsStyle="success" onClick={this.props.toggle}>Toggle</Button>
                    </Well>
                    <Well bsSize="large">
                        <h1>Statechart</h1>
                        <Statechart automata={basicAutomata} />
                    </Well>
                </div>
            </div>
        );
    }
}

export default View;
function newFunction(): { connect: any; } {
    return require("react-redux");
}
