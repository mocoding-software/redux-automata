import * as React from "react";
import { Provider } from "react-redux";
import * as Redux from "redux";

import { State } from "./basic-automata";
import View from "./view";

interface AppProps {
    store: Redux.Store<State>;
}

export default class App extends React.Component<AppProps, {}> {
    public render(): JSX.Element {
        return (
            <Provider store={this.props.store} key="provider">
            <View />
            </Provider>
        );
    }
}
