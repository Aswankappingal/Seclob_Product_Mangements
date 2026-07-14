import { Link, useNavigate } from 'react-router-dom';
import './SignIn.scss';
import { FiLock, FiMail } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import useLogin from '../../redux/hooks/useSignIn';

const SignIn = () => {
    const navigate = useNavigate();
    const { user, login, loading, error, resetError } = useLogin();
    const [formData, setFormData] = useState({ email: '', password: '' });
  
    useEffect(() => {
      if (user) {
        window.location.href='/';
      }
    }, [user, navigate]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      login(formData.email, formData.password);
    };
  
  return (
    <div className="SigninMainWrapper">
      <div className="row">
        <div className="col-lg-7">
          <div className="signup-right">
            <div className="content">
              <h2>
                Sign In to <br />
                Your Account
              </h2>
              {/* {error && (
                <div className="error-message">
                  <p>{error}</p>
                  <button onClick={resetError}>Dismiss</button>
                </div>
              )} */}
              <form onSubmit={handleSubmit}>
                <div className="input">
                  <div className="left">
                    <FiMail className="input-icon" />
                  </div>
                  <div className="right">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="input">
                  <div className="left">
                    <FiLock className="input-icon" />
                  </div>
                  <div className="right">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                   
                </div>
                {error && (
                <div >
                  <p className="error-message">Incorrect email or Password </p>
                </div>
              )}
                {/* <div className='forget-pwd'><Link>forgot password?</Link></div> */}

                <div>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Signing In...' : 'SIGN IN'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="signup-left">
            <div className="content">
              <h1>Hello Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <div>
                <Link to="/signup">
                  <button>SIGN UP</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
