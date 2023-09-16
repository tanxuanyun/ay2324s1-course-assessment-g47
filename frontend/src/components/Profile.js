import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginPage from "./Login";
import "./css/Profile.css";

function Profile({ user, handleUserChange, handleLogout, handleLogin }) {
	const postgresqlPort = 4001;
	const [isEditing, setIsEditing] = useState(false);
	const [localUser, setLocalUser] = useState({
		username: user ? user.username : "",
		email: user ? user.email : "",
	});

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleSaveClick = async (e) => {
		e.preventDefault();
		setIsEditing(false);
		handleUserChange(localUser);
		//get user id from local storage then update user info
		try {
			console.log(user);
			const response = await fetch(
				`http://localhost:${postgresqlPort}/users/update/${user.user_id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(localUser),
				}
			);

			if (response.status === 200) {
				//successful update
				console.log("Update successful");
			} else {
				// Handle other error cases
				console.log("Server error");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleDeleteClick = async (e) => {
		e.preventDefault();

		// Show a confirmation dialog
		const confirmed = window.confirm(
			"Are you sure you want to delete this user?"
		);

		if (confirmed) {
			try {
				const response = await fetch(
					`http://localhost:${postgresqlPort}/users/delete`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(user),
					}
				);

				if (response.status === 200) {
					//successful delete
					console.log("Delete successful");

					handleLogout();
				} else if (response.status === 401) {
					// Invalid email or password
					const errorData = await response.json();
					console.log("Delete failed: " + errorData.error);
				} else {
					// Handle other error cases
					console.log("Server error");
				}
			} catch (error) {
				console.error("Error:", error);
			}
		}
	};

	return user ? (
		<>
            <div className="header">
                <div className="left">
						{ 	!isEditing ? (
								<Link className="button-link" to="/">Dashboard</Link>
							) : null
						}
                    </div>
                    <div className="center">
                        <h1>Profile Settings</h1>
                    </div>
                    <div className="right">
                        <p>
                            <button className="button-link" onClick={() => handleLogout()}>Logout</button>
                        </p>
                    </div>
                </div>{" "}
		<div className="profile-container">
			<div className="username-wrapper">
				<label className="login-label">Username:</label>
				{isEditing ? (
					<input
						className="login-input"
						type="text"
						onChange={(e) => {
							setLocalUser({
								...localUser,
								username: e.target.value,
							});
						}}
						value={localUser.username}
						name="username"
					/>
				) : (
					<span>{user.username}</span>
				)}
			</div>
			<div className="email-wrapper">
				<label className="login-label">Email:</label>
				{isEditing ? (
					<input
						className="login-input"
						type="email"
						onChange={(e) => {
							setLocalUser({
								...localUser,
								email: e.target.value,
							});
						}}
						value={localUser.email}
						name="email"
					/>
				) : (
					<span>{user.email}</span>
				)}
			</div>
			<div className="buttons">
				{isEditing ? (
					<button
						className="login-button"
						onClick={(e) => handleSaveClick(e)}
					>
						Save
					</button>
				) : (
					<>
						<button
							className="login-button"
							onClick={handleEditClick}
						>
							Edit
						</button>
						<button
							className="login-button"
							onClick={handleDeleteClick}
						>
							Delete account
						</button>
					</>
				)}
			</div>
		</div>
		</>
	) : (
		<LoginPage onSuccessLogin={handleLogin} />
	);
}

export default Profile;