import React, { useEffect, useState } from "react";
import { Container, Form, Button, Spinner, Card, Alert, Col, Row } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './login.css';
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    const [customHeight, setCustomHeight] = useState(window.outerHeight);
    const [formData, setFormData] = useState({});
    const handleLogin = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, formData);
            console.log("response = ",response);
            if(response.status == '200'){
                
            }
            toast.success('Login successful!');
        } catch (error) {
            toast.error('Login failed. Please check your credentials.');
            console.error(error);
        }
        finally{
            setLoading(false);
            setFormData({email:'',password : ''})
        }
    };
    useEffect(() => {
        const handleResize = () => setCustomHeight(window.outerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    return (
        <Container fluid className="">
            <Row>
                <Col lg={5} md={6} xs={12}>
                    <Card className="customCard">
                        <Card.Img variant="top" src="/Logo.png" alt="tms logo" />
                        <Card.Body>
                            <Card.Title>Welcome to TMS</Card.Title>
                            <Card.Text>Sign into Your Account</Card.Text>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword" className="mt-3">
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" size="lg" disabled = {loading} onClick={handleLogin} type="submit" className="mt-4 mb-4">
                                    <FontAwesomeIcon icon={faUser} /> Login
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={7} md={6} style={{ padding: "0" }} xs={12}>
                    <img src="login.jpg" alt="backGroundImage" className="img-fluid" style={{ height: customHeight }}></img>

                </Col>
            </Row>
            <ToastContainer />
        </Container>
    );
};

export default Login;
