import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { tv } from 'tailwind-variants';

const sidebar = tv({
  base: 'flex items-center gap-2 rounded-lg px-6 py-3',
  variants: {
    color: {
      unselected: 'text-brand-dark-blue',
      selected: 'bg-brand-primary text-brand-light-gray',
    },
  },
  defaultVariants: {
    color: 'unselected',
  },
});
const SidebarButton = ({ children, to }) => {
  return (
    <>
      <NavLink
        to={to}
        className={({ isActive }) =>
          sidebar({ color: isActive ? 'selected' : 'unselected' })
        }
      >
        {children}
      </NavLink>
    </>
  );
};

SidebarButton.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

export default SidebarButton;
