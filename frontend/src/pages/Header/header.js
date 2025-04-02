import "./header.css";
import logo from "../../images/logo.png";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getUserImg, getUserProfile, get, patch } from "../../api/api.service";
import notification from "../../images/notification.svg";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

function Header() {
  const [userImgUrl, setUserImgUrl] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const navigate = useNavigate();
  const userId = Cookies.get('userId');
  const handleUserImg = async () => {
    try {
      const userplusinfo = await get(
        `/user/${userId}/detailsUser`,
        Cookies.get("jwt")
    );
      const imgUrl = await getUserImg(`/profile/profileImage/${userplusinfo.profileImg}`, Cookies.get("jwt"));
      setUserImgUrl(imgUrl);
    } catch (error) {
      console.error("Error getting user information", error);
    }
  };

  const handleNotifications = async () => {
    try {
      const notificationsList = await get(`/notifications`, Cookies.get("jwt"));
      setNotifications(notificationsList);
      setUnreadNotifications(notificationsList.filter(notification => !notification.isRead));
    } catch (error) {
      console.error("Error getting user notifications", error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await patch(`/notifications/${notificationId}/read`, {}, Cookies.get("jwt"));
      setNotifications((prevNotifications) => {
        const updatedNotifications = prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        );
        setUnreadNotifications(updatedNotifications.filter(notification => !notification.isRead));
        return updatedNotifications;
      });
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  useEffect(() => {
    handleUserImg();
    handleNotifications();

    const handleClickOutside = (event) => {
      if (!event.target.closest(".notification__container")) {
        setIsVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleNotifications = (event) => {
    event.stopPropagation();
    setIsVisible(!isVisible);
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);
    navigate(notification.url);
  };

  return (
    <div className="header__container">
      <div className="company__name">
        <img src={logo} alt="Company Logo" />
      </div>
      <div className="user__profile__img">
        <div className="notification__container">
          <img
            className="notification__img"
            src={notification}
            alt="Notifications"
            onClick={toggleNotifications}
          />
          <span className="msg-count">{unreadNotifications.length}</span>
          {isVisible && (
            <div className='notification-list'>
              {notifications.length > 0 ? (
                <ul>
                  {notifications.map((notification) => (
                    <li
                      className={`notification__details ${notification.isRead ? 'read' : ''}`}
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <p>{notification.message}</p>
                      <h6>
                        {format(new Date(notification.timestamp), "dd MMMM yyyy à HH:mm:ss")}
                      </h6>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notifications</p>
              )}
            </div>
          )}
        </div>
        <img className="user__img" src={userImgUrl} alt="User Profile" />
      </div>
    </div>
  );
}

export default Header;
