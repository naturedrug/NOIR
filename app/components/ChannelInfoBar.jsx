

// upped state from
export default function ChannelInfoBar({name, avatar, isVisible}) {


    return (
        <div style={{display: (isVisible) ? "flex" : "none"}}>
            <img src={avatar} alt="avatar"></img>
            <h3>{name}</h3>
        </div>
    )
}