# Finite state machine for Redux

redux-automata - is a finite state machine based on Redux store. 
It allows developer to generate reducer automatically based on current state. 
The library was developed to support the following scenarios:
* Provide different behavoiur for the same action and avoid massive if-then-else
* Ignore specific actions while in specific states (or better saying - process actions only in specific states)

## Example

Better than any words, please see the code (TypeScript):

```typescript
import * as Redux from "redux";
import { Automata, automataReducer } from 'redux-automata';

export interface IState{
    message: string;
}

const automata = new Automata<IState>("Counter");

// define states
const Off = automata.State("Off", () => ({ message: "Switched Off" }));
const On = automata.State("On", () => ({ message: "Switched On" }));

// define actions
const Toggle = automata.Action("Toggle");

// configure state machine
automata
    .In(Off)
        .On(Toggle)
            .GoTo(On)
    .In(On)
        .On(Toggle)
            .GoTo(Off);

automata.BeginWith(Off);

const reducer = automataReducer(automata);
export {
    reducer,
    Toggle
}
```

In this simple example we configured a state machine with two states and one action. 
The action will cause different behaviour depending on current state.
The similar functionality could be achieved by writing the following reducer:

```typescript
interface State{
    type: string;
    message: string;
}

const initialState = { type: "On", message: "Switched On" };

const reducer = (state = initialState, action) =>{
    switch (state.type)
    {
        case "Off":
            switch (action.type)
            {
                case "Toggle":
                    return { type: "On", message: "Switched On" }
                default:
                    return state;
            }            
        case "On":
            switch (action.type)
            {
                case "Toggle":
                    return { type: "Off", message: "Switched Off" }
                default:
                    return state;
            }
        default: 
            return state;  
    }
}

const Toggle = { type: "Toggle" }

export {
    reducer,
    Toggle
}
```

## Usage Details

Redux Automata allows configuring state and actions in declrative way. 
Every state is a function that will be executed on entry. 
Every action is a function that will lead to generating action with ```type``` and ```payload```. 

### Creating States
Defining state is very similar on how reducer is defined. 
Except you have to specify name of the state and function that returns state based on typed argument and current state.
It uses the same signature as reducer:

```typescript
    (state: TState, arg: TAction): TState;
```

#### Examples

```typescript
    // returns empty state
    const Idle = automata.State("Idle", () => ({});
    // returns state with message set to arg
    const MessageSet = automata.State("Message is set", (state, arg) => ({ message: arg});
    // returns state with existing message value and new value for property count.
    const CountSet = automata.State("Count is set", (state, arg) => ({ message: state.message, count: arg});
```

### Creating Actions
Defining action is simlified to define type and strongly typed argument that is expected to receive as a ```payload```. 

#### Examples

```typescript
    // returns function that accepts <string> and returns { type: "Set Message": payload: "<string>" }
    const SetMessage = automata.Action<string>("Set Message");
    // returns function that accepts <number> and returns { type: "Set Count": payload: <number> }
    const SetCount = automata.Action<number>("Set Count");    
```

### Creating Transitions
Transition is a function that executed when switching from one state to another. 
Main purpose of transitions is to execute async operations. 
Here is a good example of fetching data from server:

#### Examples

```typescript

...

const FetchData = (dispatch) =>
    apiClient.MakeRequestToServer()
        .then(_ => dispatch(RequestSucceeded(_))
        .catch(_ => dispatch(RequestFailed(_)));

...

automata
    .In(Idle)
        .On(Fetch)
            .Execute(FetchData) // <-- transition
            .GoTo(Fetching)
    .In(Fetching)
        .On(RequestSucceeded)
            .GoTo(Fetched)
        .On(RequestFailed)
            .GoTo(FetchingFailed)
```

FetchData function will be executed right after automata gets to Fetching state. 
Sometimes it is easy to lost between what is action, state and transition.
Think this way:
* action - event with argument that is sent to automata
* state - function that transforms event argument to state data
* transtion - any pther business logic that ends up sending events

Transitions may be defined using the following signature:

```typescript
    (dispatch: Redux.Dispatch<any>, arg: TAction): void
```

Please note that transitions do not have and should not have access to store, 
since there is no guarantee that state is not changed during the transition. All parameters should be comming through arguments.

### Can Invoke Capabilities
Sometimes it is useful to know whenever certain actions are enabled for specific state. 
Best use case to describe this scenario is to disable button during async request. 
In example above automata is switched to Fetching State so Fetch becomes not availible.
To access this functionality you may use canInvoke method that becomes availible on state instance maintained by automata.

```typescript
    
import { IResponseState, Refresh } from './fetch-automata';
import { ICanInvokeCapabilities } from 'redux-automata';

const { connect } = require('react-redux');

interface IViewProps {
    response?: IResponseState;
    canRefresh?: boolean;
    refresh?: () => void;
}

@connect(
    (state: IResponseState & ICanInvokeCapabilities) => ({
        response: state,
        canRefresh: state.canInvoke(Refresh)
    }),
    (dispatch: Redux.Dispatch<any>) => ({        
        refresh: () => dispatch(Refresh(null)),
    })
)

...

```

Then Refresh button may be hidden depending on ```canRefresh``` flag.

## Example code
All examples code are located in ```examples``` folder

Run Basic example:
```bash
npm i
npm run basic
```
Run Async example:
```bash
npm i
npm run async
```

Every example static content is served from http://localhost:3000 with hot reload.

## Contributions

All source code is located in ```src``` folder. There is no unit tests yet. 
You may use examples to play with and/or improve existing code base.

## Contact Us

Our website: [http://mocoding.com](http://mocoding.com)

Email: [social@mocoding.com](mailto:social@mocoding.com)