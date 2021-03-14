import { EasybaseProvider, useEasybase } from 'easybase-react';
import { useEffect } from 'react';
import ebconfig from './ebconfig';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import './App.css';
import 'semantic-ui-less/semantic.less';
import { Icon,Button,Card,Divider,Segment, Input, Label } from 'semantic-ui-react';




let state = {
    user:null,
    username:1,
    password:2,
    people:[
        {username:'Jason',
        password:'123'},
        {username:'Max',
        password:'456'}
    ],
    logginIn: 'not'

};


function App(){
    return (
        <EasybaseProvider ebconfig={ebconfig}>
                <Login/>
        </EasybaseProvider>
    );
}

function Login() {
    const { Frame, sync, configureFrame } = useEasybase();
  
    useEffect(() => {
      configureFrame({ tableName: "USERACCOUNTS", limit: 10 });
      sync();
    }, []);
    state.user = Frame();
    
    return Frame();
    
}

function loginUser(){
    let username = state.username;
    let password = state.password;
    let is = state.user.some(function(o){return o.username === username && o.password === password;})
    if(is === true){
        console.log("Succesful login.");
        state.logginIn = 'yes';
        
    }
}

function setUsername  (value)  {state.username = value}
function setPassword  (value) {state.password = value}

export default App;


 // constructor(props) {
    //     super(props);
    //     this.state = {
    //         user:null,
    //         username:1,
    //         password:2,
    //         people:[
    //             {username:'Jason',
    //             password:'123'},
    //             {username:'Max',
    //             password:'456'}
    //         ]

    //     };
    // }
    

    

    
    
//     function GetUsers() {
//         const { Frame, sync, configureFrame } = useEasybase();
    
//         useEffect(() => {
//             configureFrame({ tableName: "USERS", limit: 10 });
//             sync();
//         }, []);
    
    
    
//         return (
//             <div style={{ width: 400 }}>
//             {Frame().map(ele => 
//                 <div >
//                 <h3>{ele.title}</h3>
//                 <p>{ele.description}</p>
//                 <small>{String(ele.createdat).slice(0, 10)}</small>
//                 </div>
//             )}
//             </div>
//         )
//     }
