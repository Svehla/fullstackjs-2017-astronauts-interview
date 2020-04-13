import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo';
import { Link } from 'react-router-dom'
import axios from 'axios'
//toasts
import { toast } from 'react-toastify';
//intl
import { FormattedDate  } from 'react-intl'
var c = console.log

const MyQuery = gql`
query FetchAstronauts{
	allAstronauts(
    orderBy: BIRTH_DATE_DESC
  ){
   nodes{
      id
      fullName
      email
      birthDate
			age: getAge
			color
      astronautsSuperPowersMapsByIdAstronaut {
      	nodes {
        	superPowerByIdSuperPower {
            name
            id
          }
        }
      }
    }
  }
} `



class Test extends Component {

	defaultTimeSec = 10

	constructor(props){
		super(props)
		this.state = {
			currentCount: this.defaultTimeSec
		}
	}

	timer = () => {
		let newTimeSec
		if(this.state.currentCount < 1) {
			newTimeSec = this.defaultTimeSec
			this.onRefreshClicked()
    }else{
			newTimeSec = this.state.currentCount - 1
		}
    this.setState({
      currentCount: newTimeSec
    })
  }

	componentDidMount() {
    this.intervalId = setInterval(this.timer, 1000);
  }

	componentWillUnmount(){
    clearInterval(this.intervalId);
  }

	onRefreshClicked = () => {
    this.props.data.refetch();
		c('refetch')
		//warning!!!! use document => server side rendering
		// show only if window is focus
		if(!document.hidden){
			toast.info("All data are sync", {
				autoClose: 1500
			});
		}
  }

	truncateAllData = async () => {
		await axios.post('http://localhost:1337/trunacateAllData')

    this.onRefreshClicked()
  }

  render(){
    const { data: {loading, error, allAstronauts }} = this.props
    //c(this.props.mutate)
    //c(allAstronauts)
    if (loading) {
      return <div className="container">Loading</div>;
    }else if (error) {
      return <div className="container">Error! { error.toString() }</div>;
    }else{
      return (
        <div className="container">
					<h2>List of all users</h2>

					<Link to="/createAstronaut">
						<button className="btn">Create new astronaut</button>
					</Link>&nbsp;
					<button onClick={this.onRefreshClicked} className="btn">Refresh</button>&nbsp;
					<a target="_blank" rel="noopener noreferrer" href='http://localhost:1337/getAll'>
						<button className="btn">Rest api show demo</button>
					</a>&nbsp;

					<button onClick={this.truncateAllData} className="btn">Truncate all data</button>

					<div>
						<small>Automatic refetch in { this.state.currentCount } sec <small>(no socket.io)</small></small>

					</div>
					<table className="table">
            <thead>
              <tr>
              { ['', '', 'ID', 'Full name', 'Email', 'Age', 'Birth date', 'Super powers'].map( (head, index) => (
                  <th key={index}>{head}</th>
                ))
              }
              </tr>
            </thead>
            <tbody>
              {

                allAstronauts.nodes.map( astronaut => (
                  <tr key={astronaut.id}>
										<td style={{
											background: astronaut.color,
											fontSize: '20px',
											width: '30px',
											color: '#fff'
										}}>
											{ astronaut.fullName[0].toUpperCase() }
										</td>
										<td>
											<Link to={`/showAstronaut/${astronaut.id}`}>
												Detail
											</Link>
										</td>
                    {
                      ['id', 'fullName', 'email', 'age'].map( (key, index) => (
                        <td key={index}>
                          {astronaut[key]}
                        </td>
                      ))
                    }
										<td>
											<FormattedDate
												value={astronaut.birthDate}
												year='numeric'
											  month='long'
											  day='2-digit'
											/>
										</td>
                    <td>
                    {
                      astronaut.astronautsSuperPowersMapsByIdAstronaut.nodes.map( (superPower, index) => (
                        <span key={Math.random()}>
													<Link to={`/showSuperPower/${superPower.superPowerByIdSuperPower.id}`}>
														<b>{ superPower.superPowerByIdSuperPower.name }</b>
													</Link> | &nbsp;
												</span>
                      ))
                    }
                    </td>

                  </tr>
              ))
            }
            </tbody>
          </table>

        </div>
      )
    }
  }
}

const MyComponentWithData = graphql(MyQuery)(Test);
export default MyComponentWithData
