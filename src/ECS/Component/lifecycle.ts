import {Component} from "./component";
import {LifecycleState} from "../../Type/lifecyclestate";
import {RandomNumberGenerator} from "../../Helper/randomnumbergenerator";

export class Lifecycle extends Component {
    currentState: string;
    turnsRemaining: number;
    states: Record<string, LifecycleState>;

    constructor(initialState: string, states: Record<string, LifecycleState>) {
        super();
        this.currentState = initialState;
        this.states = states;
        this.turnsRemaining = RandomNumberGenerator.randomInt(states[initialState].minDuration, states[initialState].maxDuration);
    }
}
