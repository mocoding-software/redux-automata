import * as React from 'react';
import * as Redux from 'redux';
import { Provider } from "react-redux";

import { IResponseState } from './fetch-automata';
import View from './view';

interface IAppProps {
    store: Redux.Store<IResponseState>;
}

export default class App extends React.Component<IAppProps, {}> {
    public render(): JSX.Element {
        return (
            <Provider store={this.props.store} key="provider">
            <View />
            </Provider>
        );
    }
}

