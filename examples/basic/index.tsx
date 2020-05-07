import * as React from "react";
import { Button, Container, Jumbotron } from "reactstrap";
import * as Redux from "redux";
import { SwitcherState, Toggle, basicAutomata } from "./basic-automata";
import { Statechart } from "./Statechart";
import { connect } from "react-redux";
import { ApplicationState } from "./store";

import "bootstrap/dist/css/bootstrap.css";

interface AppProps {
  switcher?: SwitcherState;
}

interface AppDispatch {
  toggle?: () => void;
}

class AppInternal extends React.Component<AppProps & AppDispatch> {
  public render(): React.ReactNode {
    return (
      <Container>
        <Jumbotron>
          <h1>{this.props.switcher ? this.props.switcher.message : ""}</h1>
          <Button color="primary"  onClick={this.props.toggle}>
            Toggle
          </Button>
        </Jumbotron>
        <Jumbotron>
          <h1>Statechart</h1>
          <Statechart automata={basicAutomata} />
        </Jumbotron>
      </Container>
    );
  }
}

const App = connect<AppProps, AppDispatch, {}, ApplicationState>(
  (state) => ({ switcher: state.switcher }),
  (dispatch: Redux.Dispatch) => ({ toggle: () => dispatch(Toggle()) }),
)(AppInternal);

export { App };
