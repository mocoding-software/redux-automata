import { Automata } from "../automata";
import {
    IActionFunction,
    IActionOptions,
    IEdge,
    IEdgeBuilder,
    INode,
    INodeBuilder,
    IStateFunction,
    IStateMachineOptions,
    IStateOptions,
    IStateOptionsEx, Transition,
} from "../common";
import { ActionBuilder } from "./ActionBuilder";

export class StateBuilder<TState> implements IStateOptions<TState>, INodeBuilder<TState> {

    public Builders: IEdgeBuilder<TState>[] = [];

    constructor(
        public state: IStateFunction<TState, any>,
        public machine: IStateMachineOptions<TState>) {
    }

    public On<TAction>(action: IActionFunction<TAction>): IActionOptions<TState, TAction> {
        const builder = new ActionBuilder<TState, TAction>(action.actionType, this);
        this.Builders.push(builder);
        return builder;
    }

    public ToNode(): INode<TState> {
        const actions = this.Builders
            .map(_ => _.ToEdge())
            .reduce<IEdge<TState>[]>((edges, edge) => {
                if (edges.findIndex(_ => _.actionType === edge.actionType) === -1)
                    edges.push(edge);
                return edges;
            }, []);

        const node: INode<TState> = {
            actions,
            entry: this.state,
            stateName: this.state.stateName,
        };

        return node;
    }
}