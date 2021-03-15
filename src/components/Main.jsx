import React from 'react';
import axios from 'axios';
import '../css/Main.css';
import LoginForm from "./Login";

import 'semantic-ui-less/semantic.less';
import { Icon,Button,Card,Divider,Segment, Input, Label } from 'semantic-ui-react';



class Main extends React.Component {
    
    constructor() {
      super();
        this.state = {
           
           
        }
        
        
    }
    
    
    
    render() {
        return(
            <div >
                <LoginForm/>
            </div>
        );
    }

       
}


export default Main;