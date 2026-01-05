import css from "../styles/header.module.css"
import Image from "next/image"
import searchSvg from "../../public/search.svg"

export default function Header() {
    return (
        <div className={css.header}>
            <input type="text" className={css.search} name="search" autoComplete="off"></input>
            <Image src={searchSvg} alt="search" width={32} height={32}></Image>
        </div>
    )
}