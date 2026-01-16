'use client'

import css from "../styles/contextmenu.module.css"

import { useEffect, useState } from "react"
import ContextMenuItem from "./ContextMenuItem"

import copySvg from "../../public/copy.svg"

export default function ContextMenu() {

    const [target, setTarget] = useState(null)

    const [menu, setMenu] = useState({
        x: 0,
        y: 0,
        visible: false
    })

    useEffect(() => {
        function openMenu(e) {
            e.preventDefault()

            setMenu({
                x: e.pageX,
                y: e.pageY,
                visible: true
            })

            setTarget(e.target)
        }

        function closeMenu() {
            setMenu({
                x: menu.x,
                y: menu.y,
                visible: false
            })
        }

        document.addEventListener("contextmenu", (e) => openMenu(e))

        document.addEventListener("click", closeMenu)

        return () => {
            document.removeEventListener("contextmenu", openMenu)
            document.removeEventListener("click", closeMenu)
        }
    }, [])


    return (
        <div className={css.contextMenu} style={{ display: (menu.visible) ? "flex" : "none", left: menu.x, top: menu.y }}>
            <ContextMenuItem role={"Copy"} target={target} icon={copySvg}></ContextMenuItem>
            <ContextMenuItem role={"Copy"} target={target} icon={copySvg}></ContextMenuItem>
            <ContextMenuItem role={"Copy"} target={target} icon={copySvg}></ContextMenuItem>
            <ContextMenuItem role={"Copy"} target={target} icon={copySvg}></ContextMenuItem>
        </div>
    )
}