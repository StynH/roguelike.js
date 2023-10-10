import {Component} from "./component";
import {Char} from "../../Type/char";

export class Renderable extends Component{

    constructor(public symbol: Char) {
        super();
    }

}
