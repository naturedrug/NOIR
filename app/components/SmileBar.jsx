import css from "../styles/smilebar.module.css"

const smilelist = [
    {
        'value': '😀'
    },
    {
        'value': '🤣'
    },
    {
        'value': '😅'
    },
    {
        'value': '😊'
    },
    {
        'value': '😍'
    },

]


export default function SmileBar({inputSmile, display}) {

    return (
        <div className={css.smilebar} style={{display: display}}>
            <div className={css.smileList}>
                {
                    smilelist.map((smile, index) => {
                        return (
                            <div className={css.smile} key={index} onClick={() => inputSmile(smile.value)}>
                                <span>{smile.value}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}