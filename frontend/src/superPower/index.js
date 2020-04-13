import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import { Link } from 'react-router-dom'
const c = console.log
const MyQuery = gql`
query getOneSuperPower( $superPowerId: Int!){
	superPowerById(id: $superPowerId){
    id
    name
    astronautsSuperPowersMapsByIdSuperPower{
      nodes {
      	astronautByIdAstronaut{
          id
          firstName
          lastName
          email
					color
        }
      }
    }
  }
}`


const SuperPowerWithData = props =>  {

  const { data: {loading, error, superPowerById }} = props
  //c(this.props.mutate)
  //c(allAstronauts)
	if (loading) {
    return <div className="container">Loading</div>;
  }else if (error) {
    return <div className="container">Error! { error.toString() }</div>;
  }else{
    c(superPowerById)
    return (
      <div className="container">
				<h1>Super Powers: {superPowerById.name}</h1>

				<h3>Users with same super power:</h3>
				<ul>
				{
					superPowerById.astronautsSuperPowersMapsByIdSuperPower.nodes.map( astronaut => (
							<li key={astronaut.astronautByIdAstronaut.id}>
								<Link to={`/showAstronaut/${astronaut.astronautByIdAstronaut.id}`}>
									<span style={{background: astronaut.astronautByIdAstronaut.color}}>&nbsp;&nbsp;&nbsp;</span>
									{ astronaut.astronautByIdAstronaut.firstName}&nbsp;
									{ astronaut.astronautByIdAstronaut.lastName}
								</Link>
							</li>
					))
				}
				</ul>
				{/*
        <pre>
          {JSON.stringify(superPowerById, null, 2)}
        </pre>
				*/}
      </div>
    )
  }
}

const ShowSuperPowerWithData = graphql(MyQuery, {
  options: (props) => {
    return { variables: {
        "superPowerId": props.match.params.idSuperPower
      }
    }
  }
})(SuperPowerWithData);
export default ShowSuperPowerWithData







//
