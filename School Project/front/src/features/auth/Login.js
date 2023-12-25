import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import { LoginAction } from "./Login.slice";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const message = useSelector((state) => state.auth.error);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = (data) => {
    dispatch(LoginAction(data))
      .unwrap()
      .then((res) => {
        // console.log(res);
        if (res.status === "ok") {
          switch (res.type) {
            case "admin":
              return navigate("/admin");
            case "teacher":
              return navigate("/teacher");
            case "student":
              return navigate("/student");
              default:
                console.log("OK")
          }
        }
      });
  };
  
  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol sm="6">
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="d-flex flex-row ps-5 pt-5">
              <MDBIcon
                fas
                icon="crow fa-3x me-3"
                style={{ color: "#709085" }}
              />
              <span className="h1 fw-bold mb-0">School</span>
            </div>

            <div className="d-flex flex-column justify-content-center h-custom-2 w-75 pt-4">
              <h3
                className="fw-normal mb-3 ps-5 pb-3"
                style={{ letterSpacing: "1px" }}
              >
                Log in
              </h3>

              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                label="Email address"
                id="formControlLg"
                type="text"
                size="lg"
                {...register("login")}
              />
              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                label="Password"
                id="formControlLg"
                type="password"
                size="lg"
                {...register("password")}
              />
              {message && <p className="text-danger">{message}</p>}
              <button
                className="mb-4 px-5 mx-5 w-100 btn  btn-lg btn-info"
                color="info"
                size="lg"
              >
                Login
              </button>
              <p className="small mb-5 pb-lg-3 ms-5">
                <a className="text-muted" href="#!">
                  Forgot password?
                </a>
              </p>
              <p className="ms-5">
                Don't have an account?{" "}
                <a href="#!" className="link-info">
                  Register here
                </a>
              </p>
            </div>
          </form>
        </MDBCol>

        <MDBCol sm="6" className="d-none d-sm-block px-0">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
            alt="Login image"
            className="w-100"
            style={{ objectFit: "cover", objectPosition: "left" }}
          />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
