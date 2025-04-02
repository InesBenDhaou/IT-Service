import React, { useEffect, useState } from 'react';
import './profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getUserProfile, getUserImg, uploadProfileImg, update, get } from '../../api/api.service';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Header from "../Header/header";
import SideBar from "../SideBar/SideBar";


function Profile() {
  const navigate = useNavigate();
  const [userImgUrl, setUserImgUrl] = useState('');
  const [userImgName, setUserImgName] = useState('');
  const userId = Cookies.get('userId');
  const [userformData, setUserFormData] = useState({
    id: '',
    userName: '',
    userLastName: '',
    email: '',
    numTel: '',
    poste: '',
    department: '',
    profileImg: '',
    manager: '',
    localisation: '',
  });

  const handleUserinfo = async () => {
    try {

      const userplusinfo = await get(
        `/user/${userId}/detailsUser`,
        Cookies.get("jwt")
      );
      setUserFormData({
        userName: userplusinfo.userName,
        userLastName: userplusinfo.userLastName,
        email: userplusinfo.email,
        numTel: userplusinfo.numTel,
        poste: userplusinfo.poste,
        department: userplusinfo.department,
        localisation: userplusinfo.localisation,
        contactManager: userplusinfo.contactManager
      });
      setUserImgName(userplusinfo.profileImg);
      const imgUrl = await getUserImg(`/profile/profileImage/${userplusinfo.profileImg}`, Cookies.get('jwt'));
      setUserImgUrl(imgUrl);
    } catch (error) {
      console.error('Error getting user information', error);
    }
  };

  const handleChange = (e) => {
    setUserFormData({ ...userformData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      const imgName = await uploadProfileImg('/profile/uploadProfileImg', formData, Cookies.get('jwt'));
      const imgUrl = await getUserImg(`/profile/profileImage/${imgName.filename}`, Cookies.get('jwt'));
      setUserImgUrl(imgUrl);
      setUserImgName(imgName.filename);
    } catch (error) {
      console.error('Error uploading profile image', error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    userformData.profileImg = userImgName;
    try {
      await update(`/user/${userId}`, userformData, Cookies.get('jwt'));
      navigate("/valide");
    }
    catch (error) {
      console.error('Error updating user profile:', error);
      navigate("/nonvalide");
    }
  };

  useEffect(() => {
    handleUserinfo();
  }, []);

  return (
    <div className='table__page__container'>
      <div className='sidebar__container'><SideBar /></div>
      <div className="table__page__content__container">
        <div><Header /></div>
        <div className='user-profile-container'>
          <div className="view-account">
            <section className="module">
              <div className="module-inner">
                <div className="side-bar-profile">
                  <div className="user-info">
                    <img
                      className="img-profile img-circle img-responsive center-block"
                      src={userImgUrl}
                      alt=""
                    />
                    <ul className="meta list list-unstyled">
                      <li className="name">
                        <label>{userformData.userLastName}{" "}{userformData.userName}</label>
                        <label className="label">{userformData.poste}</label>
                      </li>
                      <li className="email">
                        <a>{userformData.email}</a>
                      </li>
                      <li className="activity">Last logged in: Today at {Cookies.get('loginTime')}</li>
                    </ul>
                  </div>
                  <nav className="side-menu">
                    <ul className="nav">
                      <li className="active">
                        <a href="#">
                          <span className="fa fa-user"></span> A propos
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div className="content-panel">
                  <form className="form-horizontal" onSubmit={handleFormSubmit}>
                    <fieldset className="fieldset">
                      <h3 className="fieldset-title">Personal Info :</h3>
                      <div className="form-group avatar">
                        <figure className="figure  col-sm-3 col-xs-12">
                          <img
                            className="img-rounded img-responsive"
                            src={userImgUrl}
                            alt=""
                          />
                        </figure>
                        <div className="form-inline col-md-10 col-sm-9 col-xs-12">
                          <input type="file" className="file-uploader pull-left" onChange={handleImageUpload} />
                          <button type="submit" className="btn_update">
                            Update Image
                          </button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className=" col-sm-3 col-xs-12 labelInput">Prénom</label>
                        <div className="col-md-10 col-sm-9 col-xs-12">
                          <input type="text" className="input-profile" name="userName" value={userformData.userName} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className=" col-sm-3 col-xs-12 labelInput">Nom</label>
                        <div className="col-md-10 col-sm-9 col-xs-12">
                          <input type="text" className="input-profile" name="userLastName" value={userformData.userLastName} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className=" col-sm-3 col-xs-12 labelInput">Localisation</label>
                        <div className="col-md-10 col-sm-9 col-xs-12">
                          <input type="text" className="input-profile" name="localisation" value={userformData.localisation} onChange={handleChange} />
                        </div>
                      </div>
                      <h3 className="fieldset-title">Contact Info :</h3>
                      <div className="form-group">
                        <label className=" col-sm-3 col-xs-12 labelInput">Email</label>
                        <div className="col-md-10 col-sm-9 col-xs-12">
                          <input type="text" className="input-profile" name="email" value={userformData.email} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-3 col-xs-12 labelInput">Telephone</label>
                        <div className="col-md-10 col-sm-9 col-xs-12">
                          <input type="text" className="input-profile" name="numTel" value={userformData.numTel} onChange={handleChange} />
                        </div>
                      </div>
                      <h3 className="fieldset-title">Poste Info :</h3>
                      <div className="form-group">
                        <label className=" col-sm-3 col-xs-12 labelInput">Poste</label>
                        <div className="col-md-10 col-sm-9 col-xs-12">
                          <input type="text" className="input-profile" name="poste" value={userformData.poste} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className=" col-sm-3 col-xs-12 labelInput">Departement</label>
                        <div className="col-md-10 col-sm-9 col-xs-12">
                          <input type="text" className="input-profile" name="department" value={userformData.department} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-3 col-xs-12 labelInput">Manager</label>
                        <div className="col-md-10 col-sm-9 col-xs-12">
                          <input type="text" className="input-profile" placeholder="Manager Contact" name="numTel" value={userformData.manager} />
                        </div>
                      </div>

                      <div className="form-group-btn">
                        <input className="btn__update" type="submit" value="Update Profile" />
                        <input className="btn__update" type="button" value="Discard" onClick={() => handleUserinfo()} />
                      </div>
                    </fieldset>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
