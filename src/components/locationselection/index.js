import {h, render , Component} from 'preact';
import locationselction_styles from './locationselection.less'

export default class LocationSelectionButton extends Component{

    constructor(props){
        super(props)
        this.state = {
            scrolling:false,
            positionY:70,
            changing: true
        }

        this.scrollNoticeTouch = this.scrollNoticeTouch.bind(this)
        this.ifScrolling = this.ifScrolling.bind(this)
        this.notTouching = this.notTouching.bind(this)
        this.changeLocation = this.changeLocation.bind(this)
        this.buttonclicked = this.buttonclicked.bind(this)

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
    buttonclicked(){
        this.setState({
            changing:true
        })
    }

    changeLocation(city){
        this.setState({changing:false})
        this.props.function(city)
    }



    render(){
        let {defaultLocation} = this.props
        let {changing} = this.state
        let time = Date()

        return(
            <div>
                {(changing === false)&&(<div class= {locationselction_styles.box} style={{position: "absolute", top: this.state.positionY }}>
                    <div>
                        {defaultLocation}
                        <br></br>{time.slice(0,15)}
                    </div>
                    
                        <button onClick={this.buttonclicked}>
                            Change Home Location
                        </button>
                    </div>
                )}

                {(changing === true)&&(
                    <div >
                        <img class = {locationselction_styles.map} width= {800}  alt = "map" src = './../../assets/worldmap/worldmap.jpg'></img>
                        <img class = {locationselction_styles.location} style={{transform: "translate(57pt, 183pt) rotateZ(90deg)"}} width ={40} src='./../../assets/icons/city.png' onClick={() => this.changeLocation("London")}></img>
                        <img class = {locationselction_styles.location} style={{transform: "translate(30pt, 376pt) rotateZ(90deg)"}} width ={40} src='./../../assets/icons/city.png' onClick={() => this.changeLocation("Beijing")}></img>
                        <img class = {locationselction_styles.location} style={{transform: "translate(-103pt, 425pt) rotateZ(90deg)"}} width ={40} src='./../../assets/icons/city.png' onClick={() => this.changeLocation("Melbourne")}></img>
                        <img class = {locationselction_styles.location} style={{transform: "translate(-60pt, 110pt) rotateZ(90deg)"}} width ={40} src='./../../assets/icons/city.png' onClick={() => this.changeLocation("Brasilia")}></img>

                    </div>
                )}
            </div>
        )
    }
}