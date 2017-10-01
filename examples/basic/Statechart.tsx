import { Automata } from "redux-automata";
// tslint:disable-next-line:no-var-requires
const Graph = require("react-graph-vis").default;
import * as React from "react";

export interface StatechartProps {
    automata?: Automata<any>;
}

export class Statechart extends React.Component<StatechartProps, any> {
    render() {

        const nodes = this.props.automata.getGraph();

        const graph = {
            nodes: nodes.map(node => ({
                color: this.props.automata.current.__sm_state === node.entry.stateName ? "#e0df41" : "#41e0c9",
                id: node.entry.stateName,
                label: node.entry.stateName,
            })),
            edges: nodes.reduce((arr, node) => {
                const edges = node.actions.map(action => ({
                    from: node.entry.stateName,
                    to: action.targetState
                }));
                return arr.concat(...edges);
            }, [])
        };

        const options = {
            physics: {
                enabled: false
            },
            layout: {
                hierarchical: false
            },
            edges: {
                color: "#000000"
            }
        };

        const events = {};

        return (
            <Graph graph={graph} options={options} events={events} style={{ height: "320px" }} />
        );
    }
}
