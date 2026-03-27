import css from "../styles/loadedfile.module.css"
import Image from "next/image"

export default function LoadedFile({ fileName, fileImgData }) {
    if (!fileImgData) return null

    return (
        <div className={css.loadedFile}>
            <span>{fileName}</span>
            <Image
                alt={fileName || "file image"}
                layout="responsive"
                width={64}
                height={64}
                src={fileImgData}
            />
        </div>
    )
}