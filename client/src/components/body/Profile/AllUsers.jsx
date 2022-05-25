import React from "react";
import { Link } from "react-router-dom";

const AllUsers = ({ allUsers, users, handleDelete }) => {
  return (
    <div className="p-contributions">
      <h1>Users</h1>

      <table className="allusers">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.role === 0
                  ? "User"
                  : user.role === 1
                  ? "Evaluator"
                  : "Admin"}
              </td>
              <td id="actions">
                <Link to={`/edit_user/${user._id}`}>
                  <i
                    className="fa fa-pencil-square-o action-icon"
                    aria-hidden="true"
                  ></i>
                </Link>
                <i
                  className="fa fa-trash-o action-icon"
                  aria-hidden="true"
                  onClick={() => handleDelete(user._id)}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
