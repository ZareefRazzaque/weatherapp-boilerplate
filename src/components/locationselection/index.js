import {h, render , Component} from 'preact';
import locationselction_styles from './locationselection.less'

export default class LocationSelectionButton extends Component{

    constructor(props){
        super(props)
        this.state = {
            scrolling:false,
            positionY:10,
            changing: false
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
            clicked:true,
            yinitial: event.clientY, //takes details of where the user touched the screen
            xinitial: event.clientX
        });

        setTimeout(() => {
            if  ((this.state.clicked==true) && (this.state.xinitial == event.clientX) && (this.state.yinitial == event.clientY)) {
                this.setState({
                    scrolling:false
                })
            }
        }, 2000);
    }


    //checks to see if the user is dragging their finger accross the screen
    ifScrolling(event){
        console.log("testing")
        if (this.state.scrolling == true){
            const changeY = event.clientY-this.state.yinitial   //calculates how much the user is scrolling
            const newposition =  this.state.positionY + changeY
            this.setState({
                yinitial: event.clientY,
                positionY: newposition,
            })
        }
    }

    //this stops scrolling when the user stops touching
    notTouching(event){
        this.setState({
            scrolling: false,
            clicked:false

        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //this is dedicated to the changing location function
    buttonclicked(){
        this.setState({
            changing:true
        })
    }

    //this calls the function to change the default location
    changeLocation(city){
        this.setState({changing:false})
        this.props.function(city)
    }


    //////////////////////////////////////////////////////////////////////////////////////////////
    render(){
        let {defaultLocation, basicweather} = this.props
        let {changing} = this.state
        let time = Date()

        return(
            <div>
                {/*this displays the button to change default location */}
                {(changing === false)&&(<div class= {locationselction_styles.box} style={{position: "absolute", top: this.state.positionY }}>
                {defaultLocation}

                <div class = {locationselction_styles.smaller}> {basicweather} </div>
                
                		<div class= {locationselction_styles.time}>
                		{time.slice(0,15)}
                		</div>
                        <button onClick={this.buttonclicked}>
                            Change Home Location
                        </button>
                    </div>
                )}

                {/*this shows the map and the locations currently available as a home location */}
                {(changing === true)&&(
                    
                    <div >
                        <img class = {locationselction_styles.map} width= {800}  alt = "map" src = './../../assets/worldmap/worldmap.jpg'></img>
                        <img class = {locationselction_styles.location} style={{transform: "translate(57pt, 760%) rotateZ(90deg)"}} width ={40} src='./../../assets/icons/city.png' onClick={() => this.changeLocation("London")}></img>
                        <img class = {locationselction_styles.location} style={{transform: "translate(30pt, 1400%) rotateZ(90deg)"}} width ={40} src='./../../assets/icons/city.png' onClick={() => this.changeLocation("Beijing")}></img>
                        <img class = {locationselction_styles.location} style={{transform: "translate(-103pt, 1570%) rotateZ(90deg)"}} width ={40} src='./../../assets/icons/city.png' onClick={() => this.changeLocation("Melbourne")}></img>
                        <img class = {locationselction_styles.location} style={{transform: "translate(-60pt, 500%) rotateZ(90deg)"}} width ={40} src='./../../assets/icons/city.png' onClick={() => this.changeLocation("Brasilia")}></img>

                    </div>
                )}
            </div>
        )
    }
}
