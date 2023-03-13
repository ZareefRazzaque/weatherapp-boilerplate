import {h, render , Component} from 'preact';
import widget_style from './widget_style.less'

export default class Widget extends Component {

    constructor(props){
        super(props);

        this.state = {
            scrolling: false,
            ychange:0,
            yinitial:0,
            position: this.props.originalheight,
            selected:false,
            clicked:false

        }


        this.noticeTouch = this.noticeTouch.bind(this);
        this.ifScrolling = this.ifScrolling.bind(this);
        this.notTouching = this.notTouching.bind(this);
        document.addEventListener('mousedown', this.noticeTouch);
        document.addEventListener('mousemove', this.ifScrolling);
        document.addEventListener('mouseup', this.notTouching);
        

        
        this.startclick = this.startclick.bind(this);
        this.checkclick = this.checkclick.bind(this);
        this.toBeginning =this.toBeginning.bind(this);
    }


    ///////////////////////////////////////////////////////////////////////////////

    //these functions are for 
    startclick(event){
        this.setState({
            originalposition: this.state.position,
            selected:true
        })


    }
    
    checkclick(event){
        if (this.state.selected == true){
            if (this.state.originalposition == this.state.position){
                this.setState({
                    clicked:true
                })
                console.log(this.state.clicked)
            }
        }
        this.setState({
            selected:false,
            whenclicked:true,
        })
    }

    //checks to see if the user has touched the screen (explicitly used for scrolling)
    noticeTouch(event){
        this.setState({
            scrolling:true,
            yinitial: event.clientY //takes details of where the user touched the screen
        });

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
        }
    }

    //when this is called the user is no longer touching the screen  
    notTouching(event){
        this.setState({
            scrolling: false,
        })
    }

    //sets the state to return to the homepage
    toBeginning(){
        this.setState({
            clicked:false
        })
    }


    render(){
        const {position, clicked} = this.state
        const {howleft, input, clickeddata} = this.props

        return(
            <div>
            {( clicked === false ) && (
                <div class = {widget_style.box} 
                style={{position: "absolute", top: position, left:howleft }}
                onMouseDown={this.startclick}
                onMouseUp={this.checkclick}
                >
                        {input}

                </div>
            )}
            
            {( clicked === true ) && (
                <div class = {widget_style.whole}>

                    <button class = {widget_style.backbutton } onclick = {this.toBeginning}>
                            <img alt='back' src='./../../assets/icons/backarrow.png' width="50" height ="40" ></img>
                    </button>
                        {clickeddata}
                </div>
            )}

            </div>
        )

    }
}
