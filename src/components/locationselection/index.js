import {h, render , Component} from 'preact';
import locationselction_styles from './locationselection.less'

export default class LocationSelectionButton extends Component{

    constructor(props){
        super(props)
        this.state = {
            scrolling:false,
            positionY:100
        }

        this.scrollNoticeTouch = this.scrollNoticeTouch.bind(this)
        this.ifScrolling = this.ifScrolling.bind(this)
        this.notTouching = this.notTouching.bind(this)
        this.changeLocation = this.changeLocation.bind(this)

        document.addEventListener('mousedown', this.scrollNoticeTouch)
        document.addEventListener('mousemove', this.ifScrolling)
        document.addEventListener('mouseup', this.notTouching)


    }

    
    ///////////////////////////////////////////////////////////////////////////////////////
    //this section is dedicated to the scrolling of the title

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
            this.setState({
                yinitial: event.clientY,   
                positionY: newposition ,
            })
        }
    }

    //this stops scrolling when the user stops touching 
    notTouching(event){
        this.setState({
            scrolling: false,

        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //this is dedicated to the changing location fucntion
    changeLocation(city){
        this.props.function(city)
    }



    render(){
        let {defaultLocation} = this.props
        let time = Date()

        return(
            <div class= {locationselction_styles.box} onClick={() => this.changeLocation("New York")} style={{position: "absolute", top: this.state.positionY }}>
                {defaultLocation}
                <br></br>{time.slice(0,15)}
            </div>
        )
    }
}