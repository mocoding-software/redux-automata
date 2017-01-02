import { Automata } from './index';
import {
    IStateMachineOptions,
    IStateOptions,
    IActionOptions,
    IStateOptionsEx,
    INodeBuilder,
    IEdgeBuilder,
    ActionFunction,
    StateFunction,
    Transition,
    Node, Edge,
  } from './common';


export class StateBuilder<TState> implements IStateOptions<TState>, INodeBuilder<TState> {

    builders: IEdgeBuilder<TState>[] = [];

    constructor(
        public state: StateFunction<TState, any>, 
        public machine: IStateMachineOptions<TState>) {
    }

    On<TAction>(action: ActionFunction<TAction>): IActionOptions<TState, TAction> {
        var builder = new ActionBuilder<TState, TAction>(action.actionType, this);
        this.builders.push(builder);
        return builder;
    }

    ToNode(): Node<TState> {
        const edges = this.builders
            .map(_ => _.ToEdge())
            .reduce<Edge<TState>[]>((edges, edge) => {
                if (edges.findIndex(_ => _.actionType == edge.actionType) === -1)
                    edges.push(edge);
                return edges;
            }, []);

        const node: Node<TState> = {
            stateName: this.state.stateName,
            entry: this.state,
            actions: edges
        }        
                
        return node;
    }
}

export class ActionBuilder<TState, TAction> implements IActionOptions<TState, TAction>, IEdgeBuilder<TState> {
    
    private transitions: Transition<TAction>[] = [];
    private targetState: string;

    constructor(public name: string, public builder: StateBuilder<TState>) {

    }

    GoTo(state: StateFunction<TState, TAction>): IStateOptionsEx<TState> {       
        this.targetState = state.stateName;
        return new StateBuilderEx(this.builder);
    }

    Execute(transition: Transition<TAction>): IActionOptions<TState, TAction> {
       this.transitions.push(transition);
        return this;
    }    

    ToEdge(): Edge<TState> {
        return {
            actionType: this.name,
            targetState: this.targetState,            
            transitions: this.transitions
        }
    }
}

class StateBuilderEx<TState> implements IStateOptionsEx<TState> {
    constructor(private builder: StateBuilder<TState>) { }

    In(state: StateFunction<TState, any>): IStateOptions<TState> {
        return this.builder.machine.In(state);
    }
    
    On<TAction>(actionFunc: ActionFunction<TAction>): IActionOptions<TState, TAction> {
        return this.builder.On(actionFunc);
    }
}