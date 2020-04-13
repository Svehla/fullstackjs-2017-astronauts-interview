import Validator from 'validator';

export default function validateInput(data) {
  let errors = {};

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = 'This field is required';
  }
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = 'This field is required';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'This field is required';
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }


  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}
