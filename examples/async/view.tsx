import { } from '../../src';
import * as Redux from 'redux';
import * as React from "react";
import { Alert, ProgressBar, Well, Button, Badge, Glyphicon, Col, Row } from "react-bootstrap";
import { IResponseState, Fetch, Refresh } from './fetch-automata';
import { ICanInvokeCapabilities } from 'redux-automata';

const { connect } = require('react-redux');

interface IViewProps {
    response?: IResponseState;
    canRefresh?: boolean;
    load?: () => void;
    refresh?: () => void;
}

@connect(
    (state: IResponseState & ICanInvokeCapabilities) => ({
        response: state,
        canRefresh: state.canInvoke(Refresh)
    }),
    (dispatch: Redux.Dispatch<any>) => ({
        load: () => dispatch(Fetch(null)),
        refresh: () => dispatch(Refresh(null)),
    })
)
class View extends React.Component<IViewProps, {}> {

    componentWillMount() {
        this.props.load();
    }

    public render(): JSX.Element {
        const {response} = this.props
        const isFetching = response.isFetching || (!response.data && !response.error);

        const body = isFetching
            ? this.onRenderLoading()
            : (response.error ? this.onRenderError() : this.onRenderData())

        return (
            <div>
                <div className="container">
                    <Well bsSize="large">
                        <h1>Redux Automata - Fetch Example</h1>
                        <p>This example shows fetching remote data from server. We are fetching data from GitHub.</p>
                        {body}
                        <p>This button stays enabled all the time. So nothing prevents you from clicking on it several times. But since Refresh is not availible in Fetching state - nothing happens.</p>
                        <Button bsStyle="primary" onClick={this.props.refresh}>Refresh</Button>
                        <br />
                        <p>This button is disabled depending on availability of specific actions on current state.</p>
                        <Button bsStyle="success" disabled={!this.props.canRefresh} onClick={this.props.refresh}>Refresh</Button>
                    </Well>
                </div>                
            </div>
        )
    }

    onRenderError(): JSX.Element {
        var {error} = this.props.response;
        return (
            <Alert bsStyle="danger">
                <h4>Request failed!</h4>
                <p>{error}</p>
            </Alert>
        );

    }

    onRenderLoading(): JSX.Element {
        return <ProgressBar active now={100} />
    }

    onRenderData(): JSX.Element {
        const { data } = this.props.response;        
        return <Well bsSize="large">
            <Row>
                <Col sm={12}>
                    <h2>{data.name}</h2>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <h3>{data.description}</h3>
                </Col>
            </Row>
            <br />            
            <Row style={{ "text-align": "center" }}>
                <Col xs={4}>
                    <Glyphicon glyph="eye-open" /> Watchers <Badge>{data.watchers_count}</Badge>
                </Col>
                <Col xs={4}>
                    <Glyphicon glyph="star" /> Stars <Badge>{data.stargazers_count}</Badge>
                </Col>
                <Col xs={4}>
                    <Glyphicon glyph="random" /> Forks <Badge>{data.forks_count}</Badge>
                </Col>
            </Row>
        </Well>
    }
}

export default View;
