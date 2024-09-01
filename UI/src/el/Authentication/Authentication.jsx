import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import axios from '../../api/axios';
import { useToken } from '../../TokenContext';

import './Authentication.css';

function Authentication() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const { token, setToken } = useToken();

    const navigate = useNavigate();

    const LOGIN_URL = '/login';
    const REGISTER_URL = '/register';

    useEffect(() => {
        if (document.cookie) {
            console.log(document.cookie);
        } else {
            console.log('no cookie');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                isRegistering ? REGISTER_URL : LOGIN_URL,
                {
                    username,
                    email: isRegistering ? email : undefined, // Only include email for registration
                    password,
                }
            );

            if (response.status === (isRegistering ? 201 : 200)) {
                if (!isRegistering) {
                    localStorage.setItem('token', response.data.token);
                    navigate('/videos');
                } else {
                    setIsRegistering(false); // Switch back to login form after successful registration
                    alert('Registration Successful');
                }
            } else {
                alert(`Status code not ${isRegistering ? 201 : 200}`);
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                const errorMessage = `Error ${err.response.status}: ${err.response.data.message}`;
                alert(errorMessage);
            } else {
                console.error(err);
            }
        }

        setUsername('');
        setPassword('');
        setEmail('');
    };

    return (
        <div className={`wrapper${isRegistering ? ' active' : ''}`}>
            <div className="form-box">
                <form onSubmit={handleSubmit}>
                    <h1>{isRegistering ? 'Registration' : 'Login'}</h1>

                    <div className="input-box">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                        />
                        <FaUser className="icon" />
                    </div>

                    {isRegistering && (
                        <div className="input-box">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                            />
                            <FaEnvelope className="icon" />
                        </div>
                    )}

                    <div className="input-box">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                        <FaLock className="icon" />
                    </div>

                    <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>

                    <div className="register-link">
                        <p>
                            <a href="#" onClick={() => setIsRegistering(!isRegistering)}>
                                {isRegistering ? 'Login' : 'Register'}
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Authentication;