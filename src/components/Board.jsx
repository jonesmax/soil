import React from 'react';
import axios from 'axios';
import '../css/Main.css';


import 'semantic-ui-less/semantic.less';
import { Icon,Button,Card,Divider,Segment, Input, Label,Loading,Loader, Dimmer } from 'semantic-ui-react';



class Board extends React.Component {
    
    constructor() {
        super();
        this.state = {
            weather: null,
            location: null,
            city: null,
            user:this.props,
            Loading: true
            
        }
        
    }
    getCity(){
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = JSON.stringify(position.coords.latitude);
            let long = JSON.stringify(position.coords.longitude);
            let url = 'https://www.mapquestapi.com/geocoding/v1/reverse?key=Uc8JYIXgBVAJLDLp6kCADuKCP1vjBY9m&location='+lat+'%2C'+long+'&outFormat=json&thumbMaps=false';
        // you need to bind this so you can use setState
            let city;
            axios.get(url)
            .then(res => {
                const weather = res.data;
                city = (weather.results[0].locations[0].adminArea5)+', CA'; 
                this.setState({city:city});
                this.getWeather();
            })
        });
    }
    getWeather(){
        let location = this.state.city;
        this.setState({location:location});
        let url = 'http://api.openweathermap.org/data/2.5/weather?q='+location+'&units=metric&appid=86583fb8344f78f0fdf02aa0d9e1859c';
        axios.get(url)
          .then(res => {
            const weather = res.data;
            this.setState({weather: weather,
            Loading:false});
        })
    }
    componentDidMount() {
        this.getCity();
        this.setState({user: this.props.user});
    }

    getToday(){
        var objToday = new Date(),
        weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayOfWeek = weekday[objToday.getDay()],
        
        dayOfMonth =  ( objToday.getDate() < 10) ? '0' + objToday.getDate() : objToday.getDate(),
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        curMonth = months[objToday.getMonth()],
        curYear = objToday.getFullYear(),
        curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
        curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
        curMeridiem = objToday.getHours() > 12 ? " pm" : " am";
        var today = curHour + ":" + curMinute + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " " + curMonth + ", " + curYear;
        return today;
    }

    App(){
        return(
        <div style={{padding:'30px'}}>
            
            <Card style={{width:'100%',margin:'auto',padding:'10px',height:'500px'}}>
            <Dimmer active={this.state.Loading} inverted>
                <Loader size='medium'>Loading</Loader>
            </Dimmer>
                <Card.Header>
                    <h1 style={{fontSize:'15px',textAlign:'center'}}>{this.getToday()}</h1>
                    {this.state.weather &&
                    <h2 style={{fontSize:'15px',textAlign:'center'}}>{this.state.weather.main.temp}° in {this.state.location}</h2>
                    }
                </Card.Header>
                <Divider></Divider>
                
            </Card>

            
            
        </div>);
    }

    render() {
        return(
            <div>
                {this.App()}
            </div>
        );
    }

       
}


export default Board;