import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  showSuccessMsg,
  showErrMsg,
} from "../../Utils/Notification/Notification";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editUser, setEditUser] = useState([]);

  const token = useSelector((state) => state.rootReducer.token);
  const users = useSelector((state) => state.rootReducer.users);

  const [checkUser, setCheckUser] = useState(false);
  const [checkEvaluator, setCheckEvaluator] = useState(false);
  const [err, setErr] = useState(false);
  const [success, setSuccess] = useState(false);
  const [num, setNum] = useState(0);
  const [adminRole, setAdminRole] = useState(false);

  useEffect(() => {
    if (users.length !== 0) {
      users.forEach((user) => {
        if (user._id === id) {
          setEditUser(user);
          setCheckUser(user.role === 0 ? true : false);
          setCheckEvaluator(user.role === 1 ? true : false);
          setAdminRole(user.role === 2 ? true : false);
        }
      });
    } else {
      navigate(-1);
    }
  }, [users, id, navigate]);

  const handleUpdate = async () => {
    if (adminRole) return setErr("Admins cannot change their roles.");
    if (!checkEvaluator && !checkUser) return setErr("Please Choose a role.");
    try {
      if (num % 2 !== 0) {
        const res = await axios.patch(
          `/user/update_role/${editUser._id}`,
          {
            role: checkEvaluator ? 1 : 0,
          },
          {
            headers: { Authorization: token },
          }
        );

        setSuccess(res.data.msg);
        setNum(0);
      } else {
        const res = await axios.patch(
          `/user/update_role/${editUser._id}`,
          {
            role: checkUser ? 0 : 1,
          },
          {
            headers: { Authorization: token },
          }
        );

        setSuccess(res.data.msg);
        setNum(0);
      }
    } catch (err) {
      err.response.data.msg && setErr(err.response.data.msg);
    }
  };
  const handleUserCheck = () => {
    setSuccess("");
    setErr("");
    setCheckEvaluator(false);
    setCheckUser(!checkUser);
  };

  const handleEvaluatorCheck = () => {
    setSuccess("");
    setErr("");
    setCheckUser(false);
    setCheckEvaluator(!checkEvaluator);
    setNum(num + 1);
  };

  return (
    <div className="p-div profile-div">
      <div className="p-card" id="right-col">
        <div className="p-info" id="p-info">
          <div className="p-user-details" id="p-user-details">
            <div className="role">
              <h2>Edit User</h2>
            </div>
            <div id="msg">
              {err && showErrMsg(err)}
              {success && showSuccessMsg(success)}
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                defaultValue={editUser.name}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={editUser.email}
                disabled
              />
              <div id="checkboxes">
                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={checkUser}
                    onChange={handleUserCheck}
                  />
                  <label htmlFor="isAdmin">User</label>
                </div>
                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={checkEvaluator}
                    onChange={handleEvaluatorCheck}
                  />
                  <label htmlFor="isAdmin">Evaluator</label>
                </div>
              </div>
              <div className="p-btns">
                <button onClick={handleUpdate}>Update</button>
              </div>
              <div className="p-btns">
                <button onClick={() => navigate(-1)}>Go Back</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
