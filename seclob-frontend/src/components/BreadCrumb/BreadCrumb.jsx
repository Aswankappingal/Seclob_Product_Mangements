import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Breadcrumb.scss';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

const Breadcrumb = ({ items }) => {
  return (
    <div className="breadcrumb">
      {items.map((item, index) => (
        <span key={index}>
          {index > 0 && <span className="separator"><MdOutlineKeyboardArrowRight /></span>}
          {index === items.length - 1 ? (
            <span className="current">{item.label}</span>
          ) : (
            <Link to={item.path}>{item.label}</Link>
          )}
        </span>
      ))}
    </div>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Breadcrumb;