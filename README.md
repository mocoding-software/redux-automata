<div align="center">
  <a href="https://github.com/mocoding-software/redux-automata">
    <img src="https://raw.githubusercontent.com/mocoding-software/redux-automata/master/icon.png">
  </a>
  <br>
  <br>
</div>

[![npm][npm-image]][npm-url]
[![deps][deps]][deps-url]
[![Build Status][azure-pipelines]][azure-pipelines-url]
[![Coverage][sonar-coverage]][sonar-url]
<br/>

# Finite state machine for Redux

redux-automata - is a Finite State Machine implementation for Redux store. It allows developer to generate Redux reducer automatically based on FST graph object. 
The library was developed to support the following scenarios:
* Provide different behavoiur for the same action depending on current state
* Ignore specific actions while in specific states (or better saying - process actions only in specific states)
* Use declarative approach for defining actions, states and transitions instead of switch-case and if-then-else

## Installation

1. Add package
```
npm i redux-automata --save
```
or

```
yarn add redux-automata
```

2. Add automataMiddleware
```typescript
import { automataMiddleware } from "redux-automata";

...

const store = Redux.createStore(rootReducer, 
    Redux.applyMiddleware(
        automataMiddleware, // adding automata Middleware
        ...
    ));

```
## Example 

<img src="https://github.com/mocoding-software/redux-automata/raw/master/examples/res/switch.png" width="50%" />


The following example is written on Typescript:

```typescript
import * as Redux from "redux";
import { Automata, automataReducer } from 'redux-automata';

export interface State{
    message: string;
}

const automata = new Automata<State>("Counter");

// define states
const Off = automata.state("Off", () => ({ message: "Switched Off" }));
const On = automata.state("On", () => ({ message: "Switched On" }));

// define actions
const Toggle = automata.action("Toggle");

// configure state machine
automata
    .in(Off)
        .on(Toggle)
            .goTo(On)
    .in(On)
        .on(Toggle)
            .goTo(Off);

automata.beginWith(Off);

const reducer = automataReducer(automata);
export {
    reducer,
    Toggle
}
```

In this simple example we configured a state machine with two states and one action. 
The action will lrad to different behaviour depending on current state.
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

## Implemenation & Usage Details

The library defines each state as seperate reducer function that accepts typed argument. The typed argument is dfined by action that leads to that states. 

Redux Automata allows configuring state and actions in declrative way. 
Every state is a reducer function that will be executed on entry. 
Every action is a function that returns action with ```type``` and ```payload```. 

### Creating States
Defining the state is absolutely the same on how reducer is defined.

```typescript
    (state: TState, arg?: TAction): TState;
```

In addition to that you have to specify friendly name for the state. Name should be unique within automata.

#### Examples

```typescript
    // returns empty state
    const Idle = automata.state("Idle", () => ({});
    // returns state with message set to arg
    const MessageSet = automata.state("Message is set", (state, arg) => ({ message: arg });
    // returns state with existing message value and new value for property count.
    const CountSet = automata.state("Count is set", (state, arg) => ({ message: state.message, count: arg })

    /*
        interface State {
            message?: string;
            count?: number;
        }
    */
```

### Creating Actions
Defining action is simlified to define action name (type) and strongly typed argument that is expected to receive as a ```payload```. 

#### Examples

```typescript
    // returns function that accepts <string> and returns { type: "Set Message": payload: "<string>" }
    const SetMessage = automata.action<string>("Set Message");
    // returns function that accepts <number> and returns { type: "Set Count": payload: <number> }
    const SetCount = automata.action<number>("Set Count");    
```

### Creating Transitions
Transition is a function that executed when switching from one state to another. 
Main purpose of transitions is to execute async operations. 
Here is a good example of fetching data from server:

<img src="https://github.com/mocoding-software/redux-automata/raw/master/examples/res/fetch.png" width="50%" />

```typescript

...

const FetchData = (localStore) =>
    apiClient.MakeRequestToServer()
        .then(_ => localStore.dispatch(RequestSucceeded(_))
        .catch(_ => localStore.dispatch(RequestFailed(_)));

...

automata
    .in(Idle)
        .on(Fetch)
            .execute(FetchData) // <-- transition
            .goTo(Fetching)
    .in(Fetching)
        .on(RequestSucceeded)
            .goTo(Fetched)
        .on(RequestFailed)
            .goTo(FetchingFailed)
```

