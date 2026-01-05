import css from "./styles/skeleton.module.css"

export default function Skeleton() {
    return (
        <div className={css.skeleton}>
            <h1><span className={css.skull}>💀</span>
                <br></br>
                {`загрузка)`}
            </h1>
        </div>
    )
}