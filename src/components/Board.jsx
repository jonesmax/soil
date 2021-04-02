import React from 'react';
import axios from 'axios';
import '../css/Main.css';

import 'semantic-ui-less/semantic.less';
import { Icon,Button,Card,Divider,Segment, Input, Label,Loading,Loader, Dimmer,List,Table, Container } from 'semantic-ui-react';



class Board extends React.Component {
    
    constructor() {
        super();
        this.state = {
            user:this.props,
            Loading: false,
            status: 'safe',
            gdpLevel: 0,
            statusBar: null,
            location:null,
            currentReports: [],
            currentWeatherReports: []
        }
        
    }
    componentDidMount() {
        this.getWeather();

    }

    getWeather(data){
        let location = this.props.user.location;
        location = location+', CA';
        let url = 'http://api.openweathermap.org/data/2.5/weather?q='+location+'&units=metric&appid=86583fb8344f78f0fdf02aa0d9e1859c';
        
        axios.get(url)
          .then(res => {
            this.setState({
                Loading:false,
                user: this.props.user,
                location: location,
                weather: res.data});
                this.createWeather(res.data);
        })
        
    }
    createWeather(data){
        let weather = {
            user_id: this.props.user.id,
            date: this.formatDate(new Date()),
            high: data.main.temp_max,
            low: data.main.temp_min,
        }
        axios.post('http://3.137.214.252:80/weather/create',weather )
        .then(res => {
          if(res.data){
              console.log('success');
              this.getData(this.props.user.id);
          }
          else{
             console.log('already have that weather, or failed.');
          }
      })
      this.getData(this.props.user.id);
    }

    async getData(user_id){
       
        axios.get('http://3.137.214.252:80/weather/'+user_id )
        .then(res => {
          if(res.data){
            this.setState({currentReports: res.data});
            this.calculateWeather(res.data);
          }
          else{
           
          }
      })
    }

    calculateWeather(weather){
        console.log(weather);
        let level = 0;
        weather.forEach(function(item){ 
             let gdp = level;
             gdp+= Math.floor((item.high+item.low)/2);
             console.log("current gdp",gdp);
             if(item.fertilized){
                 item.gdp = Math.floor((item.high+item.low)/2);
                 item.status = 'rgb(205,205,205)';
                 item.message = 'Safe';
                 item.color = 'black';
                //  console.log(item);
                 
            }
            else if(gdp>=170){
                 item.gdp = gdp;
                 item.status = 'red';
                 item.message = 'Action';
                 item.color = 'white';
            }
            else if(gdp>=120){
                 item.gdp = gdp;
                 item.status='rgb(209, 14, 0,0.5)';
                 item.message = 'Warning';
                 item.color = 'white';         
            }
            else if(gdp>=80){
                 item.gdp = gdp;
                 item.status='yellow';
                 item.message = 'Moderate';
                 item.color = 'black';
            }
            else{
                 item.gdp = gdp;
                 item.status='rgb(123, 237, 47)';
                 item.message = 'Safe';
                  item.color = 'black';
            }
            level = item.gdp;
         });
         
        this.setState({currentWeatherReports: weather});
    }
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
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
        let weekday = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let dayOfWeek = weekday[date.getUTCDay()];
        let formatedDate = (date.getUTCMonth()+1)+'/'+(date.getUTCDate() < 9 ? ('0'+date.getUTCDate()): date.getUTCDate()) + ' '+dayOfWeek;
        return formatedDate;
    }
    status(weather){
        let copy = weather;
        var lastItem = copy[copy.length - 1];
        // console.log("weahter",weather);
        return (
                <div style={{backgroundColor:lastItem.status,padding:'5px'}}>
                    <h2 style={{textAlign:'center',color:'black'}}>{lastItem.message}</h2>
                </div>
        );
    }
    ferterlize(weather){
        let id = weather[weather.length - 1].id;
        
        axios.get('http://3.137.214.252/weather/fertilize/'+id )
        .then(res => {
          if(res.data){
            //  console.log('good?');
             this.getData(this.props.user.id);
          }
          else{
            // console.log('bad?');
          }
      })
    }
    tableBoard(weather){
        return (
                    weather.map(item => 
                    <Table.Row  color='blue' key={item.date}>
                        <Table.Cell id='tbody'>{this.getDate(item.date)}</Table.Cell>
                        <Table.Cell id='tbody'>{item.high}</Table.Cell>
                        <Table.Cell id='tbody'>{item.low}</Table.Cell>
                        <Table.Cell id='tbody' style={{backgroundColor:item.status,color:item.color}}>{item.gdp}<Icon style={{display: item.fertilized? null: 'none'}} color='green' name='star'></Icon></Table.Cell>
                    </Table.Row>
                )
        )
    }
 
    render() {
        return(
            <div className='blur' style={{padding:'30px'}}>
            <Card style={{width:'100%',margin:'auto',padding:'10px',maxHeight:'90vh',maxWidth:'600px'}}>
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
                {this.state.currentWeatherReports.length > 0 && this.status(this.state.currentWeatherReports)}
                <Divider style={{marginTop:'5px'}}></Divider>
                <div style={{width:'100%'}}>
                    <div style={{maxHeight:'60vh',overflowY:'auto'}}>
                        <Table unstackable>
                            <Table.Header  color='blue'>
                            <Table.Row>
                                <Table.HeaderCell id='thc'>Date</Table.HeaderCell>
                                <Table.HeaderCell id='thc'>High</Table.HeaderCell>
                                <Table.HeaderCell id='thc'>Low</Table.HeaderCell>
                                <Table.HeaderCell id='thc'>GDP</Table.HeaderCell>
                            </Table.Row>
                            </Table.Header>
                            <Table.Body id='tbody'>
                                {this.state.currentWeatherReports && this.tableBoard(this.state.currentWeatherReports)}
                            </Table.Body>
                        </Table>
                    </div>
                <Button.Group style={{width:'100%',padding:'10px',paddingBottom:"0px",marginTop:'2px'}}>
                    <Button style={{width:'50%'}} color='blue'>Fix</Button>
                    <Button onClick={() => this.ferterlize(this.state.currentWeatherReports)} style={{color:'black',width:'50%'}} color='green'>Fertilze</Button>
                </Button.Group>
                </div>
            </Card>
            <p style={{textAlign:'center',color:'white',padding:'5px'}}><a style={{color:'white',opacity:'50%'}} href = "mailto:maxjones2001@hotmail.com?subject=Help">Need help?</a></p>


        </div>
        );
    }     
}

export default Board;