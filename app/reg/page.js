import AuthForm from "../components/AuthForm"

export const metadata = {
    title: "Authentication"
}

export default function Reg() {
    return (
        
        <AuthForm isLogin={false}></AuthForm>
    )
}