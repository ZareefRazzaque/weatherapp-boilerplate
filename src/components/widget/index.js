import {h, render , Component} from 'preact';
import widget_style from './widget_style.less'

export default class Widget extends Component {

    constructor(props){
        super(props);

        this.state = {
            selected:false,
            scrolling: false,
            clicked:false,
            swap:false,
            swapother:false,

            universalpointX: 20,
            universalpointY: 200,

            positionY: this.props.originalheight,
            positionX: this.props.howleft,

            repositionY:this.props.originalheight,
            repositionX:this.props.howleft
        }

        this.scrollNoticeTouch = this.scrollNoticeTouch.bind(this);
        this.ifScrolling = this.ifScrolling.bind(this);
        this.notTouching = this.notTouching.bind(this);
        this.rearranging = this.rearranging.bind(this);
        this.rearrangeNoticeTouch = this.rearrangeNoticeTouch.bind(this)

        document.addEventListener('mousedown', this.scrollNoticeTouch);
        document.addEventListener('mousedown', this.rearrangeNoticeTouch)
        document.addEventListener('mousemove', this.ifScrolling);
        document.addEventListener('mousemove', this.rearranging);
        document.addEventListener('mouseup', this.notTouching);
        document.addEventListener('mouseup', this.rearrangingfinish)
           
        this.startclick = this.startclick.bind(this);
        this.checkclick = this.checkclick.bind(this);
        this.toBeginning =this.toBeginning.bind(this);
    }


    ///////////////////////////////////////////////////////////////////////////////
    //this section is dedicated to the opening of a widget

    //detecting someone pressing the widget and prepares accordingly
    startclick(event){
        this.setState({
            originalposition: this.state.positionY,
            selected:true,
        })
    }
    
    //this checks when the user has let go and whether it has just been a click without activating other functions 
    checkclick(event){
        if ((this.state.selected == true)&&(this.state.swap==false)){
            if (this.state.originalposition == this.state.positionY){
                this.setState({
                    clicked:true
                })
            }
        }
        this.setState({
            selected:false,
            whenclicked:true,
        })
    }


    ///////////////////////////////////////////////////////////////////////////////////////
    //this section is dedicated to the scrolling of widgets 

    //checks to see if the user has touched the screen (explicitly used for scrolling)
    scrollNoticeTouch(event){
        this.setState({
            scrolling:true,
            yinitial: event.clientY, //takes details of where the user touched the screen
        });
    }

    //checks to see if the user is dragging their finger accross the screen 
    ifScrolling(event){
        if (this.state.scrolling == true){
            const changeY = event.clientY-this.state.yinitial   //calculates how much the user is scrolling
            const newposition =  this.state.positionY + changeY
            const newuniversalpointY = this.state.universalpointY + changeY 
            this.setState({
                yinitial: event.clientY,   
                positionY: newposition ,
                universalpointY:newuniversalpointY
            })
        }
    }



    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //this section is dedicated to the rearrangement function of the application 

    rearrangeNoticeTouch(event){
        this.setState({
            originalposition: this.state.positionY,

            xinitial: event.clientX,
            yinitial: event.clientY,
            repositionY: this.state.positionY,

            startX: event.clientX,
            startY: event.clieentY
        })

        setTimeout(() => {
            //note whether the item is selected is determined by the first funciton which handles opening and closing apps
            if  ((this.state.swap==false)&&(this.state.clicked==false) && (this.state.originalposition == this.state.positionY)) {    
                if ((this.state.selected == true)){
                    this.setState({
                        swap:true,
                        scrolling: false,
                    })
                }

                else if (this.state.selected == false){
                    this.setState({
                        scrolling: false,
                        swapother:true
                    })
                }
            }
        }, 2000);
    }
    


    //this code is the code resonsible allowing the user to rearrange widgets 
    rearranging(event) {
        if (this.state.swap == true) {
            
            const changeY = event.clientY-this.state.yinitial
            const changeX = event.clientX-this.state.xinitial

            const newpositionY =  this.state.repositionY + changeY
            const newpositionX =  this.state.repositionX + changeX

            

            this.setState({
                yinitial: event.clientY,
                xinitial:event.clientX,
                repositionY: newpositionY,
                repositionX: newpositionX,
            })
        }
        
        else if (this.state.swapother == true) {

        }
    
    }

    rearrangingfinish(){}



    ////////////////////////////////////////////////////////////////////////////////////
    //other functions related to either multiple funcions or misc

    //sets the state to return to the homepage
    toBeginning(){
        this.setState({
            clicked:false
        })
    }


    //when this is called the user is no longer touching the screen  
    notTouching(event){
        this.setState({
            selected:false,
            scrolling: false,
            swap:false,
            swapother:false
        })

        console.log(this.state.swap)
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////
    //the render function allowing for widget to be generated
    render(){
        const {positionY, positionX,repositionY, repositionX, clicked, swap} = this.state
        const { input, clickeddata} = this.props

        return(
            <div>

                {( (clicked === false) && (swap == false )) && (
                    <div class = {widget_style.box} 
                        style={{position: "absolute", top: positionY, left:positionX }}
                        onMouseDown={this.startclick}
                        onMouseUp={this.checkclick}
                    >
                            {input}

                    </div>
                )}



                {(swap === true) && (
                    <div class = {widget_style.rebox} 
                        style={{position: "absolute", top: repositionY, left:repositionX }}
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
