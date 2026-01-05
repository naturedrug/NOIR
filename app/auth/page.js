import AuthForm from "../components/AuthForm"

export const metadata = {
    title: "Authentication"
}

export default function Auth() {
    return (
        
        <AuthForm isLogin={true}></AuthForm>
    )
}