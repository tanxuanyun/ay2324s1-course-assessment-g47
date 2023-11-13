import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/Login.css";
import * as Constants from "../constants/constants.js";

function LoginPage(props) {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		loginError: "",
		loginSuccess: "",
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const { email, password } = formData;

		try {
			const response = await fetch(
				`http://localhost:${Constants.POSTGRESQL_PORT}/users/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				}
			);

			if (response.status === 200) {
				// Successful login
				const json = await response.json();
				// Set isSignIn to true
				props.onSuccessLogin(json);
				setFormData({
					...formData,
					loginSuccess: json.message,
					loginError: "",
				});
				console.log("Login successful");
			} else if (response.status === 401) {
				// Invalid email or password
				const errorData = await response.json();
				setFormData({
					...formData,
					loginError: errorData.error,
					loginSuccess: "",
				});
				console.log("Login failed: " + errorData.error);
			} else {
				// Handle other error cases
				console.log("Server error");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="login-container">
			<h1 className="login-label">Login</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>
				{formData.loginError && (
					<p className="error">{formData.loginError}</p>
				)}
				{formData.loginSuccess && (
					<p className="success">{formData.loginSuccess}</p>
				)}
				<button type="submit">Login</button>
			</form>
			<div>
				<Link to="/register">Not a user? Sign up now</Link>
				<br />
				<Link to="/verifyOTP">
					Click here to verify your account now!
				</Link>
			</div>
			{/* <div>
				<Link to="/forgetPassword">Forgot password? Reset here</Link>
			</div> */}
		</div>
	);
}

export default LoginPage;
