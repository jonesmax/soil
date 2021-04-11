import React from 'react';
import axios from 'axios';
import '../css/Main.css'
import Board from './Board';

import 'semantic-ui-less/semantic.less';
import { Icon,Button,Card,Divider,Segment, Input, Label, Image } from 'semantic-ui-react';



class Login extends React.Component {
    
    constructor() {
      super();
        this.state = {
            users: null,
            username: null,
            password: null,
            status: ' ',
        }
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
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
        axios.post('http://3.15.10.36/users/login',user )
        .then(res => {
          if(!res.data){
              console.log("no user found");
              this.setState({status: "Not Succesful",});
          }
          else{
            localStorage.setItem("user",JSON.stringify(res.data));
            this.setState({status: "Success",
                            user:res.data});
          }
      })
    }
    loginForm(){
        return(
            <div className='blur' style={{padding:'30px'}}>
                <Card style={{margin:'auto',padding:'10px',marginTop:'30px',backgroundColor:'rgb(245, 245, 245,0.85)'}}>
                    <Card.Header>
                        <h1 style={{textAlign:'center',fontFamily:'Cinzel',marginTop:'10px'}}>Soil</h1>
                        <p style={{textAlign:'center',fontSize:'12px'}}>Sign in to continue</p>
                    </Card.Header>
                    <Divider></Divider>
                    <Input onChange={this.handleUsername} style={{padding:'10px',paddingBottom:'5px',paddingTop:'5px',fontSize:'16px'}} placeholder='Username'></Input>
                    <Input  onKeyPress={event => {if (event.key === 'Enter') {this.loginUser()}}} type="password" onChange={this.handlePassword} style={{padding:'10px',fontSize:'16px'}} placeholder='Password'></Input>
                    <div style={{marginTop:'10px',textAlign:'center'}}>
                        <Button onClick={() => this.loginUser()} style={{padding:'10px',width:'50%',margin:'auto'}} color='green'>Login</Button>
                        <p style={{marginTop:'5px',color:'red'}}>{this.state.status}</p>
                    </div>
                    <p style={{textAlign:'center',paddingTop:'10px',opacity:'50%',paddingBottom:'5px'}}>to recieve an account, click <a href = "mailto:maxjones2001@hotmail.com?subject=Request soil account">here</a>.</p>
                </Card>
               
                <p style={{color:'white',textAlign:'center',opacity:'60%',padding:'3px'}}><a rel="noreferrer" style={{color:'white',textAlign:'center',textDecoration:'none'}} href = "https://maxwelljonesdesign.com/" target="_blank" > maxwelljonesdesign.com</a></p>
            </div> 
        );
    }

    componentDidMount(){
        if(localStorage.getItem("user")){
            let user = JSON.parse(localStorage.getItem("user"));
            this.setState({user: user});
        }
    }
    render() {
        return(
            <div>
                {!this.state.user && this.loginForm()} 
                {this.state.user && <Board user={this.state.user} />}
            </div>
        );
    }

       
}


export default Login;