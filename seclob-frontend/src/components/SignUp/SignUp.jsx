import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.scss';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import useUserSignup from '../../redux/hooks/useSignUp';

const SignUp = () => {
    const { signup, loading, error, user } = useUserSignup();
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(formData);
    };
  // Navigate to '/signin' when signup is successful
  useEffect(() => {
    if (user) {
        // navigate('/signin');
        window.location.href='/signin'
    }
}, [user, navigate]);
    return (
        <div className='signUpMainWrapper'>
            <div className="row">
                <div className="col-lg-5">
                    <div className="signup-left">
                        <div className="content">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <div>
                                <Link to='/signin'><button>SIGN IN</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-7">
                    <div className="signup-right">
                        <div className="content">
                            <form onSubmit={handleSubmit}>
                                <h2>Create Account</h2>
                            
                                <div className='input'>
                                    <div className="left"><FiUser className='input-icon' /></div>
                                    <div className="right">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='input'>
                                    <div className="left"><FiMail className='input-icon' /></div>
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
                                <div className='input'>
                                    <div className="left"><FiLock className='input-icon' /></div>
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
                                {error && <p className="error-message">{error.message || "Email is already exist"}</p>}
                                <div>
                                    <button type="submit" disabled={loading}>
                                        {loading ? 'Signing Up...' : 'SIGN UP'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
