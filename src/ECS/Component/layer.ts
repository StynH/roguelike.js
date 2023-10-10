import {Component} from "./component";
import {LayerType} from "../../Enum/layertype";

export class Layer extends Component{

    constructor(public layer: LayerType) {
        super();
    }

}
