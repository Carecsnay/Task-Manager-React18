import PropTypes from 'prop-types';

const DashboardCard = ({ icon, count, contentText }) => {
  return (
    <div className="flex h-36 flex-col items-center justify-center gap-1 rounded-xl py-10">
      <div className="flex items-center gap-2">
        <span className="text-brand-primary">{icon}</span>
        <p className="text-2xl font-semibold text-brand-dark-blue">{count}</p>
      </div>
      <span className="text-sm"> {contentText}</span>
    </div>
  );
};

DashboardCard.propTypes = {
  icon: PropTypes.node,
  count: PropTypes.number.isRequired,
  contentText: PropTypes.string.isRequired,
};

export default DashboardCard;
