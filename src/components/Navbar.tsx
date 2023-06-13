import { Link } from 'react-router-dom';
import logo from './navpic.png';
import "./navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <a className="navbar-brand" href="#"> 
      <img src={logo} alt="navbar-logo" className="navbar-logo" />
      </a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/components/Dashboard">
                Weather
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/components/Tech">
                Tech + AI
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
