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

export default class Iphone extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		// button display state
		this.setState({ display: true });
		this.fetchWeatherData()
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


	// the main render method for the iphone component
	render() {
		///////////////////////////////////////////////////////////////////////////////////////////////////
		//placing html code to be used inside widgets here
		let basicpercipitaiton  = <div> <div> Precipitation </div> </div>
		let test = <div>testing testing testing</div>

		let basicTemperature = <div> <div class = {style.widgetTitle}> Temperature </div> <span class={ style.temperature }>{ this.state.temp }</span> </div>
		
		let basicWind = <div> <div> Wind </div> </div>
		
		let basicWeather = <div> <div> Beijing Weather</div> </div>


		//////////////////////////////////////////////////////////////////////////////////////////////////
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
					{<Widget originalheight={200} howleft= {220} input ={basicTemperature} clickeddata = {"testing"}></Widget> }
					{<Widget originalheight={470} howleft= {20} input ={basicWind} clickeddata = {test} ></Widget> }
					{<Widget originalheight={200} howleft= {20} input ={basicpercipitaiton}></Widget> }
					{<Widget originalheight={470} howleft= {220} input ={basicWeather}></Widget> }
					
				</div>

			</div>
		);
	}



	


}
