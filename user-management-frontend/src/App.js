import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = 'http://localhost:3000/users';

function App() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(apiUrl).then(response => setUsers(response.data)).catch(handleError);
    }, []);

    const handleError = (error) => {
        if (error.response) {
            setError(`Error: ${error.response.status} - ${error.response.data}`);
        } else if (error.request) {
            setError('Network Error: Unable to reach the server');
        } else {
            setError(`Error: ${error.message}`);
        }
    };

    const handleAddUser = () => {
        const newUser = { id: Date.now().toString(), name, email };
        axios.post(apiUrl, newUser)
            .then(response => {
                setUsers([...users, response.data]);
                setName('');
                setEmail('');
                setError('');
            })
            .catch(handleError);
    };

    const handleUpdateUser = () => {
        const updatedUser = { id: currentUserId, name, email };
        axios.put(`${apiUrl}/${currentUserId}`, updatedUser)
            .then(response => {
                setUsers(users.map(u => u.id === currentUserId ? response.data : u));
                setName('');
                setEmail('');
                setIsEditing(false);
                setCurrentUserId(null);
                setError('');
            })
            .catch(handleError);
    };

    const handleEditClick = (user) => {
        setName(user.name);
        setEmail(user.email);
        setIsEditing(true);
        setCurrentUserId(user.id);
    };

    const handleCancelEdit = () => {
        setName('');
        setEmail('');
        setIsEditing(false);
        setCurrentUserId(null);
    };

    const handleDeleteUser = (id) => {
        axios.delete(`${apiUrl}/${id}`)
            .then(() => {
                setUsers(users.filter(u => u.id !== id));
                setError('');
            })
            .catch(handleError);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">User Management</h1>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control mb-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
                <input
                    type="email"
                    className="form-control mb-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                {isEditing ? (
                    <>
                        <button className="btn btn-success" onClick={handleUpdateUser}>Update User</button>
                        <button className="btn btn-secondary ml-2" onClick={handleCancelEdit}>Cancel</button>
                    </>
                ) : (
                    <button className="btn btn-primary" onClick={handleAddUser}>Add User</button>
                )}
            </div>

            <ul className="list-group">
                {users.map(user => (
                    <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {user.name} ({user.email})
                        <div>
                            <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEditClick(user)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
