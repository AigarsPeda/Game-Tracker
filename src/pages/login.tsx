import type { InputsType } from "components/elements/Form/Form";
import Form from "components/elements/Form/Form";
import Logo from "components/elements/Logo/Logo";
import SignupLoginImage from "components/elements/SignupLoginImage/SignupLoginImage";
import { DEFAULT_REDIRECT_URL } from "hardcoded";
import useRedirect from "hooks/useRedirect";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useReducer } from "react";
import loginReducer from "reducers/loginReducer";
import { api } from "utils/api";
import setCookie from "utils/setCookie";

const INPUTS: InputsType[] = [
  {
    name: "email",
    type: "email",
    placeholder: "Email",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
  },
];

const Login: NextPage = () => {
  const router = useRouter();
  const { redirectToPath } = useRedirect();
  const { isError, mutateAsync } = api.users.loginUser.useMutation();
  const [loginForm, setLoginForm] = useReducer(loginReducer, {
    form: {
      email: "",
      password: "",
    },
    error: [],
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      form: {
        ...loginForm.form,
        [name]: value,
      },
    });
  };

  const handleLogin = async () => {
    const {
      form: { email, password },
    } = loginForm;

    const res = await mutateAsync({
      email,
      password,
    });

    if (res.token) {
      setCookie("token", res.token, 1);

      const { redirect } = router.query;

      if (typeof redirect !== "string" || !redirect) {
        redirectToPath(DEFAULT_REDIRECT_URL);
        return;
      }

      redirectToPath(redirect);
    }
  };

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
        <div className="mt-0 flex h-full w-full flex-col">
          <div className="mb-10 transition-all md:mb-20 lg:mb-40">
            <Logo />
          </div>
          <Form
            inputs={INPUTS}
            errors={loginForm.error}
            handleLogin={handleLogin}
            handleInputChange={handleInputChange}
            link={{
              href: "/signup",
              text: (
                <>
                  If you don&apos;t have an account,{" "}
                  <span className="font-bold text-gray-900">click here</span> to
                  sign up
                </>
              ),
            }}
          />
          {isError && <p className="text-red-500">Something went wrong!</p>}
        </div>
        <SignupLoginImage />
      </div>
    </>
  );
};

export default Login;
