import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { isLength, isMatch } from "../../Utils/validation/Validation";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../Utils/Notification/Notification";
import "./Profile.css";
import Evaluate from "./Evaluate";
import AllUsers from "./AllUsers";
import Contributions from "./Contributions";
import {
  fetchAllUsers,
  dispatchGetAllUsers,
} from "../../../redux/actions/usersActions";
import { Link } from "react-router-dom";

const initialState = {
  name: "",
  password: "",
  cf_password: "",
  err: "",
  success: "",
};

const Profile = () => {
  const auth = useSelector((state) => state.rootReducer.auth);
  const token = useSelector((state) => state.rootReducer.token);
  const users = useSelector((state) => state.rootReducer.users);

  const { user, isAdmin, isEvaluator } = auth;
  const [data, setData] = useState(initialState);
  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = useState(false);
  const [allUsers, setAllUsers] = useState(false);
  const [userBtn, setUserBtn] = useState(false);
  const [hideEvaluate, setHideEvaluate] = useState(true);

  const { name, password, cf_password, err, success } = data;

  const dispatch = useDispatch();

  useEffect(() => {
    if (isAdmin) {
      fetchAllUsers(token).then((res) => {
        dispatch(dispatchGetAllUsers(res));
      });
    }
  }, [token, isAdmin, dispatch, callback]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const changeAvatar = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (!file)
        return setData({
          ...data,
          err: "No Files Were Uploaded.",
          success: "",
        });
      if (file.size > 1024 * 1024 * 5) {
        return setData({ ...data, err: "Size too large.", success: "" });
      }

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        return setData({
          ...data,
          err: "File format not supported.",
          success: "",
        });
      }

      let formData = new FormData();
      formData.append("file", file);
      setLoading(true);

      const res = await axios.post("/api/upload_avatar", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });

      setLoading(false);
      setAvatar(res.data.url);
    } catch (err) {
      err && setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const updateInfo = () => {
    try {
      axios.patch(
        "/user/update",
        {
          name: name ? name : user.name,
          avatar: avatar ? avatar : user.avatar,
        },
        {
          headers: { Authorization: token },
        }
      );
      setData({ ...data, err: "", success: "Updated successfully!" });
      window.location.reload();
    } catch (err) {
      err && setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const updatePassword = () => {
    if (isLength(password))
      return setData({
        ...data,
        err: "Password must be at least 6 characters.",
        success: "",
      });

    if (!isMatch(password, cf_password))
      return setData({ ...data, err: "Password did not match.", success: "" });

    try {
      axios.post(
        "/user/reset",
        {
          password,
        },
        {
          headers: { Authorization: token },
        }
      );
      setData({ ...data, err: "", success: "Updated successfully!" });
      window.location.reload();
    } catch (err) {
      err && setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const handleUpdate = () => {
    if (name || avatar) updateInfo();
    if (password) updatePassword();
  };

  const handleDelete = async (id) => {
    try {
      if (user._id !== id) {
        if (
          window.confirm(`Are you sure you want to delete ${id}'s account?`)
        ) {
          setLoading(true);
          await axios.delete(`/user/delete/${id}`, {
            headers: { Authorization: token },
          });
          setLoading(false);
          setCallback(!callback);
        }
      }
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <div className="profile-div">
      <div className="p-card">
        <div className="p-info">
          <div className="p-avatar">
            <img src={avatar ? avatar : user.avatar} alt="Avatar" />
            <span>
              <i className="fa fa-camera" aria-hidden="true"></i>
              <p>Change</p>
              <input
                type="file"
                name="file"
                id="file_up"
                onChange={changeAvatar}
              />
            </span>
          </div>
          <div className="p-user-details">
            <div className="role">
              <h2>
                {isAdmin ? "Admin👑" : isEvaluator ? "Evaluator📝" : "User"}
              </h2>
            </div>
            <div id="msg">
              {err && showErrMsg(err)}
              {success && showSuccessMsg(success)}
              {loading && <h3>Loading...</h3>}
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={user.name}
                placeholder="Your name"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                defaultValue={user.email}
                placeholder="Your email address"
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Your password"
                value={password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cf_password">Confirm New Password</label>
              <input
                type="password"
                name="cf_password"
                id="cf_password"
                placeholder="Confirm password"
                value={cf_password}
                onChange={handleChange}
              />
            </div>

            {/* <div>
                <em style={{ color: "crimson" }}>
                  * If you update your password here, you will not be able to
                  login quickly using google and facebook.
                </em>
              </div> */}
            <div className="p-btns">
              <button disabled={loading} onClick={handleUpdate}>
                Update
              </button>
              {user.role > 0 && (
                <Link
                  to={
                    allUsers ? "/profile/evaluate" : "/profile/my-contributions"
                  }
                >
                  <button
                    onClick={() => {
                      setAllUsers(!allUsers);
                      setUserBtn(false);
                      setHideEvaluate(true);
                    }}
                  >
                    {allUsers ? "Evaluate" : "My contributions"}
                  </button>
                </Link>
              )}
              {isAdmin && (
                <Link to="/profile/all-users">
                  <button
                    onClick={() => {
                      setUserBtn(true);
                      setHideEvaluate(false);
                    }}
                  >
                    See Users
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="profile-content">
        {user.role === 0 && <Contributions />}
        {userBtn && !isEvaluator && (
          <AllUsers users={users} handleDelete={handleDelete} />
        )}
        {user.role > 0 && hideEvaluate && <Evaluate allUsers={allUsers} />}
      </div>
      <div className="pink-band"></div>
    </div>
  );
};

export default Profile;
