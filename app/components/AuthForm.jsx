import LoginForm from "./LoginForm"
import RegForm from "./RegForm"

export default function AuthForm({ isLogin }) {
    return (
        <div>
            {(isLogin) ? <LoginForm redirectTo={"/"}></LoginForm> : <RegForm redirectTo={"/auth"}></RegForm>}
        </div>
    )
}