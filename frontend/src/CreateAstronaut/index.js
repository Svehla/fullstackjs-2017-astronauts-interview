import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo';
import { MyInput, Creatable } from '../sharedComponents'
//import { Redirect } from 'react-router';
//shared functions
import validateInput from './validations';
//third party libs
import moment from 'moment';
//third party components
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { SketchPicker } from 'react-color';

//toast
import { toast } from 'react-toastify';


var c = console.log


const MyMutation = gql(`
  mutation newAstronaut($astronaut: Json, $superPowers: Json){
  	addAstronaut(
      input: {
        astronaut: $astronaut,
        superpowers: $superPowers
      }
    ) {
  	  clientMutationId
  	}
  }
`)

const MyQuery = gql(`
query fetchSuperPowers {
  allSuperPowers {
    nodes {
      id
      name
    }
  }
}
`)

const getRandomDec = () => Math.floor(Math.random()*10)
const getRandomColor = () => (
  `#${getRandomDec()}${getRandomDec()}${getRandomDec()}`
)

class NewAstronaut extends Component {

  constructor(props){
    super(props)
    this.state = {
      astronautColor: getRandomColor(),
      firstName: "Brooks",
      lastName: "Curry",
      email: "Brooks@fce.com",
      superPowers: [],
      birthDate: moment('9-12-1900 00:00', "MM-DD-YYYY"), //,
      errors: {},
      isLoading: false,
      successAdded: false,
    }
  }

  onChange = e => {
    this.setState({[e.target.name]: e.target.value})
  }

  onChangeDate = date => {
    this.setState({birthDate: date})
  }


  isValid = () => {
    const { errors, isValid } = validateInput(this.state);
    if (!isValid) {
      this.setState({ errors });
    }
    return isValid;
  }

  handleChangeComplete = (color) => {
    this.setState({ astronautColor: color.hex });
  };

  sendForm = async(e) => {
    e.preventDefault()
    if(this.isValid()){
      try{
        toast.success("You added new user (SPA) 800 ms delay for SPA effect");
        this.setState({ isLoading: true });
        await this.props.mutate({ variables: {
          astronaut: JSON.stringify({
            ...this.state,
            color: this.state.astronautColor
          }),
          superPowers: JSON.stringify(this.state.superPowers)
        }})

        setTimeout( () => {
          this.setState({ isLoading: false, successAdded: true })
          this.props.history.push('/allAstronauts')
        }, 800)


      }catch(error){
        toast.error("Can't add new user");
        console.log('there was an error sending the query', error.toString());
      }
    }
  }

  render(){
    //c('______')
    //c(this.state)
    //c(this.props)
    const { errors, firstName, lastName, email } = this.state
    const { data: {loading, error, allSuperPowers }} = this.props
    const optionsFetch = allSuperPowers ? allSuperPowers.nodes.map( superPower => ({
      value: superPower.id,
      label: superPower.name
    })) : []
    //c(this.state.astronautColor)
    if (loading) {
  		return <div className="container">Loading</div>;
  	}else if (error) {
  		return <div className="container">Error! { error.toString() }</div>;
  	}else{
      return(
        <div className="container">

         <h2> Create astronaut: {this.state.firstName} {this.state.lastName}</h2>
         <div style={{height: '5px', width: '100%', background: this.state.astronautColor}}>&nbsp;</div>
          <form onSubmit={this.sendForm}>

            <div className="row">
              <div className="col-md-9">
                <MyInput
                  error={ errors.firstName }
                  value={ firstName }
                  name="firstName"
                  onChange={this.onChange}
                  label="First name"
                />
                <MyInput
                  error={ errors.lastName }
                  value={ lastName }
                  name="lastName"
                  onChange={this.onChange}
                  label="Last name"
                />
                <MyInput
                  error={ errors.email }
                  value={ email }
                  name="email"
                  onChange={this.onChange}
                  label="Email"
                />

                <Creatable
            			hint=""
            			label="Super Powers"
                  options={ optionsFetch }
                  multiValue={ this.state.superPowers }
                  handleOnChange={
                    (value) => {
                      console.log(value)
                  		this.setState({ superPowers: value });
                  	}
                  }
                />

                <label>Birth date:</label>
                <DatePicker
                  className="form-control"
                  selected={this.state.birthDate}
                  onChange={this.onChangeDate}
                />
              </div>
              <div className="col-sm-3">
                <label>Your color:</label>
                <SketchPicker
                  color={ this.state.astronautColor }
                  onChangeComplete={ this.handleChangeComplete }
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <button
                  disabled={this.state.isLoading}
                  style={{marginTop: '10px'}}
                  className="btn btn-primary btn-lg">
                Create astronaut</button>
              </div>
            </div>
          </form>
        </div>
      )
    };
  };
}

const NewAstronautWithData = graphql(MyQuery)(NewAstronaut);
const NewAstronautWithMutation = graphql(MyMutation, {
  options: {
    refetchQueries: [
      'FetchAstronauts',
      'getOneSuperPower',
      'fetchSuperPowers',
    ]
  }
})(NewAstronautWithData);

export default NewAstronautWithMutation



//
