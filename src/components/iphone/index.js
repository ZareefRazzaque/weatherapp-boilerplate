// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
import widget_style from '../widget/widget_style.less'
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';
import Widget from '../widget'

import 'regenerator-runtime/runtime';

export default class Iphone extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		// button display state
		this.setState({ display: true,
        locallocation: "London"  });
		this.fetchWeatherData()

        this.parseCoordinates =this.parseCoordinates.bind(this)
        this.pullCityCoordinates = this.pullCityCoordinates.bind(this)
        this.parseTodaysWeather = this.parseTodaysWeather.bind(this)
        this.getTodaysWeather = this.getTodaysWeather.bind(this)
        this.generateTodaysWeather = this.generateTodaysWeather.bind(this)
        this.generateTodaysWeather()
        
	}
	//function assigns variable values from the json file to ones that can be used in the application 
	parseResponse = (parsed_json) => {

		var location = parsed_json['name']; //name of the location saved here 	
		var temp_c = parsed_json['main']['temp'] +'°'; // temperature conditions are stored here
		var conditions = parsed_json['weather']['0']['description'];//the current weather conditions are here (eg cloudy, rain , sunny etc)

		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c,
			cond : conditions
		});      
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = () => {
		// API URL with a structure of : http://api.wunderground.com/api/key/feature/q/country-code/city.json
		var url = "http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=bff435938a5989963d8a821ee442e57f";
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
	//place functions here 
    parseCoordinates(json){
        var latitude = json[0]["lat"]
        var longatude = json[0]["lon"]
        this.setState({
            lat: latitude,
            lon: longatude
        })
        console.log(this.state.lat,this.state.lon)
    }

    async pullCityCoordinates(city){
        var string = 'http://api.openweathermap.org/geo/1.0/direct?q='+city+'&appid=bff435938a5989963d8a821ee442e57f'
        await $.ajax({
			url: string,
			dataType: "jsonp",
			success : this.parseCoordinates,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
    }


    parseTodaysWeather(json){
        console.log("running")
        var data = json['list']
        this.setState({
            locationWeatherData:data
        })
        console.log(data)
    }

    async getTodaysWeather(city){
        await this.pullCityCoordinates(city)
        var string = 'http://api.openweathermap.org/data/2.5/forecast?lat='+this.state.lat+'&lon='+this.state.lon+'&appid=bff435938a5989963d8a821ee442e57f'
        console.log(string)
         await $.ajax({
			url: string,
			dataType: "jsonp",
			success : this.parseTodaysWeather,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
        
        
    }


    async generateTodaysWeather(){
        console.log("generating")
        await this.getTodaysWeather('London')
        console.log()

        let table = <table>
            <tr>
                <td>
                    {this.state.locationWeatherData[1]["main"]["temp"]}
                </td>
                <td>
                    
                </td>

            </tr>

            <tr>
                <td>
                    {this.state.locationWeatherData[2]["main"]["temp"]}
                </td>
            </tr>

            <tr>
                <td>
                    {this.state.locationWeatherData[3]["main"]["temp"]}
                </td>
            </tr>
        </table>

        this

        this.setState({
            todaysWeatherTable:table
        })
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// the main render method for the iphone component
	render() {
		let defaultLocation  = <div> 
                <div> 
                    {/*Use Api to put default Location here. Add setting fot default location */} 
                    {this.state.locallocation} today


                    <div>
                    {this.state.todaysWeatherTable}
                    testing
                    </div>

                </div> 
            </div>

            
        let weekWeather = <div> 
                <div class = {style.widgetTitle}> Week Weather </div> 
            </div>

        let citiesList = <div> 
                <div> Other Locations </div> 
            </div>

        let alerts = <div> 
                <div> Weather Alerts</div> 
            </div>


        {/*Content of the bubbles*/} 

        let defaultLocationBubble = <div>
                <div>
                    <div>Weather</div>
                    <div>Sunny</div>
                </div>
                <div>
                    <div>Temperature</div>
                    <div>10</div>
                </div>

                <div>
                    <div>Wind</div>
                    <div>1ms</div>
                </div>

                <div>
                    <div>Humidity</div>
                    <div>10</div>
                </div>
            </div>


        let weekWeatherBubble = <div>
            <div>
                <div>Monday</div>
                <div>Sunny</div>
            </div>

            <div>
                <div>Tueday</div>
                <div>Sunny</div>
            </div>

            <div>
                <div>Wednesday</div>
                <div>Sunny</div>
            </div>
            <div>
                <div>Thurday</div>
                <div>Sunny</div>
            </div>
            <div>
                <div>Friday</div>
                <div>Sunny</div>
            </div>
        </div>

        let citiesListBubble = <div>
            <div>
                <div>Rome</div>
                <div>Sunny</div>
            </div>

            <div>
                <div>Tokyo</div>
                <div>Sunny</div>
            </div>
        </div>

        let allertsBubble = <div>
            <div>
                <div>Wind</div>
                <div>400ms</div>
            </div>
        </div>


		// display all weather data
		return (
			<div class={ style.container }>
				
				<div class={ style.header }> 
					<div class={ style.city }>{ this.state.locate }</div>			
					<div class={ style.conditions }>{ this.state.cond }</div>
					
				</div>
				<div class={ style.details }></div>
				<div class= { style_iphone.container }> 

				</div>
				<div>


					{/*custom widgets class here, they require a position   */}
					
					{<Widget originalheight={200} howleft= {20} input ={defaultLocation} clickeddata={defaultLocationBubble}></Widget> }
					{<Widget originalheight={200} howleft= {220} input ={weekWeather} clickeddata = {weekWeatherBubble}></Widget> }
					{<Widget originalheight={470} howleft= {20} input ={citiesList}  clickeddata={citiesListBubble}></Widget> }
					{<Widget originalheight={470} howleft= {220} input={alerts} clickeddata={allertsBubble}></Widget> }
					
				</div>

			</div>
		);
	}



	


}