FetchData function will be executed right after automata switched to Fetching state. 
Transitions may be defined using the following signature:

```typescript
    (dispatch: LocalStore<TState>, arg: TAction): void

```

LocalStore is a dispatch function with two properties: ```dispatch``` and ```getState```:
```typescript
/**
 * Local store with own getState and Dispatch methods.
 * IMPORTANT: Since version 3.0 `extends Redux.Dispatch<any>` will be removed.
 */
export interface LocalStore<TState> extends Redux.Dispatch<any> {
    dispatch: Redux.Dispatch<any>;
    getState: () => TState;
}
```

```getState``` always returns current automata state. That makes possible to add additional data related conditions for transitions with async operations.


### Check State Transitions
Sometimes it is useful to know whenever certain actions are "enabled" for specific state. 
Best use case to describe this scenario is to disable button during async request. 
In example above automata is switched to Fetching State so it no longer respond to Fetch action.
To access this functionality you may use canInvoke method that becomes availible on state instance maintained by automata.

```typescript
    
import { ResponseState, Refresh } from './fetch-automata';
import { CanInvokeCapabilities } from 'redux-automata';

const { connect } = require('react-redux');

interface ViewProps {
    response?: ResponseState;
    canRefresh?: boolean;
    refresh?: () => void;
}

@connect(
    (state: ResponseState & CanInvokeCapabilities) => ({
        response: state,
        canRefresh: state.canInvoke(Refresh)
    }),
    (dispatch: Redux.Dispatch<any>) => ({        
        refresh: () => dispatch(Refresh()),
    })
)

...

```

Then Refresh button may be hidden depending on ```canRefresh``` flag.

## Task Automation

Along with ```Automata``` there is a ```TaskAutomata```. ```TaskAutomata``` is aimed to be used with common async operations like fetching data froms server.

```ts

    // reducer
    function fetchDataFromServer() : Promise<Data>{
        ...
    }

    const automata = new TaskAutomata<Data>("Fetch Data", fetchDataFromServer);
    automata.setupProcessIn(automata.Idle);
    automata.beginWith(automata.Idle);

    export const getDataReducer = automataReducer(automata);
    export const LoadData = automata.Start;
    export const RefreshData = automata.Restart;

    ...    

    // view
    interface ViewProps {
        result?: TaskState<Data>;
        isProcessing: boolean;
        error: Error;
        load?: () => void;
        refresh?: () => void;
    }

    @connect(
        state => ({
            result?: state.getData.result
            isProcessing: state.getData.isProcessing;
            error: state.getData.error
        }),
        (dispatch: Redux.Dispatch<any>) => ({        
            load: () => dispatch(LoadData()),
            refresh: () => dispatch(RefreshData()),
        })
    )
    ...

```

This will configure finite automation similar to image below:

<img src="https://github.com/mocoding-software/redux-automata/raw/master/examples/res/task.png" width="50%" />

## Example code
All examples code are located in ```examples``` folder

Run Basic example:
```bash
yarn
yarn run basic
```
Run Async example:
```bash
yarn
yarn run async
```

Every example static content is served from http://localhost:3000 with hot reload.

## Contributions

All source code is located in ```src``` folder.
All tests are located in ```test``` folder.

Run build
```bash
yarn build
```

Run tests
```bash
yarn test
```

## Credits

The library was inspired by [appccelerate/statemachine](https://github.com/appccelerate/statemachine).

## Contact Us

Our website: [http://mocoding.com](http://mocoding.com)

Email: [social@mocoding.com](mailto:social@mocoding.com)

[npm-image]: https://img.shields.io/npm/v/redux-automata.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/redux-automata

[deps]: https://img.shields.io/david/mocoding-software/redux-automata.svg
[deps-url]: https://david-dm.org/mocoding-software/redux-automata

[azure-pipelines]: https://dev.azure.com/mocoding/GitHub/_apis/build/status/mocoding-software.redux-automata?branchName=master
[azure-pipelines-url]: https://dev.azure.com/mocoding/GitHub/_build/latest?definitionId=110&branchName=master

[sonar-url]: https://sonarcloud.io/dashboard?id=mocoding-software_redux-automata

[sonar-coverage]: https://sonarcloud.io/api/project_badges/measure?project=mocoding-software_redux-automata&metric=coverage


License
=======

[The MIT License](https://raw.githubusercontent.com/mocoding-software/redux-automata/master/LICENSE)

COPYRIGHT (C) 2020 MOCODING, LLC
