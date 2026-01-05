import css from "../styles/notfound.module.css"

export default function NotFound({error}) {
    console.log("NOT FOUND: " + error)

    return (
    <div className={css.error}>
        <div className={css.errorIcon}>
            <img src="/media/error.svg" alt="error"></img>
        </div>
        <h1 className={css.unknownPage}>unknown page</h1>
        <p className={css.errorInfo}>Error information: {decodeURI(error)}</p>
    </div>
    )
}