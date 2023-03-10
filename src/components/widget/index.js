import {h, render , Component} from 'preact';
import widget_style from './widget_style.less'

export default class Widget extends Component {


    render(){
        let element = this.props.element
        return(
            <div class = {widget_style.box}>
                <p>
                    This is a test, this is a test, this is a test
                    {element}
                </p>
            </div>

        )

    }
}