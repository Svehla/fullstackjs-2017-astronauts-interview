import React, { Component } from 'react'
//import React from 'react';
//import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';

import 'react-select/dist/react-select.css';

const Creatable = ({
  hint,
  label,
  options,
  multiValue,
  handleOnChange,
}) => (
  <div className="section">
  	<label className="section-heading">{label}</label>
  	<Select.Creatable
  		multi={true}
  		options={options}
  		onChange={handleOnChange}
  		value={multiValue}
  	/>
  	<div className="hint">{hint}</div>
  </div>
);


/*
class Creatable extends Component {
	//displayName: 'CreatableDemo',

  constructor(props){
    super(props)
		this.state = {
			multiValue: this.props.multiValue,
			options: this.props.options
		}
	}

  componentWillReceiveProps(nextProps){
    this.setState({
      options: nextProps.options
    })
  }



	render () {
		const { multiValue, options } = this.state;
		return (
			<div className="section">
				<h3 className="section-heading">{this.props.label}</h3>
				<Select.Creatable
					multi={true}
					options={options}
					onChange={this.props.handleOnChange}
					value={multiValue}
				/>
				<div className="hint">{this.props.hint}</div>
			</div>
		);
	}

};
*/
Creatable.propTypes = {
  hint: PropTypes.string,
  label: PropTypes.string
}

export default Creatable;
