import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import ReCAPTCHA from "react-google-recaptcha";
import { setStoredUser } from "../user-storage";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Container,
    Divider,
    Typography,
    useTheme,
} from "@material-ui/core";
import woods from "./../../images/payrollbg.jpg";
import logo from "./../../images/home-logo.png";

const Login = () => {
    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false);
    const { palette } = useTheme();
    const { login, verifyCode } = useAuth();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isDirty, isSubmitting },
    } = useForm({ defaultValues: { portal: "payroll" } });
    const navigate = useNavigate();
    const { user, isFetching } = useUser();
    const { updateUser } = useUser();

    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const siteKey = window.recaptchaSiteKey;

    const handleCaptchaChange = (value) => {
        setIsCaptchaVerified(true);
        setValue("g-recaptcha-response", value);
    };

    useEffect(() => {
        if (!isFetching) {
            if (user) {
                navigate("/");
            }
        }
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);

        const response = await login(data);

        console.log(response);
        if (response.success) {
            // if (checked) {
            // 	setStoredRememberedUser(data);
            // }
            if (response.type == "Admin") {
                setValue("user_id", response.user_id);
                setIsAuthenticated(true);
                navigate("/");
            } else {
                setGeneralError("Member are not allowed to login.");
            }
        } else {
            setGeneralError(response.error);
        }
        setLoading(false);
    };

    const verify = async (data) => {
        try {
            const response = await verifyCode(data);
            setLoading(true);
            if (response && "user_id" in response) {
                setIsVerified(true);
                // update stored user data
                setStoredUser(response);
                updateUser(response);
                navigate("/");
            } else {
                setGeneralError(response.message);
            }
            setLoading(false);
        } catch (err) {
            setGeneralError(err);
        }
    };

    return (
        <>
            <Box
                sx={{
                    backgroundImage: `url(${woods})`,
                    height: "100vh",
                    width: "100vw",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    marginTop: 0,
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "rgba(255, 255, 255, .5)",
                        display: "block",
                        height: "100vh",
                    }}
                >
                    <Container
                        maxWidth="sm"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: 50,
                            }}
                        >
                            <Box
                                component="img"
                                src={logo}
                                sx={{
                                    height: 80,
                                    width: 80,
                                }}
                            />
                        </div>
                        <Typography
                            variant="h4"
                            style={{
                                textAlign: "center",
                                paddingTop: 20,
                                marginTop: 10,
                                color: palette.primary.main,
                                fontWeight: "bold",
                                fontFamily: "inherit",
                            }}
                        >
                            Welcome to Your Payroll
                        </Typography>
                        <Card
                            style={{ marginTop: 40, borderRadius: 20 }}
                            elevation={5}
                        >
                            <CardHeader
                                title={
                                    isAuthenticated ? (
                                        <a
                                            href="/"
                                            className="btn btn-sm text-white"
                                        >
                                            <i className="si si-arrow-left text-white mr-5"></i>
                                            back to Sign In
                                        </a>
                                    ) : (
                                        "Sign In"
                                    )
                                }
                                style={{
                                    backgroundImage: `linear-gradient(to right, ${palette.primary.main}, ${palette.primary.dark})`,
                                    // backgroundColor: palette.primary.main,
                                    color: palette.primary.contrastText,
                                }}
                            />
                            <CardContent>
                                {!isAuthenticated ? (
                                    <form
                                        className="js-validation-signin"
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        {generalError && (
                                            <div
                                                class="alert alert-danger alert-dismissable"
                                                role="alert"
                                            >
                                                <button
                                                    type="button"
                                                    class="close"
                                                    data-dismiss="alert"
                                                    aria-label="Close"
                                                >
                                                    <span aria-hidden="true">
                                                        ×
                                                    </span>
                                                </button>
                                                <h3 class="alert-heading font-size-h4 font-w400">
                                                    Error
                                                </h3>
                                                <p class="mb-0">
                                                    {generalError}
                                                </p>
                                            </div>
                                        )}
                                        <div className="form-group row">
                                            <div className="col-12">
                                                <label htmlFor="login-username">
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="login-username"
                                                    aria-describedby={
                                                        errors.username
                                                            ? "login-username-error"
                                                            : ""
                                                    }
                                                    {...register("username", {
                                                        required: true,
                                                    })}
                                                />
                                                {errors.username && (
                                                    <div
                                                        id="login-password-error"
                                                        className="invalid-feedback animated fadeInDown"
                                                    >
                                                        Username is required.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-12">
                                                <label htmlFor="login-password">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="login-password"
                                                    aria-describedby={
                                                        errors.password
                                                            ? "login-password-error"
                                                            : ""
                                                    }
                                                    {...register("password", {
                                                        required: true,
                                                    })}
                                                />
                                                {errors.contact_password && (
                                                    <div
                                                        id="login-password-error"
                                                        className="invalid-feedback animated fadeInDown"
                                                    >
                                                        Password is required.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center">
                                            <ReCAPTCHA
                                                sitekey={siteKey} // Replace with your reCAPTCHA site key
                                                onChange={handleCaptchaChange}
                                                style={{ marginBottom: 10 }}
                                            />
                                        </div>
                                        <div className="form-group row mb-0">
                                            <div className="col-sm-12 d-flex justify-content-center">
                                                <button
                                                    type="submit"
                                                    className="btn btn-alt-primary"
                                                    data-toggle="click-ripple"
                                                    disabled={
                                                        loading || isSubmitting
                                                    }
                                                >
                                                    {isSubmitting ? (
                                                        <span>
                                                            <i className="fa fa-asterisk fa-spin"></i>{" "}
                                                            Signing in...
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            <i className="si si-login mr-10"></i>{" "}
                                                            Sign In
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div>
                                        <h3>Verify Authentication.</h3>
                                        <form
                                            onSubmit={handleSubmit((data) =>
                                                verify(data)
                                            )}
                                        >
                                            <input
                                                type="text"
                                                className="form-control"
                                                {...register(
                                                    "verificationCode",
                                                    {
                                                        required: true,
                                                    }
                                                )}
                                            />
                                            <input
                                                type="submit"
                                                className="btn btn-success btn-block mt-10"
                                            />
                                        </form>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </Container>
                </Box>
            </Box>
        </>
    );
};

export default Login;
