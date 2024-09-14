import React, { useState } from 'react';
import { Container, Form, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';
import {useLocation,useNavigate} from 'react-router-dom'

const validateField = (name, value, formData) => {
    switch (name) {
        case 'username':
            return value.length >= 3 ? '' : 'Username must be at least 3 characters long.';
        case 'email':
            return /\S+@\S+\.\S+/.test(value) ? '' : 'Please provide a valid email address.';
        case 'password':
            const passwordRequirements = [
                /[A-Z]/.test(value),
                /[a-z]/.test(value),
                /[0-9]/.test(value),
                /[\W_]/.test(value),
                value.length >= 6
            ];

            const failedRequirements = passwordRequirements.map((isValid, index) => {
                if (!isValid) {
                    switch (index) {
                        case 0:
                            return 'Password must include at least one uppercase letter.';
                        case 1:
                            return 'Password must include at least one lowercase letter.';
                        case 2:
                            return 'Password must include at least one number.';
                        case 3:
                            return 'Password must include at least one special character.';
                        case 4:
                            return 'Password must be at least 6 characters long.';
                        default:
                            return '';
                    }
                }
                return '';
            }).filter(message => message !== '');

            return failedRequirements.length > 0 ? failedRequirements.join(' ') : '';
        case 'confirmPassword':
            return value === formData.password ? '' : 'Passwords do not match.';
        default:
            return '';
    }
};

function Register() {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({});
    const [passwordValid, setPasswordValid] = useState(true); // New state for password validity

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => {
            const updatedFormData = { ...prevFormData, [name]: value };
            const errorMessage = validateField(name, value, updatedFormData);

            if (name === 'password') {
                // Check if the password is valid and update the state
                const isPasswordValid = !errorMessage;
                setPasswordValid(isPasswordValid);
            }

            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: errorMessage
            }));

            setSuccess((prevSuccess) => ({
                ...prevSuccess,
                [name]: !errorMessage
            }));

            return updatedFormData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        const isFormValid = form.checkValidity() && !Object.values(errors).some((error) => error);

        if (!isFormValid) {
            setValidated(true);
            return;
        }

        setValidated(true);
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, formData);
            console.log("response = ", response);
            if (response.status === 201) {
                toast.success('Registration successful!');
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                setErrors({});
                setSuccess({});
                setValidated(false);
                navigate('/management_dashboard');
            }
        } catch (err) {
            console.log("hello");
            const errorMessage = err.message || 'Registration failed';
            setErrors({ form: errorMessage });
            toast.error('Registration failed!');
        } finally {
            setLoading(false);
        }
    };

    const isFormInvalid = !Object.values(errors).every(error => !error) || loading;

    return (
        <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="registration-card p-4 position-relative">
                {loading && (
                    <div className="loader-overlay">
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}
                <h2 className="text-center mb-4">Register</h2>
                {errors.form && <Alert variant="danger">{errors.form}</Alert>}
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    {['username', 'email', 'password', 'confirmPassword'].map((field) => (
                        <Form.Group controlId={field} key={field}>
                            <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</Form.Label>
                            <Form.Control
                                type={field.includes('password') ? 'password' : 'text'}
                                placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1')}`}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                isInvalid={!!errors[field]}
                                isValid={success[field]}
                                required
                                autoComplete='off'
                                disabled={field === 'confirmPassword' && !passwordValid} // Disable confirmPassword field
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors[field]}
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="valid">
                                Looks good!
                            </Form.Control.Feedback>
                        </Form.Group>
                    ))}
                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100 mt-3"
                        disabled={isFormInvalid}
                    >
                        Register
                    </Button>
                </Form>
                <ToastContainer />
            </div>
        </Container>
    );
}

export default Register;
