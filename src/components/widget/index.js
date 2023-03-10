import {h, render , Component} from 'preact';

export default class Widget extends Component {


    render(){
        let element = this.props.element
        return(
            <div>
                <p>
                    This is a test, this is a test, this is a test
                </p>
            </div>
        )

    }
}