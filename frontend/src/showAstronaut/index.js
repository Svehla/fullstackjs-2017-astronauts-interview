import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import { Link } from 'react-router-dom'
const c = console.log

const MyQuery = gql`
query getOneAstronaut( $astronautId: Int!){
	astronautById(id: $astronautId){
    id
    firstName
    lastName
    email
    birthDate
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
}`

const ShowAstronaut = (props) => {

  const { data: {loading, error, astronautById }} = props
  //c(this.props.mutate)
  //c(allAstronauts)
	if (loading) {
		return <div className="container">Loading</div>;
	}else if (error) {
		return <div className="container">Error! { error.toString() }</div>;
	}else{
    c(astronautById)
    return (
      <div className="container" >
				<div style={{background: astronautById.color}}>&nbsp;</div>
        <h1>{astronautById.firstName} {astronautById.lastName}</h1>
        <p>Datum narození: {astronautById.birthDate} </p>
        <p>Email: {astronautById.email} </p>
        <h3>Super powers:</h3>
				{
					astronautById.astronautsSuperPowersMapsByIdAstronaut.nodes.length === 0
						&& 'Sorry, This user has no super powers'
				}
        <ul>
          {
            astronautById.astronautsSuperPowersMapsByIdAstronaut.nodes.map( superPower => (
              <li key={superPower.superPowerByIdSuperPower.id}>
                <Link to={`/showSuperPower/${superPower.superPowerByIdSuperPower.id}`}>
                  { superPower.superPowerByIdSuperPower.name }
                </Link>
              </li>
            ))
          }
        </ul>
        {/*
          <pre>{JSON.stringify(astronautById,null,2)}</pre>
        */}

      </div>
    )
  }
}


const ShowAstronautWithData = graphql(MyQuery, {
  options: (props) => {
    return { variables: {
        "astronautId": props.match.params.idAstronaut
      }
    }
  }
})(ShowAstronaut);
export default ShowAstronautWithData
