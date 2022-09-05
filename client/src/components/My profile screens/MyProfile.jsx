import React, { useState, useEffect } from "react";
import "./myprofile.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { showErrMsg, showSuccessMsg } from "../Utils/Notification/Notification";
import { isLength, isMatch } from "../Utils/validation/Validation";

const MyProfile = () => {
  const auth = useSelector((state) => state.rootReducer.auth);
  const { user, isAdmin, isEvaluator } = auth;
  const token = useSelector((state) => state.rootReducer.token);
  const [mlength, setMlength] = useState(400);
  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pvisible, setPvisible] = useState(false);
  const [cpvisible, setCpvisible] = useState(false);

  // console.log(initialState);

  // const initalState = {
  //   name: "",
  //   password: "",
  //   cf_password: "",
  //   website: "",
  //   bio: "",
  //   linkedin: "",
  //   instagram: "",
  //   github: "",
  //   twitter: "",
  //   err: "",
  //   success: "",
  // };

  const [data, setData] = useState(0);

  const fetchUser = async (token) => {
    const res = await axios.get("/user/info", {
      headers: { Authorization: token },
    });
    res &&
      setData({
        name: res.data.name,
        website: res.data.website,
        bio: res.data.bio,
        linkedin: res.data.linkedin,
        instagram: res.data.instagram,
        github: res.data.github,
        twitter: res.data.twitter,
      });
  };

  useEffect(() => {
    fetchUser(token);
  }, [token]);

  const {
    name,
    password,
    cf_password,
    website,
    bio,
    linkedin,
    instagram,
    github,
    twitter,
    err,
    success,
  } = data;

  const settextarealimit = (text) => {
    setMlength(400 - text.length);
  };

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

  const updateInfo = async () => {
    try {
      const res = await axios.patch(
        "/user/update",
        {
          name: name ? name : user.name,
          avatar: avatar ? avatar : user.avatar,
          website: website ? website : user.website,
          bio: bio ? bio : user.bio,
          linkedin: linkedin ? linkedin : user.linkedin,
          instagram: instagram ? instagram : user.instagram,
          github: github ? github : user.github,
          twitter: twitter ? twitter : user.twitter,
        },
        {
          headers: { Authorization: token },
        }
      );

      setData({ ...data, err: "", success: res.data.msg });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      err && setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const ProfilePicDelete = () => {
    setAvatar(
      "https://res.cloudinary.com/quizry/image/upload/v1653159606/Avatars/default-avatar_d4xidz.png"
    );
  };

  const DeleteInfo = async () => {
    try {
      const res = await axios.patch(
        "/user/update",
        {
          website: website === "" ? website : user.website,
          bio: bio === "" ? bio : user.bio,
          linkedin: linkedin === "" ? linkedin : user.linkedin,
          instagram: instagram === "" ? instagram : user.instagram,
          github: github === "" ? github : user.github,
          twitter: twitter === "" ? twitter : user.twitter,
        },
        {
          headers: { Authorization: token },
        }
      );

      setData({ ...data, err: "", success: res.data.msg });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
    console.log(name);
    if (name.trim() === "") return setData({ err: "Username can't be empty!" });

    if (
      bio.trim() === "" ||
      website.trim() === "" ||
      twitter.trim() === "" ||
      instagram.trim() === "" ||
      linkedin.trim() === "" ||
      github.trim() === ""
    ) {
      DeleteInfo();
    }

    if (
      name ||
      avatar ||
      bio ||
      website ||
      twitter ||
      instagram ||
      linkedin ||
      github
    ) {
      updateInfo();
    }

    if (password) updatePassword();
  };

  return (
    <div className="profile-div bg-gradient">
      <div className="my-profile">
        <div className="profile-banner"></div>
        <div className="my-profile-main">
          <div className="my-profile-picture">
            <div id="p-pic-delete">
              <img
                src="https://img.icons8.com/material-sharp/20/000000/filled-trash.png"
                alt="profile-pic"
                id="p-pic-delete"
                onClick={ProfilePicDelete}
              />
            </div>
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
          <div className="my-profile-btns">
            <button id="profile-cancel-btn">Cancel</button>
            <button
              id="profile-save-btn"
              disabled={loading}
              onClick={handleUpdate}
            >
              Save
            </button>
          </div>
          <div id="message">
            {loading && showSuccessMsg("Loading...")}
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
          </div>
          <div className="my-profile-details">
            <div className="my-profile-detail-div">
              <p>Username</p>
              <input
                type="text"
                name="name"
                defaultValue={user.name}
                placeholder="Your name"
                onChange={handleChange}
                required
              />
            </div>
            <div className="my-profile-detail-div">
              <p>Role</p>
              <p>
                {isAdmin ? "Admin 👑" : isEvaluator ? "Evaluator 📝" : "User"}
              </p>
            </div>
            <div className="my-profile-detail-div">
              <p>Email</p>
              <input
                type="text"
                name="email"
                defaultValue={user.email}
                placeholder="Your email address"
                disabled
              />
            </div>
            <div className="my-profile-detail-div">
              <p>Website</p>
              <input
                type="text"
                name="website"
                defaultValue={user.website}
                onChange={handleChange}
              />
            </div>
            <div className="my-profile-detail-div ">
              <p>Your Bio</p>

              <div className="my-bio">
                <textarea
                  name="bio"
                  rows="6"
                  placeholder="Write a short introduction.."
                  maxLength="400"
                  defaultValue={user.bio}
                  onChange={(e) => {
                    handleChange(e);
                    settextarealimit(e.target.value);
                  }}
                ></textarea>
                <p id="c-count">{mlength} characters left</p>
              </div>
            </div>
            <div className="my-profile-detail-div ">
              <p>Scoials</p>
              <div className="socials-section">
                <div className="social-input-div">
                  <p>LinkedIn</p>
                  <input
                    type="text"
                    name="linkedin"
                    defaultValue={user.linkedin}
                    onChange={handleChange}
                  />
                </div>
                <div className="social-input-div">
                  <p>Instagram</p>
                  <input
                    type="text"
                    name="instagram"
                    onChange={handleChange}
                    defaultValue={user.instagram}
                  />
                </div>
                <div className="social-input-div">
                  <p>Github</p>
                  <input
                    type="text"
                    name="github"
                    onChange={handleChange}
                    defaultValue={user.github}
                  />
                </div>
                <div className="social-input-div">
                  <p>Twitter</p>
                  <input
                    type="text"
                    name="twitter"
                    onChange={handleChange}
                    defaultValue={user.twitter}
                  />
                </div>
              </div>
            </div>
            <div className="my-profile-detail-div ">
              <p>Change Password</p>
              <div className="socials-section">
                <div className="social-input-div">
                  <p>Enter new password</p>
                  <div className="profile-input-div">
                    <input
                      type={pvisible ? "text" : "password"}
                      name="password"
                      placeholder="Your password"
                      value={password}
                      onChange={handleChange}
                    />
                    {pvisible ? (
                      <img
                        src="https://img.icons8.com/cotton/18/undefined/surprise--v2.png"
                        id="pass-eye"
                        alt="eye"
                        onClick={() => setPvisible(!pvisible)}
                      />
                    ) : (
                      <img
                        src="https://img.icons8.com/windows/18/undefined/closed-eye.png"
                        id="pass-eye"
                        alt="eye"
                        onClick={() => setPvisible(!pvisible)}
                      />
                    )}
                  </div>
                </div>
                <div className="social-input-div">
                  <p>Confirm new password</p>
                  <div className="profile-input-div">
                    <input
                      type={cpvisible ? "text" : "password"}
                      name="cf_password"
                      placeholder="Confirm password"
                      value={cf_password}
                      onChange={handleChange}
                    />
                    {cpvisible ? (
                      <img
                        src="https://img.icons8.com/cotton/18/undefined/surprise--v2.png"
                        id="pass-eye"
                        alt="eye"
                        onClick={() => setCpvisible(!cpvisible)}
                      />
                    ) : (
                      <img
                        src="https://img.icons8.com/windows/18/undefined/closed-eye.png"
                        id="pass-eye"
                        alt="eye"
                        onClick={() => setCpvisible(!cpvisible)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
