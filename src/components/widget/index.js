import {h, render , Component} from 'preact';
import widget_style from './widget_style.less'

export default class Widget extends Component {

    constructor(props){
        super(props);

        this.state = {
            scrolling: false,
            position: this.props.originalheight,
            selected:false,
            clicked:false,
            swap:false,
            swapother:false,
            repositionY:this.props.originalheight,
            repositionX:this.props.howleft
        }

        this.scrollNoticeTouch = this.scrollNoticeTouch.bind(this);
        this.ifScrolling = this.ifScrolling.bind(this);
        this.notTouching = this.notTouching.bind(this);
        this.rearranging = this.rearranging.bind(this);

        document.addEventListener('mousedown', this.scrollNoticeTouch);
        document.addEventListener('mousedown', this.rearrangeNoticeTouch)
        document.addEventListener('mousemove', this.ifScrolling);
        document.addEventListener('mousemove', this.rearranging);
        document.addEventListener('mouseup', this.notTouching);
           
        this.startclick = this.startclick.bind(this);
        this.rearrangeNoticeTouch = this.rearrangeNoticeTouch.bind(this)
        this.checkclick = this.checkclick.bind(this);
        this.toBeginning =this.toBeginning.bind(this);
    }


    ///////////////////////////////////////////////////////////////////////////////
    //this section is dedicated to the opening of a widget

    //detecting someone pressing the widget and prepares accordingly
    startclick(event){
        this.setState({
            originalposition: this.state.position,
            selected:true,
        })

        //this is used to check if user has selected and held still for 4 seconds and switches to rearrange mode

    }
    
    //this checks when the user has let go and whether it has just been a click without activating other functions 
    checkclick(event){
        if ((this.state.selected == true)&&(this.state.swap==false)){
            if (this.state.originalposition == this.state.position){
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
        
        
        setTimeout(() => {

            if ((this.state.selected == false)&&(this.state.swap==false)&&(this.state.clicked==false)){
                this.setState({
                    scrolling: false,
                    swapother:true
                })
            }
        }, 2000);

    }

    //checks to see if the user is dragging their finger accross the screen 
    ifScrolling(event){
        if (this.state.scrolling == true){
            const changeY = event.clientY-this.state.yinitial   //calculates how much the user is scrolling
            const newposition =  this.state.position + changeY
            this.setState({
                yinitial: event.clientY,   
                position: newposition 
            })
        }
    }



    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //this section is dedicated to the rearrangement function of the application 

    rearrangeNoticeTouch(event){
        this.setState({
            xinitial: event.clientX,
            yinitial: event.clientY
            
        })

        setTimeout(() => {

            if ((this.state.selected == true)&&(this.state.swap==false)&&(this.state.clicked==false)){
                this.setState({
                    swap:true,
                    scrolling: false,
                })
            }
        }, 2000);
    }
    


    //this code is the code resonsible allowing the user to rearrange widgets 
    rearranging(event) {
        console.log(this.state.repositionX)
        if (this.state.swap == true) {
            
            const changeY = event.clientY-this.state.yinitial
            const changeX = event.clientX-this.state.xinitial

            const newpositionY =  this.state.repositionY + changeY
            const newpositionX =  this.state.repositionX + changeX

            console.log(this.state.repositionX)
            

            this.setState({
                yinitial: event.clientY,
                xinitial:event.clientX,
                repositionY: newpositionY,
                repositionX: newpositionX,
            })
        }
    }



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
            scrolling: false,
            swap:false
        })
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////
    //the render function allowing for widget to be generated
    render(){
        const {position,repositionY, repositionX, clicked, swap} = this.state
        const {howleft, input, clickeddata} = this.props

        return(
            <div>



            {( (clicked === false) && (swap == false )) && (
                <div class = {widget_style.box} 
                    style={{position: "absolute", top: position, left:howleft }}
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
