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
            clicked:false,
            swap:false,
            swapother:false

        }


        this.noticeTouch = this.noticeTouch.bind(this);
        this.ifScrolling = this.ifScrolling.bind(this);
        this.notTouching = this.notTouching.bind(this);
        this.rearranging = this.rearranging.bind(this);

        document.addEventListener('mousedown', this.noticeTouch);
        document.addEventListener('mousemove', this.ifScrolling);
        document.addEventListener('mouseup', this.notTouching);
        document.addEventListener('mousedown', this.rearranging);
        
        this.startclick = this.startclick.bind(this);
        this.checkclick = this.checkclick.bind(this);
        this.toBeginning =this.toBeginning.bind(this);
    }


    ///////////////////////////////////////////////////////////////////////////////

    //these functions are for clicking and opening and checking if that specifc item is beong swappped with
    startclick(event){
        this.setState({
            originalposition: this.state.position,
            selected:true
        })

        setTimeout(() => {

            if ((this.state.selected == true)&&(this.state.swap==false)&&(this.state.clicked==false)){
                console.log('canceled scroll')
                this.setState({
                    swap:true,
                    scrolling: false,
                })
            }
        }, 4000);
    }
    
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
    //this functions are for scrolling 

    //checks to see if the user has touched the screen (explicitly used for scrolling)
    noticeTouch(event){
        this.setState({
            scrolling:true,
            yinitial: event.clientY //takes details of where the user touched the screen
        });
        
        if (this.state.swap == false) 
        setTimeout(() => {

            if ((this.state.selected == false)&&(this.state.swap==false)&&(this.state.clicked==false)){
                console.log('canceled scroll')
                this.setState({
                    scrolling: false,
                    swapother:true
                })
            }
        }, 4000);

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


    rearranging(event) {
        if (this.state.swap == true) {
            console.log('swap active')
            const rearrangeY = event.clientY-this.state.yinitial   //calculates how much the user is scrolling
            const newposition =  this.state.position + changeY
        }
    }



    //when this is called the user is no longer touching the screen  
    notTouching(event){
        this.setState({
            scrolling: false,
            swap:false
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////
    //this sets the widget to go back to the home page
    //sets the state to return to the homepage
    toBeginning(){
        this.setState({
            clicked:false
        })
    }


    render(){
        const {position, clicked, swap} = this.state
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
                    style={{position: "absolute", top: position, left:howleft }}
                    onMouseDown={this.startclick}
                    onMouseUp={this.checkclick}
                >
                        {input}

                </div>
            )

            }
            
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
