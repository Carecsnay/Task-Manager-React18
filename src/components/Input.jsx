import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import InputErrorMessage from './InputErrorMessage';
import InputLabel from './InputLabel';

const Input = forwardRef(
  ({ label, errorMessage, id, type, children, ...rest }, ref) => {
    const inputStyles =
      'border-dark-gray rounded-lg border border-solid px-4 py-3 text-sm outline-brand-primary bg-white';

    const renderInputElement = () => {
      if (type === 'select') {
        return (
          <select id={id} className={inputStyles} ref={ref} {...rest}>
            {children}
          </select>
        );
      }

      if (type === 'textarea') {
        return (
          <textarea
            id={id}
            className={`${inputStyles} min-h-[100px] resize-none`}
            ref={ref}
            {...rest}
          />
        );
      }

      return (
        <input
          id={id}
          type={type}
          className={inputStyles}
          ref={ref}
          autoComplete="off"
          {...rest}
        />
      );
    };

    return (
      <div className="flex flex-col space-y-1 text-start">
        <InputLabel
          htmlFor={id}
          className="mt-4 text-sm font-semibold text-brand-dark-blue"
        >
          {label}
        </InputLabel>

        {renderInputElement()}

        {errorMessage && <InputErrorMessage>{errorMessage}</InputErrorMessage>}
      </div>
    );
  }
);

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.node,
};

Input.displayName = 'Input';

export default Input;
