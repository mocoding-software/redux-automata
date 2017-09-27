import * as React from "react";
import { Provider } from "react-redux";
import * as Redux from "redux";

import { ResponseState } from "./fetch-automata";
import View from "./view";

interface AppProps {
    store: Redux.Store<ResponseState>;
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
