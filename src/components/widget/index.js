import {h, render , Component} from 'preact';
import widget_style from './widget_style.less'

export default class Widget extends Component {

    constructor(props){
        super(props)

        this.state = {
            scrolling: false,
            ychange:0,
            yinitial:0,
            position:0
        }


        this.noticeTouch = this.noticeTouch.bind(this)
        this.ifScrolling = this.ifScrolling.bind(this)
        this.notTouching = this.notTouching.bind(this)
        document.addEventListener('mousedown', this.noticeTouch)
        document.addEventListener('mousemove', this.ifScrolling)
        document.addEventListener('mouseup', this.notTouching)
        
        console.log("testing")

    }



    //checks to see if the user has touched the screen 
    noticeTouch(event){
        console.log('OMG OMG OMG I SAW THAT')
        this.setState({
            scrolling:true,
            yinitial: event.clientY //takes details of where the user touched the screen

        })

    }

    //checks to see if the user is dragging their finger accross the screen 
    ifScrolling(event){
        if (this.state.scrolling == true){
            const changeY = event.clientY-this.state.yinitial   //calculates how much the user is scrolling
            const newposition =  this.state.position + changeY
            this.setState({
                yinitial: event.clientY,
                ychange: changeY,
                position: newposition 
            })
            console.log(this.state.position)
        }
    }

    //when this is called the user is no longer touching the screen  
    notTouching(event){
        this.setState({
            scrolling: false,
        })
    }






    render(){
        const {ychange, position} = this.state

        let element = this.props.element
        return(
            <div class = {widget_style.box} style={{position: "absolute", top: position }}>
                <p>
                    This is a test, this is a test, this is a test
                    {element}
                    {position}
                </p>
            </div>

        )

    }
}


























