import React, { useEffect, useState } from "react";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { Navbar } from "react-bootstrap";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";
import {
  Link,
  Navigate,
  Outlet,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { Axios } from "../../services/api";

function SideNavBar(){
  const [isVisible, setIsVisible] = useState(true)
  const navigate = useNavigate()
  const logOut = () =>{
    Axios
    .get("logout")
    .then(res =>{
      if(res.statusText === "OK"){
        navigate("/")
      }
    })
  }
  return   <SideNav expanded={isVisible}  style={{position: "fixed", left: 0}}>
  <SideNav.Toggle
    onClick={() => {
      this.setState({ isVisible: !isVisible });
    }}
  />
  <SideNav.Nav defaultSelected="home">
    <NavItem eventKey="home">
      <NavIcon>
        <i className="fa fa-fw fa-home" style={{ fontSize: "1.75em" }} />
      </NavIcon>
      <Link to="/teacher" className="text-white nav-item">DashBoard</Link>
    </NavItem>
    <NavItem eventKey="teachers">
      <NavIcon>
        <i
          className="fa fa-fw fa-line-chart"
          style={{ fontSize: "1.75em" }}
        />
      </NavIcon>
      <Link to="/teacher/tests" className="text-white nav-item">Tests</Link>
    </NavItem>
    <NavItem eventKey="students">
      <NavIcon>
        <i
          className="fa fa-fw fa-line-chart"
          style={{ fontSize: "1.75em" }}
        />
      </NavIcon>
      <Link to="/teacher/addHomework" className="text-white nav-item">Add Homework</Link>
    </NavItem>
    <NavItem eventKey="groups">
      <NavIcon>
        <i
          className="fa fa-fw fa-line-chart"
          style={{ fontSize: "1.75em" }}
        />
      </NavIcon>
      <Link to="/teacher/classbook" className="text-white nav-link">Classbook</Link>
    </NavItem>
    <NavItem eventKey="logout">
      <NavIcon>
        <i
          className="fa fa-fw fa-line-chart"
          style={{ fontSize: "1.75em" }}
        />
      </NavIcon>
      <button onClick={() => logOut()}  className="text-white nav-link">Logout</button>
    </NavItem>
  </SideNav.Nav>
</SideNav>
}


class HeaderBar extends React.Component {
  render() {
    return (
      <div className="topnav">
        <Navbar
          fixed="top"
          expand="lg"
          bg="dark"
          variant="dark"
          className="topnav"
        >
          <Navbar.Brand href="/admin" className="mx-3">
            School{" "}
          </Navbar.Brand>
        </Navbar>
      </div>
    );
  }
}

const TeacherNav = () => {
  const { account, handleLogout } = useOutletContext();

  return account && account.type != "teacher" ? (
    <Navigate to="/" />
  ) : !account ? (
    <p>Please wait...</p>
  ) : (
    <>
      <HeaderBar></HeaderBar>
      <SideNavBar handleLogout={handleLogout}></SideNavBar>
      <div className="container" style={{ marginLeft: 300, marginTop: 100 }}>
        <Outlet context={account} />
      </div>
    </>
  );
};

export default TeacherNav;
