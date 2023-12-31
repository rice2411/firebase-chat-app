import { UserAddOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button, Tooltip, Avatar, Form, Input, Alert } from "antd";
import Message from "./Message";
import { AppContext } from "../../context/appProvider";
import { AuthContext } from "../../context/authProvider";
import {
  addDocument,
  removeDocumentsByConditions,
} from "../../firebase/service";
import useFirestore from "../../hooks/useFireStore";

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default function ChatWindow() {
  const { selectedRoom, members, setIsInviteMemberVisible }: any =
    useContext(AppContext);
  const { uid, photoURL, displayName } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState("");

  const [form] = Form.useForm();
  const inputRef: any = useRef(null);
  const messageListRef: any = useRef(null);

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };
  const conditionTyping = React.useMemo(
    () => ({
      fieldName: "roomId",
      operator: "==",
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  );
  const listTyping: any = useFirestore("typing", conditionTyping);
  console.log(listTyping);
  const handleStartTyping = (e: any) => {
    if (e.target.value != "") {
      const room = listTyping.find(
        (item: any) => item.roomId == selectedRoom.id
      );
      const roomId = selectedRoom.id;
      if (!room) {
        addDocument("typing", {
          uid,
          displayName,
          roomId,
        });
      }

      // addDocument("typing", {
      //   uid,
      //   displayName,
      // });
    }
  };
  const handleEndTyping = () => {
    const room = listTyping.find((item: any) => item.roomId == selectedRoom.id);
    if (room) {
      const conditions = [
        { field: "uid", operator: "==", value: uid },
        { field: "roomId", operator: "==", value: selectedRoom.id },
      ];
      removeDocumentsByConditions("typing", conditions);
    }
  };
  const handleOnSubmit = () => {
    addDocument("messages", {
      text: inputValue,
      uid,
      photoURL,
      roomId: selectedRoom.id,
      displayName,
    });

    form.resetFields(["message"]);

    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };
  const condition = React.useMemo(
    () => ({
      fieldName: "roomId",
      operator: "==",
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  );
  const messages = useFirestore("messages", condition);
  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  return (
    <WrapperStyled>
      {selectedRoom.id ? (
        <>
          <HeaderStyled>
            <div className="header__info">
              <p className="header__title">{selectedRoom.name}</p>
              <span className="header__description">
                {selectedRoom.description}
              </span>
            </div>
            <ButtonGroupStyled>
              <Button
                icon={<UserAddOutlined />}
                type="text"
                onClick={() => setIsInviteMemberVisible(true)}
              >
                Mời
              </Button>
              <Avatar.Group size="small" maxCount={2}>
                {members.map((member: any) => (
                  <Tooltip title={member.displayName} key={member.id}>
                    <Avatar src={member.photoURL}>
                      {member.photoURL
                        ? ""
                        : member.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </ButtonGroupStyled>
          </HeaderStyled>

          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages.map((mes: any) => (
                <Message
                  key={mes.id}
                  text={mes.text}
                  photoURL={mes.photoURL}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                />
              ))}
            </MessageListStyled>{" "}
            <p>
              {listTyping.length > 0 ? (
                <>
                  {listTyping
                    .filter((item: any) => item.uid !== uid)
                    .map((item: any, index: number) => (
                      <>
                        {item.displayName}{" "}
                        {listTyping.length > 1 && index != listTyping.length - 1
                          ? ","
                          : ""}
                        is typing...
                      </>
                    ))}
                </>
              ) : (
                ""
              )}
            </p>
            <FormStyled form={form}>
              <Form.Item name="message">
                <Input
                  ref={inputRef}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleStartTyping(e);
                    if (e.target.value == "") {
                      handleEndTyping();
                    }
                  }}
                  onPressEnter={handleOnSubmit}
                  onFocus={handleStartTyping}
                  onBlur={handleEndTyping}
                  placeholder="Nhập tin nhắn..."
                  bordered={false}
                  autoComplete="off"
                />
              </Form.Item>
              <Button type="primary" onClick={handleOnSubmit}>
                Gửi
              </Button>
            </FormStyled>
          </ContentStyled>
        </>
      ) : (
        <Alert
          message="Hãy chọn phòng"
          type="info"
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
}
