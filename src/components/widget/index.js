import {h, render , Component} from 'preact';

export default class Widget extends Component {
    constructor(element, coordinates){
        this.element = element 
        this.coordinates = coordinates
    }

    render(){

        return(
            <div>
                <p>
                    This is a test, this is a test, this is a test
                </p>
            </div>
        )

    }
}