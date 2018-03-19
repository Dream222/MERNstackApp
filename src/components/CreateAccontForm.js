import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import ReactPasswordStrength from 'react-password-strength'
import PasswordStrength from './PasswordStrength'
import './password-strength-widget.css'
import './trio.css'

// semantic-ui
import { Container, Form, Input, Button, Grid, Dropdown, Select, Progress } from 'semantic-ui-react'

// API
import * as MyAPI from '../utils/MyAPI'
import { LOCAL_STRAGE_KEY } from '../utils/Settings'

import Alert from 'react-s-alert';
import { loginWithEmailRedux } from '../actions/UserActions'
import { options } from './constant'

class CreateAccontForm extends Component {

  // state = {
  //   email: '',
  //   password: '',
  //   ProgressBar: '',
  // }

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      ProgressBar: 0,
      ProgressBar_color: 'red',
      ProgressBar_flag: {
                  num:0,
                  uppercase:0,
                  smallcase:0,
                  special:0,
               }
    };
    this.onProgressBar = this.onProgressBar.bind(this)


  }

  

  onSubmit = () => {

    const { email, password, sex, birthday, address, password_2} = this.state

    const params = {
      email: email,
      password: password,
      password_2: password_2,
      sex: sex,
      birthday: birthday,
      address: address
    }

    

    // create account
    MyAPI.createAccount(params)
    .then((data) => {
      // save account

      // success
      const params = {
        user: data.user,
        login_token: data.login_token,
      }

      localStorage.setItem(LOCAL_STRAGE_KEY, JSON.stringify(params))

      this.props.mapDispatchToLoginWithPassword(params)

    })
    .then(() => {
      // redirect
      this.props.history.push("/dashboard")
    })
    .catch((err) => {
      console.log("err:", err)

      Alert.error(err, {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });
    })
  }

  // onDuplicated = () => {
  //   Alert.error("duplicate", {
  //     position: 'top-right',
  //     effect: 'slide',
  //     timeout: 5000
  //   });
  // }
  onProgressBar = (e, {value}) => {
    this.setState({ password: value })
    var progress_temp=0;
    var total_num = 0;
    console.log("step1=",value)

    var lowcase_count =(value.match(/[a-z]/g)||[]).length;
    var uppercase_count =(value.match(/[A-Z]/g)||[]).length;
    var num_count = (value.match(/[0-9]/g)||[]).length;
    var special_count = (value.match(/[!@#$%^&*]/g)||[]).length;
    // if(charact_count==0){
    //   var count_limit = 7;
    // }
    // if( charact_count>0 && charact_count<=8){
    //   progress_temp = charact_count*10;
    // }else{
    //   progress_temp = 80;
    //   charact_count = 8;
    // }
    // if(num_count<(){
    //   total_num = total_num + num_count;
    //   progress_temp = progress_temp + num_count*10;
    // }else{
    //   count_limit = 9;
    //   progress_temp = 90;
    // }
    // if(special_count<(9-total_num)){
    //   total_num = total_num + special_count;
    //   progress_temp = progress_temp + special_count*10
    // }else{
    //   total_num = 9;
    //   progress_temp = 90;
    // }
    // this.setState({ProgressBar:progress_temp})
    
    if(lowcase_count>0){
      var _progress_lowcase = 25
    }else{
       _progress_lowcase = 0
    }
    if(uppercase_count>0){
      var _progress_uppercase = 25
    }else{
      _progress_uppercase = 0
    }
    if(num_count){
      var _progress_num = 25
    }else{
      _progress_num = 25
    }
    if(special_count){
      var _progress_special = 25
    }else{
      _progress_special = 0
    }
    var _progress = _progress_special + _progress_num + _progress_uppercase + _progress_lowcase
    if(value == ""){
      _progress = 0
    }
    console.log(_progress_num )
    this.setState({
      ProgressBar: _progress
    })
    
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  render() {

    const { email, password } = this.state

    return(
      <Container text className='create_acount_form'>


        <Form onSubmit={this.onSubmit} style={{marginTop:60}}>
          <Grid>

            <Grid.Column textAlign='left' width={16}>
              <label>Email</label>
              <Input
                type="email"
                style={{width: '100%'}}
                icon='mail outline'
                iconPosition='left'
                name='email'
                onChange={this.handleChange}
                value={email}
                placeholder='yourname@example.com' />
            </Grid.Column>

            <Grid.Column textAlign='left' width={16}>
              <label>Password</label>
              <Input
                type="password"
                style={{width: '100%'}}
                icon='key'
                iconPosition='left'
                name='password'
                
                value={this.state.password}
                // placeholder='********' 
                onChange={this.onProgressBar}/>
            </Grid.Column>

            

            <Grid.Column textAlign='left' width={16}>
              <label>Sex</label>
              <Dropdown name="sex" placeholder='sex' fluid  selection options={options} />

            </Grid.Column>


            <Grid.Column textAlign='left' width={16}>
              <label>Birthday</label>
              <Input
                type="date"
                style={{width: '100%'}}
                iconPosition='left'
                name='birthday'
                onChange={this.handleChange}
                
                placeholder='' />
            </Grid.Column>

            <Grid.Column textAlign='left' width={16}>
              <label>Address</label>
              <Input
                type="text"
                style={{width: '100%'}}
                iconPosition='left'
                name='address'
                onChange={this.handleChange}
                
                placeholder='' />
            </Grid.Column>
           
            <Grid.Column width={16}>
              <Progress percent={this.state.ProgressBar} color={this.state.ProgressBar_color} />
            </Grid.Column>

            <Grid.Column width={16}>
              <Button
                style={{width: '100%'}}
                loading={this.state.loading}
                disabled={this.state.loading}
                type='submit'>Create an account</Button>
            </Grid.Column>

            <Grid.Column width={16}>
              <Button
                style={{width: '100%'}}
                loading={this.state.loading}
                disabled={this.state.loading}
                type='submit'>Duplicated</Button>
            </Grid.Column>

          </Grid>

        </Form>

      </Container>
    )
  }
}

// react-redux
function mapStateToProps ( {user} ) {
  return {
    user
  }
}

function mapDispatchToProps (dispatch) {
  return {
    mapDispatchToLoginWithPassword: (data) => dispatch(loginWithEmailRedux({ params: data})),
  }
}

// export default withRouter(MainPage);
export default withRouter( connect( mapStateToProps, mapDispatchToProps )(CreateAccontForm) )
