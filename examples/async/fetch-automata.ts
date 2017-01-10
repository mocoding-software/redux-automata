import * as Redux from "redux";
import { Automata } from 'redux-automata';

export interface IResponseState {
    isFetching?: boolean;
    error?: string;
    data?: GithubResposne;
}

export interface GithubResposne {
    id: number;
    name: string;
    description: string
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    watchers: number;
    subscribers_count: number;
}

const automata = new Automata<IResponseState>("FetchAutomata");

//states
const Idle = automata.State("Idle", () => ({}));
const Fetching = automata.State("Fetching", () => ({ isFetching: true }));
const Fetched = automata.State<GithubResposne>("Fetched", (state, data) => ({ data: data }));
const FetchingFailed = automata.State<string>("Fetching Calendars Failed", (state, error) => ({ error }));

//actions
const Fetch = automata.Action('Fetch');
const Refresh = automata.Action('Refresh');
const RequestSucceeded = automata.Action<GithubResposne>("Request Succeeded");
const RequestFailed = automata.Action<string>("Request Failed");

//transitions
const FetchData = (dispatch: Redux.Dispatch<any>) =>
    fetch("http://api.github.com/repos/mocoding-software/redux-automata")
        .then(response => {
            response.text().then(text => {
                const data = JSON.parse(text);
                if (response.status == 200) {                               
                    //dispatch(RequestSucceeded(data));
                    //small delay to see a loader
                    setTimeout(()=>dispatch(RequestSucceeded(data)), 1000);
                }
                else
                    dispatch(RequestFailed("Failed to get data from GitHub. Status Code: " + response.status + ". Message: " + data.message));
            });
        })
        .catch(_ => dispatch(RequestFailed(JSON.stringify(_))));

automata
    .In(Idle)
        .On(Fetch)
            .Execute(FetchData)
            .GoTo(Fetching)
    .In(Fetching)
        .On(RequestSucceeded)
            .GoTo(Fetched)
        .On(RequestFailed)
            .GoTo(FetchingFailed)
    .In(FetchingFailed)
        .On(Fetch)
            .Execute(FetchData)
            .GoTo(Fetching)
        .On(Refresh)
            .Execute(FetchData)
            .GoTo(Fetching)
    .In(Fetched)
        .On(Refresh)
            .Execute(FetchData)
            .GoTo(Fetching)

automata.BeginWith(Idle);

export {
    automata as fetchAutomata,
    Fetch,
    Refresh
}