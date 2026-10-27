import PropTypes from 'prop-types';

const DashboardGrid = ({ title, subtitle, children }) => {
  return (
    <div className="space-x-3 rounded-xl bg-brand-white p-6">
      <div className="min-h-12">
        <h3 className="text-xl font-semibold text-brand-dark-blue">{title}</h3>
        <p className="text-sm text-brand-text-gray">{subtitle}</p>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
};

DashboardGrid.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};
export default DashboardGrid;
