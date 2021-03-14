import React from 'react';
import axios from 'axios';
import './Main.css';


import 'semantic-ui-less/semantic.less';
import { Icon,Button,Card,Divider,Segment, Input, Label } from 'semantic-ui-react';



class Main extends React.Component {
    
    constructor() {
      super();
        this.state = {
            users: null,
            username: null,
            password: null,
            status: 'No User',
            weather: null,
            location: 'Pond Mills, CA',
            newWeather:null,
        }
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleWeather = this.handleWeather.bind(this);
    }
    getWeather(){
        let location;
        if(this.state.newWeather){
            location = this.state.newWeather;
            this.setState({location: location});
        }
        else{
            location = this.state.location;
        }
        
        let url = 'http://api.openweathermap.org/data/2.5/weather?q='+location+'&units=metric&appid=86583fb8344f78f0fdf02aa0d9e1859c';
        axios.get(url)
          .then(res => {
            const weather = res.data;
            this.setState({weather: weather});
            console.log('got that weather');
        })
    }
    componentDidMount() {
        this.getWeather();
    }
    handleWeather(event) {
        let location2=event.target.value+', CA';
        this.setState({newWeather: location2});
    }
    handleUsername(event) {
        this.setState({username: event.target.value});
    }
    handlePassword(event) {
        this.setState({password: event.target.value});
    }
    loginUser(){
        let user = {
            username: this.state.username,
            password: this.state.password,
        }
        axios.post('http://127.0.0.1:8081/users/login',user )
        .then(res => {
          if(!res.data){
              console.log("no user found");
              this.setState({status: "Not Succesful",});
          }
          else{
              console.log(res.data);
              this.setState({status: "Success",
                            user:res.data});
          }
      })
    }
    loginForm(){
        return(
            <div style={{padding:'30px'}}>
                <Card style={{margin:'auto',padding:'10px'}}>
                    <Card.Header><h1 style={{textAlign:'center'}}>Login</h1></Card.Header>
                    <Divider></Divider>
                    <Input onChange={this.handleUsername} style={{padding:'10px'}} placeholder='Username...'></Input>
                    <Input type="password" onChange={this.handlePassword} style={{padding:'10px'}} placeholder='Password...'></Input>
                    <div style={{marginTop:'10px',textAlign:'center'}}>
                        <Button onClick={() => this.loginUser()} style={{padding:'10px',width:'50%',margin:'auto'}} color='green'>Login</Button>
                    </div>
                    <Label style={{margin:'20px',textAlign:'center'}}>{this.state.status}</Label>
                </Card>
            </div> 
        );
    }
    getToday(){
        var objToday = new Date(),
        weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayOfWeek = weekday[objToday.getDay()],
        domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 === a ? "st" : 2 === a ? "nd" : 3 === a ? "rd" : "th" }(),
        dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        curMonth = months[objToday.getMonth()],
        curYear = objToday.getFullYear(),
        curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
        curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
        curMeridiem = objToday.getHours() > 12 ? "pm" : "am";
        var today = curHour + ":" + curMinute + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
        return today;
    }
    App(){
        return(
        <div style={{padding:'30px'}}>
            <Card style={{width:'100%',margin:'auto',padding:'10px'}}>
                <Card.Header>
                    <h1 style={{fontSize:'15px',textAlign:'center'}}>{this.getToday()}</h1>
                    {this.state.weather &&
                    <h2 style={{fontSize:'15px',textAlign:'center'}}>Currently {this.state.weather.main.temp}° in {this.state.location}</h2>
                    }
                    <Input onChange={this.handleWeather} style={{padding:'10px'}} placeholder='City'></Input><Button onClick={() => this.getWeather()} color='green'>Change Weather</Button>
                </Card.Header>
                <Divider></Divider>
               
            </Card>
        </div>);
    }
    
    render() {
        return(
            <div>
                {!this.state.user && this.loginForm()}
                {this.state.user && this.App()}
            </div>
        );
    }

       
}


export default Main;