import React from "react";
import { Button, Avatar, Typography } from "antd";
import { styled } from "styled-components";
import { auth, db } from "../../firebase/config";
import { AuthContext } from "../../context/authProvider";
import { AppContext } from "../../context/appProvider";
const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(82, 38, 83);

  .username {
    color: white;
    margin-left: 5px;
  }
`;
const UserInfo = () => {
  const { clearState }: any = React.useContext(AppContext);
  const { displayName, photoURL } = React.useContext(AuthContext);
  return (
    <WrapperStyled>
      <div>
        <Avatar src={photoURL}>
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className="username">{displayName}</Typography.Text>
      </div>
      <Button
        ghost
        onClick={() => {
          // clear state in App Provider when logout
          clearState();
          auth.signOut();
        }}
      >
        Đăng xuất
      </Button>
    </WrapperStyled>
  );
};

export default UserInfo;
