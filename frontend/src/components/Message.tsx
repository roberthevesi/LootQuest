import { NotificationPayload } from "firebase/messaging";

const Message: React.FC<{ notification?: NotificationPayload }> = ({
  notification,
}) => {
  if (!notification) {
    return null;
  }

  return (
    <>
      <div id="notificationHeader">
        {notification.image && (
          <div id="imageContainer">
            <img src={notification.image} width={100} />
          </div>
        )}
        <span>{notification.title}</span>
      </div>
      <div id="notificationBody">{notification.body}</div>
    </>
  );
};

export default Message;
