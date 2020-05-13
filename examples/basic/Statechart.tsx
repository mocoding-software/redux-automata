import * as React from "react";
import { Automata } from "redux-automata";
import Graph from "react-graph-vis";

export interface StatechartProps {
  automata: Automata<any>;
}

interface Edge {
  from: string;
  to?: string;
}

export class Statechart extends React.Component<StatechartProps, any> {
  render() {
    const nodes = this.props.automata.getGraph();

    const graph = {
      nodes: nodes.map((node) => ({
        color:
          this.props.automata.current.__sm_state === node.entry.stateName
            ? "#e0df41"
            : "#41e0c9",
        id: node.entry.stateName,
        label: node.entry.stateName,
      })),
      edges: nodes.reduce((arr: Edge[], node) => {
        const edges: Edge[] = node.actions.map((action) => ({
          from: node.entry.stateName,
          to: action.targetState,
        }));
        return arr.concat(...edges);
      }, []),
    };

    const options = {
      physics: {
        enabled: false,
      },
      layout: {
        hierarchical: false,
      },
      edges: {
        color: "#000000",
      },
    };

    const events = {};

    return (
      <Graph
        identifier="automata-graph"
        graph={graph}
        options={options}
        events={events}
        style={{ height: "320px" }}
      />
    );
  }
}
