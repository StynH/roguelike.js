import {Component} from "../component";

export class DebugScan extends Component {

    constructor(public interval: number = 0, public counter: number = 0, public range: number = 1) {
        super();
    }

}
