// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
import widget_style from '../widget/widget_style.less';
import locationselection_styles from '../locationselection/locationselection.less';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';
import Widget from '../widget';
import LocationSelectionButton from '../locationselection/index.js';

// needed to run the async functions 
import 'regenerator-runtime'

export default class Iphone extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		
        //initial states
		this.setState({ 
            display: true,
            defaultLocation: "London",  
            otherLocationArrayPos:0,
            otherlocations:['Melbourne','Beijing','London','Brasilia'] //i have selected only four cities for now,
        });                                                            //more are added by simply adding the cities name to 
                                                                       //the array
		this.fetchWeatherData()

        //binding functions 
        this.parseCoordinates =this.parseCoordinates.bind(this)
        this.pullCityCoordinates = this.pullCityCoordinates.bind(this)
        this.parseUpcommingWeather = this.parseUpcommingWeather.bind(this)
        this.getUpcommingWeather = this.getUpcommingWeather.bind(this)
        this.generateTodaysWeather = this.generateTodaysWeather.bind(this)
        this.changeDefaultLocation = this.changeDefaultLocation.bind(this)
        this.generateWeeksWeather = this.generateWeeksWeather.bind(this)
        this.generateWeeksWeatherDetailed =this.generateWeeksWeatherDetailed.bind(this)
        this.OtherLocationsWidgetFunction = this.OtherLocationsWidgetFunction.bind(this)
        this.otherlocationtables()
        this.setup = this.setup.bind(this)
        this.otherlocationtables= this.otherlocationtables.bind(this)
        
        //setup renders javascipt generated html tables for the first time
        this.setup()

        //these two are for the widget that rotates between different locations
        this.OtherLocationsWidgetFunction()
        setInterval(() => { this.OtherLocationsWidgetFunction()}, 5000);
	}

    //gets teh direction the wind is currently travelling in 
	getDirection = (heading) => {
		var directions = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"]
		var index = Math.round((heading/8)/5,625)
		return directions[index]
	}


	//function assigns variable values from the json file to ones that can be used in the application
	parseResponse = (parsed_json) => {
		var location = parsed_json['name'];
		var temp_c = parsed_json['main']['temp'];
		var temp_f = parsed_json['main']['feels_like']
		var desc = parsed_json['weather']['0']['description'];
		var weather_humidity = parsed_json['main']['humidity']
		var wind_speed = parsed_json['wind']['speed']
		var wind_direction = parsed_json['wind']['deg']
        var humidity = parsed_json['main']['humidity']

		temp_c = Math.round(temp_c)
		temp_f = Math.round(temp_f)

		wind_direction = this.getDirection(wind_direction)

		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c,
			feels_like : temp_f,
			description : desc,
			humidity : weather_humidity,
			speed : wind_speed,
			deg : wind_direction,
            humidity:humidity
		});
    }

	// a call to fetch weather data via wunderground
	fetchWeatherData = () => {
		// API URL with a structure of : http://api.wunderground.com/api/key/feature/q/country-code/city.json
		var url = "http://api.openweathermap.org/data/2.5/weather?q="+this.state.defaultLocation+"&units=metric&APPID=e6e37f49ba7373ea798d418e80e6a3d4";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//place new  functions here 

    //this funciton is called by the pullcitycoordinates, this parses the lat and long of a city
    //inside a json file saving it to a state
    parseCoordinates(json){
        var latitude = json[0]["lat"]
        var longatude = json[0]["lon"]
        this.setState({
            lat: latitude,
            lon: longatude
        })
    }

    //this function calls openweathers geolocation api to attempt to retrieve the location of a city 
    //so that it can be used where it is needed by saving it into a state
    async pullCityCoordinates(city){
        var string = 'http://api.openweathermap.org/geo/1.0/direct?q='+city+'&appid=e6e37f49ba7373ea798d418e80e6a3d4'
        await $.ajax({
			url: string,
			dataType: "jsonp",
			success : this.parseCoordinates,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
    }

    // gets the whole dataset from a json file and saves it into a state locationweatherdata
    parseUpcommingWeather(json){
        var data = json['list']
        this.setState({
            locationWeatherData:data
        })
    }

    //functions will call this method to have the  weatherdata of a city saved into
    //saved into the state locationweatherdata for use
    //this function chains pullcitycoordinates and parseupcommingweather 
    async getUpcommingWeather(city){
        await this.pullCityCoordinates(city)
        var string = 'http://api.openweathermap.org/data/2.5/forecast?lat='+this.state.lat+'&lon='+this.state.lon+'&appid=e6e37f49ba7373ea798d418e80e6a3d4'
         await $.ajax({
			url: string,
			dataType: "jsonp",
			success : this.parseUpcommingWeather,
			error : function(req, err){ console.log('API call failed ' + err); }
		}) 
    }


    //creates a detailed table of the upcomming weather 
    async generateWeeksWeatherDetailed(city){
        await this.getUpcommingWeather(city)
        var date = 0
        let array = []
        let days = []

        for (var i in this.state.locationWeatherData){
            //takes the first piece of data for each date
            if (date != this.state.locationWeatherData[i]['dt_txt'].slice(0,10)){
                date = this.state.locationWeatherData[i]['dt_txt'].slice(0,10)

                //places the data for the day here
                array.push(this.state.locationWeatherData[i])
                
            }
        }

        //table gets created here
        let table = <table class = {widget_style.tableEnlarged}>
            {array.map(record => ( //.map helps cuts the data and organise it 
                <tr class = {widget_style.enlargedtablerow}>
                    
                    {/*this line determines the weekday that is being shown here*/ }
                    <td class={widget_style.tableEnlargedtd}>{new Date(record['dt_txt']).toLocaleDateString('en-UK', { weekday: 'long' }).slice(0,3)}</td>


                    {/*this line here pulls the related icon for the weather from open weather*/}
                    <td class = {widget_style.tableEnlargedtd}>{<img height={30} width ={30} alt="icon" src = {"https://openweathermap.org/img/wn/"+record['weather'][0]['icon']+'.png'} > </img>}</td>
                    
                    {/*this line here tells us what the weather is going to be like */}
                    <td class = {widget_style.tableEnlargedtd}> {record['weather'][0]['main']} </td>

                    {/*this line tells us the temperature of the day */}
                    <td class = {widget_style.tableEnlargedtd}>{Math.round(record['main']['temp'] -273.15)}°C</td>

                </tr>
            ))}
            

        </table>

        return table
    }


    //generates the more detailed upcomming weather table for the day
    async generateTodaysWeatherDetailed(city){
        await this.getUpcommingWeather(city)
        
        //immediately creates the table using the data pulled from the api
        let table = <table class = {widget_style.tableEnlarged}>
            {this.state.locationWeatherData.slice(0,8).map(record => (
                <tr class = {widget_style.enlargedtablerow}>
                    {/*takes the time of the upcomming weather */}
                    <td class = {widget_style.tableEnlargedtd} >{record['dt_txt'].slice(10,16)}</td>
                    
                    {/*grabs the icon for the weather from open weather api*/}
                    <td class = {widget_style.tableEnlargedtd}>{<img height={40} width ={40} alt="icon" src = {"https://openweathermap.org/img/wn/"+record['weather'][0]['icon']+'.png'} > </img>}</td>

                    {/*places the weather name */}
                    <td class = {widget_style.tableEnlargedtd}>{record['weather'][0]['main']}</td>
                    
                    {/*places the temperature into the table*/}
                    <td class = {widget_style.tableEnlargedtd}>{Math.round(record['main']['temp'] -273.15)}°C</td>

                </tr>
            ))}
        </table>
        return table
    }

    //this generates the table to be used in the widgets when they are not opened
    async generateTodaysWeather(city){
        await this.getUpcommingWeather(city)

        //goes straight into generating the table 
        let table = <table>
            {this.state.locationWeatherData.slice(0,8).map(record => (
                <tr class = {widget_style.closedtablerow}>
                    {/*the time for the weather */}
                    <td>{record['dt_txt'].slice(10,16)}</td>

                    {/*the icon for the weather*/}
                    <td class = {widget_style.insidemidcell}>{<img height={30} width ={30} alt="icon" src = {"https://openweathermap.org/img/wn/"+record['weather'][0]['icon']+'.png'} > </img>}</td>

                    {/*the temperature for the time */}
                    <td>{Math.round(record['main']['temp'] -273.15)}°C</td>

                </tr>
            ))}

        </table>

        return table
    }

    //generates the weather for the week
    async generateWeeksWeather(city){
        await this.getUpcommingWeather(city)

        var date = 0
        let array = []
        let days = []
        for (var i in this.state.locationWeatherData){
            //picks the first piece of data for each day
            if (date != this.state.locationWeatherData[i]['dt_txt'].slice(0,10)){
                date = this.state.locationWeatherData[i]['dt_txt'].slice(0,10)

                array.push(this.state.locationWeatherData[i])            
            }
        }

        //table generation 
        let table = <table>
            {array.map(record => (
                <tr class = {widget_style.closedtablerow}>
                    {/*this gets the day of the week */}
                    <td>{new Date(record['dt_txt']).toLocaleDateString('en-UK', { weekday: 'long' }).slice(0,3)}</td>

                    {/*the icon for the weather*/}
                    <td class = {widget_style.insidemidcell}>{<img height={30} width ={30} alt="icon" src = {"https://openweathermap.org/img/wn/"+record['weather'][0]['icon']+'.png'} > </img>}</td>

                    {/*the temperature*/}
                    <td>{Math.round(record['main']['temp'] -273.15)}°C</td>

                </tr>
            ))}
            

        </table>

        return table
    }

    //this fucntion allows for the generatrion for the table of the rotating cities widget when that widget is not opened
    async OtherLocationsWidgetFunction(){
        //the list of cities available is in the constructor

        //we have counter that goes up each time this is called, when it is larger than the cities array it goes back to 0
        if (this.state.otherLocationArrayPos+1 >= this.state.otherlocations.length ){
            this.setState({
                otherLocationArrayPos:0
            })
        }
        else{//otherwise it goes up normally
            this.setState({
                otherLocationArrayPos: this.state.otherLocationArrayPos+1
            })

        }

        //this assigns the states needed for the table to be displayed
        this.setState({
            otherLocationSelected: this.state.otherlocations[this.state.otherLocationArrayPos],
            otherLocationDailyTable: await this.generateWeeksWeather(this.state.otherlocations[this.state.otherLocationArrayPos])
            //^^ this simply calls the generateweekweather to generate the table
        })

        
    }

    //this is for the inside of the rotating widgets generating the widgets for other cities
    async otherlocationtables(){
        let tableArray = []
        let array = []
        var X = 220
        var Y = -70

        for (var i in this.state.otherlocations){

            //maths and logic here to work out where the widgets will be generated
            if (X == 220){
                X = 20
            }
            else{
                X=220
            }

            if (i%2 ==0){
            Y = Y+270
            }

            //each city has a table, which gets stored here
            tableArray.push(await this.generateTodaysWeather(this.state.otherlocations[i]))

            //this what gets entereed as the frount of the closed other city widget
            let frountinfo = <div>
                <div>{this.state.otherlocations[i]}</div>
                <div>{tableArray[i]}</div>
            </div>
            
            //the new city widget is created and added here            
            array.push(<Widget originalheight={Y} howleft={X} input={frountinfo} ></Widget> )
        }

        //this is what gets entered inside the rotating city widget
        let widgetsToBeAdded = <div>
            {array.map(widget => (
                widget
            ))}
        </div>

        this.setState({widgetsToBeAdded: widgetsToBeAdded}) 
    }


    //sets up the app to render everything
    async setup(){

        this.setState({
            todaysLocalWeatherTable:await this.generateTodaysWeather(this.state.defaultLocation),
            todaysLocalWeatherTableDetailed: await this.generateTodaysWeatherDetailed(this.state.defaultLocation),
            weeksLocalWeatherTable:await this.generateWeeksWeather(this.state.defaultLocation),
            weeksLocalWeatherTableDetailed:await this.generateWeeksWeatherDetailed(this.state.defaultLocation)
        })
    }

    //this function is used by the locaitonselction button 
    changeDefaultLocation(city){
        this.setState({
            defaultLocation:city
        })
        this.setup()
        this.fetchWeatherData()
        
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// the main render method for the iphone component
	render() {
        const {todaysLocalWeatherTable,todaysLocalWeatherTableDetailed, weeksLocalWeatherTable,weeksLocalWeatherTableDetailed,otherLocationDailyTable,otherLocationSelected,widgetsToBeAdded ,defaultLocation} = this.state


        //we build html variables here to pass onto widgets 
		let defaultLocationDailySmall  = <div> 
                <div> 
                    {/*Use Api to put default Location here. Add setting fot default location */} 
                    {defaultLocation} today


                    <div>
                    {todaysLocalWeatherTable}
                    </div>

                    <div></div>

                </div> 
            </div>

            
        let weekWeather = <div> 
                <div > Weekly Weather </div> 

                <div>
                    {weeksLocalWeatherTable}
                </div>

            </div>




        let otherCities = <div class = {widget_style.rotatingwidget}> 
                <div>Tracking: {otherLocationSelected}</div> 
                <div>{otherLocationDailyTable}</div>
            </div>





        let alerts = <div> 
                <div> Weather Alerts</div> 
                <div><img src='./../../assets/icons/warning-sign.png' style='width:50px;height:50px;'></img></div>
                <div style='font-weight:bold'>HURRICANE WARNING</div>
                <div>Severity: Moderate</div>
                <div>Estimated Time: 8:02pm</div>
            </div>




        let precipitation = <div>

            <div> Precipitation </div>
            <img class = {widget_style.percipbackground}src = './../../assets/backgrounds/rain.gif' width = "400" height = "250"></img>

        <p>Humidity</p>
            <div class = {style.temperature}> {this.state.humidity}%</div>
        </div>




        let currentTemp = <div>
            <div> Temperature </div>
                <span class={ style.temperature }>{ this.state.temp } °</span>
                <div> Feels like </div>
                <span class={ style.temperature }>{ this.state.feels_like} °</span>
                <div>Wind speed</div>
                <span class={style.temperature}> {this.state.speed} kmh</span>
                <div>Wind Direction</div>
                <span class={style.temperature}> {this.state.deg}</span>
            </div>



        let defaultLocationDailyLarge = <div>

                <div>
                    {todaysLocalWeatherTableDetailed}
                </div>

            </div>


        let weekWeatherEnlarged = <div>
            {weeksLocalWeatherTableDetailed}
        </div>

        let citiesListBubble = <div>
            <div>
                {widgetsToBeAdded}
            </div>

        </div>

        let alertsBubble = <div>
            <div class={style.alert}>
                <div style='font-weight:bold'>HURRICANE WARNING</div>
                <div>Severity: Moderate</div>
                <div>Urgency: Expected Soon</div>
                <div>Certainty: Likely</div>
                <div>Estimated Time: 8:02pm</div>
            </div>
        </div>

        let precipitationBubble = <div class = {style.precip} >
        <img src = './../../assets/backgrounds/rainfall.png' width = "400" height = "250"></img>
        </div>




// displays application 
return (
<div class={ style.container }>
    <div class= {style.header}>

        {<LocationSelectionButton defaultLocation = {this.state.defaultLocation} function={this.changeDefaultLocation}  basicweather= {this.state.description} ></LocationSelectionButton>}
    </div>

    <div>
        {/*custom widgets class here, they require a position   */}

        {<Widget originalheight={200} howleft= {220} input ={currentTemp} clickeddata={null}></Widget>}
        {<Widget originalheight={200} howleft= {20} input ={defaultLocationDailySmall} clickeddata={defaultLocationDailyLarge}></Widget> }
        {<Widget originalheight={470} howleft= {220} input ={weekWeather} clickeddata = {weekWeatherEnlarged}></Widget> }
        {<Widget originalheight={470} howleft= {20} input ={otherCities}  clickeddata={citiesListBubble}></Widget> }
        {<Widget originalheight={740} howleft= {220} input={alerts} clickeddata={alertsBubble}></Widget> }
        {<Widget originalheight={740} howleft= {20} input={precipitation} clickeddata={precipitationBubble}></Widget> }

    </div>

</div>
);
}

}
