import React, { Component } from 'react'
import PropTypes from 'prop-types';

const MyInput = ({
  value,
  onChange,
  type,
  label,
  name,
  error
}) => (
  <div className="form-group">
    <label>{label}:</label>
    <input
      name={name}
      value={value}
      type={type}
      onChange={onChange}
      className="form-control" />
      {
        error && <div className="alert alert-danger"> <strong>{error}</strong> </div>
      }
  </div>
)

MyInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

MyInput.defaultProps = {
  type: 'text'
}

export default MyInput
