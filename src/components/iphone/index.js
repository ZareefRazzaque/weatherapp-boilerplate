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


import 'regenerator-runtime'

export default class Iphone extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		// button display state
		this.setState({ 
            display: true,
            defaultLocation: "London",  
            otherLocationArrayPos:0
        });
		this.fetchWeatherData()

        this.parseCoordinates =this.parseCoordinates.bind(this)
        this.pullCityCoordinates = this.pullCityCoordinates.bind(this)
        this.parseUpcommingWeather = this.parseUpcommingWeather.bind(this)
        this.getUpcommingWeather = this.getUpcommingWeather.bind(this)
        this.generateTodaysWeather = this.generateTodaysWeather.bind(this)
        this.changeDefaultLocation = this.changeDefaultLocation.bind(this)
        this.generateWeeksWeather = this.generateWeeksWeather.bind(this)
        this.generateWeeksWeatherDetailed =this.generateWeeksWeatherDetailed.bind(this)
        this.OtherLocationsWidgetFunction = this.OtherLocationsWidgetFunction.bind(this)
        this.setup = this.setup.bind(this)
        this.setup()
        this.OtherLocationsWidgetFunction()
        setInterval(() => { this.OtherLocationsWidgetFunction()
            
        }, 5000);

        
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
		var url = "http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=e6e37f49ba7373ea798d418e80e6a3d4";
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
    }

    async pullCityCoordinates(city){
        var string = 'http://api.openweathermap.org/geo/1.0/direct?q='+city+'&appid=e6e37f49ba7373ea798d418e80e6a3d4'
        await $.ajax({
			url: string,
			dataType: "jsonp",
			success : this.parseCoordinates,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
    }


    parseUpcommingWeather(json){
        var data = json['list']
        this.setState({
            locationWeatherData:data
        })
    }

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

    async generateWeeksWeatherDetailed(city){
        await this.getUpcommingWeather(city)
        var date = 0
        let array = []
        let days = []
        for (var i in this.state.locationWeatherData){
            if (date != this.state.locationWeatherData[i]['dt_txt'].slice(0,10)){
                date = this.state.locationWeatherData[i]['dt_txt'].slice(0,10)

                array.push(this.state.locationWeatherData[i])
                
                days.push(new Date(date).getDay())
                
            }
        }
        console.log(days)

        let table = <table class = {widget_style.tableEnlarged}>
            {array.map(record => (
                <tr class = {widget_style.enlargedtablerow}>
                    <td class={widget_style.tableEnlargedtd}>{new Date(record['dt_txt']).toLocaleDateString('en-UK', { weekday: 'long' }).slice(0,3)}</td>

                    <td class = {widget_style.tableEnlargedtd}>{<img height={30} width ={30} alt="icon" src = {"https://openweathermap.org/img/wn/"+record['weather'][0]['icon']+'.png'} > </img>}</td>
                    <td class = {widget_style.tableEnlargedtd}> {record['weather'][0]['main']} </td>

                    <td class = {widget_style.tableEnlargedtd}>{Math.round(record['main']['temp'] -273.15)}°C</td>

                </tr>
            ))}
            

        </table>
        console.log(table)

        return table
    }


    async generateTodaysWeatherDetailed(city){
        await this.getUpcommingWeather(city)

        let table = <table class = {widget_style.tableEnlarged}>
            {this.state.locationWeatherData.slice(0,8).map(record => (
                <tr class = {widget_style.enlargedtablerow}>
                    
                    <td class = {widget_style.tableEnlargedtd} >{record['dt_txt'].slice(10,16)}</td>
                    
                    <td class = {widget_style.tableEnlargedtd}>{<img height={40} width ={40} alt="icon" src = {"https://openweathermap.org/img/wn/"+record['weather'][0]['icon']+'.png'} > </img>}</td>

                    <td class = {widget_style.tableEnlargedtd}>{record['weather'][0]['main']}</td>
                    
                    <td class = {widget_style.tableEnlargedtd}>{Math.round(record['main']['temp'] -273.15)}°C</td>

                </tr>
            ))}
        </table>
        return table
    }

    async generateTodaysWeather(city){
        await this.getUpcommingWeather(city)

        let table = <table>
            {this.state.locationWeatherData.slice(0,8).map(record => (
                <tr class = {widget_style.closedtablerow}>
                    <td>{record['dt_txt'].slice(10,16)}</td>

                    <td class = {widget_style.insidemidcell}>{<img height={30} width ={30} alt="icon" src = {"https://openweathermap.org/img/wn/"+record['weather'][0]['icon']+'.png'} > </img>}</td>

                    <td>{Math.round(record['main']['temp'] -273.15)}°C</td>

                </tr>
            ))}

        </table>

        return table
    }

    async generateWeeksWeather(city){
        await this.getUpcommingWeather(city)
        var date = 0
        let array = []
        let days = []
        for (var i in this.state.locationWeatherData){
            if (date != this.state.locationWeatherData[i]['dt_txt'].slice(0,10)){
                date = this.state.locationWeatherData[i]['dt_txt'].slice(0,10)

                array.push(this.state.locationWeatherData[i])
                
                days.push(new Date(date).getDay())
                
            }
        }
        console.log(days)

        let table = <table>
            {array.map(record => (
                <tr class = {widget_style.closedtablerow}>
                    <td>{new Date(record['dt_txt']).toLocaleDateString('en-UK', { weekday: 'long' }).slice(0,3)}</td>

                    <td class = {widget_style.insidemidcell}>{<img height={30} width ={30} alt="icon" src = {"https://openweathermap.org/img/wn/"+record['weather'][0]['icon']+'.png'} > </img>}</td>

                    <td>{Math.round(record['main']['temp'] -273.15)}°C</td>

                </tr>
            ))}
            

        </table>
        console.log(table)

        return table
    }


    async OtherLocationsWidgetFunction(){
        var otherlocations =['Melbourne','Beijing','London','Brasilia']
        
        if (this.state.otherLocationArrayPos+1 >= otherlocations.length ){
            this.setState({
                otherLocationArrayPos:0
            })
        }
        else{
            this.setState({
                otherLocationArrayPos: this.state.otherLocationArrayPos+1
            })

        }


        this.setState({
            otherLocationSelected: otherlocations[this.state.otherLocationArrayPos],
            otherLocationDailyTable: await this.generateWeeksWeather(otherlocations[this.state.otherLocationArrayPos])
        })

        
    }



    async setup(){

        this.setState({
            todaysLocalWeatherTable:await this.generateTodaysWeather(this.state.defaultLocation),
            todaysLocalWeatherTableDetailed: await this.generateTodaysWeatherDetailed(this.state.defaultLocation),
            weeksLocalWeatherTable:await this.generateWeeksWeather(this.state.defaultLocation),
            weeksLocalWeatherTableDetailed:await this.generateWeeksWeatherDetailed(this.state.defaultLocation)
        })
        console.log(this.state.weeksLocalWeatherTable)
    }


    changeDefaultLocation(city){
        this.setState({
            defaultLocation:city
        })
        this.setup()
        
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// the main render method for the iphone component
	render() {
        const {todaysLocalWeatherTable,todaysLocalWeatherTableDetailed, weeksLocalWeatherTable,weeksLocalWeatherTableDetailed,otherLocationDailyTable,otherLocationSelected ,defaultLocation} = this.state

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
                <div>EARTHQUAKE WARNING (under construction)</div>
            </div>

        let precipitation = <div>
            <div> Precipitation </div>
            <img src = './../../assets/backgrounds/rain.gif'></img>
        </div>


        {/*Content of the bubbles*/} 

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
                {<Widget originalheight={200} howleft= {20} input ={defaultLocationDailySmall} clickeddata={defaultLocationDailyLarge}></Widget> }
                {<Widget originalheight={200} howleft= {220} input ={weekWeather} clickeddata = {weekWeatherEnlarged}></Widget> }
                {<Widget originalheight={470} howleft= {220} input={alerts} clickeddata={allertsBubble}></Widget> }
                {<Widget originalheight={470} howleft= {20} input={precipitation} clickeddata={precipitationBubble}></Widget> }
            </div>

        </div>

        let allertsBubble = <div>
            <div>
                <div>Wind</div>
                <div>400ms</div>
            </div>
        </div>

        let precipitationBubble = <div>
            <div> Precipitation Level</div>
        </div>


		// display all weather data
		return (
			<div class={ style.container }>
                {<LocationSelectionButton defaultLocation = {this.state.defaultLocation} function={this.changeDefaultLocation}></LocationSelectionButton>}
				
                <div>
					{/*custom widgets class here, they require a position   */}
					
					{<Widget originalheight={200} howleft= {20} input ={defaultLocationDailySmall} clickeddata={defaultLocationDailyLarge}></Widget> }
					{<Widget originalheight={200} howleft= {220} input ={weekWeather} clickeddata = {weekWeatherEnlarged}></Widget> }
					{<Widget originalheight={470} howleft= {20} input ={otherCities}  clickeddata={citiesListBubble}></Widget> }
					{<Widget originalheight={470} howleft= {220} input={alerts} clickeddata={allertsBubble}></Widget> }
                    {<Widget originalheight={740} howleft= {20} input={precipitation} clickeddata={precipitationBubble}></Widget> }
					
				</div>

			</div>
		);
	}

}
