import { createBrowserRouter, Outlet } from "react-router-dom";
import ChatRoom from "../components/ChatRoom";
import Login from "../components/Login";
import AuthProvider from "../context/authProvider";
import AppProvider from "../context/appProvider";
import AddRoomModal from "../components/Modal/AddRoomModal";
import InviteMemberModal from "../components/Modal/InviteMemberModal";

const Layout = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Outlet></Outlet>
        <AddRoomModal />
        <InviteMemberModal />
      </AppProvider>
    </AuthProvider>
  );
};

export default createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <Login />,
        path: "/login",
      },
      {
        element: <ChatRoom />,
        path: "/chatroom",
      },
    ],
  },
]);
