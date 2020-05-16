import * as React from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  Progress,
  Row,
  Jumbotron,
  Container,
} from "reactstrap";
import * as Redux from "redux";
import { Statechart } from "../basic/Statechart";
import { Fetch, Refresh, ResponseState, fetchAutomata } from "./fetch-automata";
import { ApplicationState } from "./store";

import "bootstrap/dist/css/bootstrap.css";

const { connect } = require("react-redux");

interface ViewProps {
  response: ResponseState;
  canRefresh: boolean;
  load: () => void;
  refresh: () => void;
}

@connect(
  (state: ApplicationState) => ({
    response: state.response,
    canRefresh: Refresh.isInvocable(state.response),
  }),
  (dispatch: Redux.Dispatch<any>) => ({
    load: () => dispatch(Fetch()),
    refresh: () => dispatch(Refresh()),
  }),
)
class App extends React.Component<ViewProps> {
  public componentDidMount() {
    this.props.load();
  }

  public render(): JSX.Element {
    const { response } = this.props;
    const isFetching = response.isFetching || (!response.data && !response.error);

    const body = isFetching
      ? this.onRenderLoading()
      : response.error
      ? this.onRenderError()
      : this.onRenderData();

    return (
      <Container fluid>
        <Row>
          <Col md={6}>
            <Jumbotron>
              <h1>Redux Automata - Fetch Example</h1>
              <p>
                This example shows fetching remote data from server. We are fetching data
                from GitHub.
              </p>
              {body}
              <p>
                This button stays enabled all the time. So nothing prevents you from
                clicking on it several times. But since Refresh is not availible in
                Fetching state - nothing happens.
              </p>
              <Button color="primary" onClick={this.props.refresh}>
                Refresh
              </Button>
              <br />
              <br />
              <p>
                This button is disabled depending on availability of specific actions on
                current state.
              </p>
              <Button
                color="success"
                disabled={!this.props.canRefresh}
                onClick={this.props.refresh}
              >
                Refresh
              </Button>
            </Jumbotron>
          </Col>
          <Col md={6}>
            <Jumbotron>
              <h1>Statechart</h1>
              <Statechart automata={fetchAutomata} />                            
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    );
  }

  public onRenderError(): JSX.Element {
    const { error } = this.props.response;
    return (
      <Alert bsStyle="danger">
        <h4>Request failed!</h4>
        <p>{error}</p>
      </Alert>
    );
  }

  public onRenderLoading(): JSX.Element {
    return <Progress value={66} />;
  }

  public onRenderData(): JSX.Element {
    const { data } = this.props.response;
    return (
      <Jumbotron bsSize="large">        
        <Row style={{ textAlign: "center" }}>
          <Col xs={4}>
            Watchers <Badge>{data?.watchers_count}</Badge>
          </Col>
          <Col xs={4}>
            Stars <Badge>{data?.stargazers_count}</Badge>
          </Col>
          <Col xs={4}>
            Forks <Badge>{data?.forks_count}</Badge>
          </Col>
        </Row>
      </Jumbotron>
    );
  }
}

export { App };
