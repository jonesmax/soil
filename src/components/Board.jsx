import React from 'react';
import axios from 'axios';
import '../css/Main.css';


import 'semantic-ui-less/semantic.less';
import { Icon,Button,Card,Divider,Segment, Input, Label,Loading,Loader, Dimmer,List,Table, Container } from 'semantic-ui-react';



class Board extends React.Component {
    
    constructor() {
        super();
        this.state = {
            weather: null,
            location: null,
            city: null,
            user:this.props,
            Loading: true,
            status: 'safe',
            gdpLevel: 0
            
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
    getDate(date){
        date = new Date(date);
        let weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let dayOfWeek = weekday[date.getDay()];
        let formatedDate = (date.getMonth()+1)+'/'+(date.getDate() < 10 ? ('0'+date.getDate()): date.getDate()) + ' '+dayOfWeek;
        return formatedDate;
    }

    status(){
        if(this.state.status === 'safe'){
                return (
                <div style={{backgroundColor:'lime',padding:'5px'}}>
                    <h2 style={{textAlign:'center',color:'black'}}>Safe</h2>
                </div>
            );
        }
        else if(this.state.status === 'warning'){
                return (
                <div style={{backgroundColor:'yellow',padding:'5px'}}>
                    <h2 style={{textAlign:'center',color:'black'}}>Warning</h2>
                </div>
            );
        }
        else if(this.state.status === 'negative'){
                return (
                <div style={{backgroundColor:'red',padding:'5px'}}>
                    <h2 style={{textAlign:'center',color:'black'}}>Attention</h2>
                </div>
            );
        } 
    }
    setGpd(){this.setState({gdpLevel:0})}

    getStatus(item,gdp){
        console.log('hi');
        if((gdp+=item.high)>200){
            // this.setGpd();
            return 'rgb(0,255,0)';
        }
        else{
            if((gdp+=item.high)>150){
                return 'rgb(255,0,0,0.4)';
            }
            else if((gdp+=item.high)>100){
                return 'rgb(255,255,0,0.4)';
            }
            else{
                return 'rgb(0,255,0,0.4)';
            }
        }
        
    }

    tableBoard(){

        let weather = [
           {date: ('2021-03-10'),high: 19,low:7,filterized: false},
           {date: ('2021-03-11'),high: 20,low:6,filterized: false},
           {date: ('2021-03-12'),high: 18,low:7,filterized: false},
           {date: ('2021-03-13'),high: 17,low:5,filterized: false},
           {date: ('2021-03-14'),high: 21,low:14,filterized: false},
           {date: ('2021-03-15'),high: 24,low:10,filterized: false},
           {date: ('2021-03-16'),high: 19,low:7,filterized: false},
           {date: ('2021-03-17'),high: 20,low:7,filterized: false},
           {date: ('2021-03-18'),high: 23,low:11,filterized: false},
           {date: ('2021-03-19'),high: 20,low:12,filterized: false},
           {date: ('2021-03-20'),high: 20,low:12,filterized: true},







           

        ];
        //
        
        let gdpLevel = this.state.gdpLevel;
        return (
                <table>
                    <tr>
                        <th>Date</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>GDP</th>
                    </tr>
                    {weather.map(item => 
                    <tr>
                        <td>{this.getDate(item.date)}</td>
                        <td>{item.high}</td>
                        <td>{item.low}</td>
                        <td style={{backgroundColor:this.getStatus(item,gdpLevel)}}>{gdpLevel+=item.high}</td>
                        
                    </tr>
                    )}
                </table>

          
        )
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
                <Divider style={{marginBottom:'5px'}}></Divider>
                {this.status()}
                <Divider style={{marginTop:'5px'}}></Divider>
                <div style={{width:'100%',height:'100%'}}>
                    {this.tableBoard()}
                </div>
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