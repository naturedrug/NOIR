'use client'

import css from "../styles/contextmenu.module.css"

import { useEffect, useState, useRef } from "react"
import ContextMenuItem from "./ContextMenuItem"

const menuItems = {
    "Copy": {

    },
    "Paste": {

    },
    "Delete message": {

    }
}

export default function ContextMenu() {

    const [target, setTarget] = useState(null)

    const menuRef = useRef(null)

    const [menu, setMenu] = useState({
        x: 0,
        y: 0,
        visible: false
    })

    useEffect(() => {
        function openMenu(e) {
            e.preventDefault()

            setTarget(e.target)

            if (target != menuRef) {
                setMenu({
                    x: e.pageX,
                    y: e.pageY,
                    visible: true
                })
    
            }

        }

        function closeMenu(e) {

            setMenu({
                x: menu.x,
                y: menu.y,
                visible: false
            })
        }

        document.addEventListener("contextmenu", (e) => openMenu(e))

        document.addEventListener("click", (e) => closeMenu(e))

        return () => {
            document.removeEventListener("contextmenu", openMenu)
            document.removeEventListener("click", closeMenu)
        }
    }, [])


    return (
        <div className={css.contextMenu} style={{ display: (menu.visible) ? "flex" : "none", left: menu.x, top: menu.y }} ref={menuRef}>
            {Object.entries(menuItems).map(([key, item]) => (
                <ContextMenuItem
                    key={key}
                    role={item.role || key}
                    target={target}
                />
            ))}
        </div>
    )
}