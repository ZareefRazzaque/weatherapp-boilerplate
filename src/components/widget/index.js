import {h, render , Component} from 'preact';
import widget_style from './widget_style.less'
import 'regenerator-runtime'

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
        this.rearrangingfinish = this.rearrangingfinish.bind(this)

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


            startX: event.clientX,
            startY: event.clientY
        })

        if (this.state.swap == true){
            this.setState({

                repositionY: this.state.positionY,
                repositionX: this.state.positionX,
            })
        }

        console.log(this.state.startX, this.state.startY)
        setTimeout(() => {
            //note whether the item is selected is determined by the first funciton which handles opening and closing apps
            if  ((this.state.swapother == false)&&(this.state.swap==false)&&(this.state.clicked==false) && (this.state.xinitial == event.clientX) && (this.state.yinitial == event.clientY)) {    
                if ((this.state.selected == true)){
                    this.setState({
                        swap:true,
                        scrolling: false,
                        newpositionY:this.state.positionY,
                        repositionY:this.state.positionY
                    })
                }

                else if (this.state.selected == false){
                    this.setState({
                        scrolling: false,
                        swapother:true
                    })
                }
            }
        }, 3000);
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
    
    }

    rearrangingfinish(event){
        if (this.state.swap == true){
            


            if ((340>this.state.repositionX)&&(this.state.repositionX>-115)){

                let Ycheck = this.state.universalpointY+200
                while (this.state.repositionY > Ycheck){
                    Ycheck = Ycheck+ 270
                }

                const newpositionY = Ycheck - 200
                this.setState({
                    positionY: newpositionY,
                    reposiitonY:newpositionY
                })


                if (this.state.repositionX >110){
                    this.setState({
                        positionX:220,
                        repositionX:220
                    })
                }
                else{
                    this.setState({
                        positionX:20,
                        repositionX:20
                    })
                }
            }
        }

        if (this.state.swapother == true){
            var endX = event.clientX
            var endY = event.clientY

            var changeX = endX - this.state.startX
            var changeY = endY - this.state.startY


            if (((20<this.state.startX)&&(this.state.startX<200))||((220<this.state.startX)&&(this.state.startX<380))){
                
                var checkY = this.state.universalpointY
                while ((this.state.startY - checkY)>250){
                    checkY= checkY + 270
                }
                var startposY = checkY 


                if ((this.state.startY - checkY)>0){

                    if ((20<this.state.startX)&&(this.state.startX<200)){
                        this.setState({
                            startX: 20
                        })
                    }
                    
                    
                    else if ((220<this.state.startX)&&(this.state.startX<380)) {
                        
                        this.setState({
                            startX:220
                        })
                    }

                    endX = this.state.startX + changeX
                    endY = this.state.startY + changeY

                    console.log(endX, endY)

                    var checkY = this.state.universalpointY
                    while ((endY - checkY)>250){
                        checkY= checkY + 270
                    }
                    var endposY = checkY 

                    if (endX > 110){
                        endX = 220
                    }
                    else{
                        endX = 20
                    }
                    

                    if ((endX == this.state.positionX) && (endposY == this.state.positionY)){

                        console.log("working")
                        console.log()
                        this.setState({
                            positionY: startposY,
                            positionX: this.state.startX
                        })
                    }
                    

                    /*
                    this.setState({nd
                        positionY:checkY,
                        positionX:this.state.startX
                    })*/

                }
            } 
        }


        this.setState({
            swap:false,
            swapother:false
        })

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
            selected:false,
            scrolling: false,

        })
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
