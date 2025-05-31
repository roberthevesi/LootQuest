import { NotificationPayload } from "firebase/messaging";

const Message: React.FC<{ notification?: NotificationPayload }> = ({
  notification,
}) => {
  if (!notification) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        {notification.image && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100px",
              objectFit: "contain",
            }}
          >
            <img src={notification.image} width={100} />
          </div>
        )}
        <span>{notification.title}</span>
      </div>
      <div
        style={{
          marginTop: notification.image ? "0px" : "10px",
          textAlign: "center",
        }}
      >
        {notification.body}
      </div>
    </div>
  );
};

export default Message;
