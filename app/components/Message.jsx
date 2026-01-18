import css from "../styles/message.module.css"

import Link from "next/link"

import { forwardRef, useEffect } from "react";

import Image from "next/image";

import checkmarkSvg from "../../public/checkmark.svg"

const monthsRu = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
];

const monthsEn = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];


const Message = forwardRef(function Message(
  { text, my, media, username, avatar, at, id, read, prev },
  ref
) {

  return (
    <div data-own={my} className={css.msgCont}>
      {(prev && prev.at.day != at.day || prev && prev.at.month != at.month) ?
        <div className={css.timeline}>
          <span>{`${monthsRu[at.month]}, ${at.day}`}</span>
        </div> :
        undefined}
      <div ref={ref} data-id={id} data-testid="msg" className={css.message}>
        <div className={css.messageContainer} data-id={id} data-testid="msg">
          <img src={avatar} className={css.avatar} />
          <Link className={css.username} href={`/users/${username}`}>
            {username}
          </Link>
          {media && (
            <img src={media} alt="media" className={css.messageMedia} />
          )}
        </div>

        <p>{text}</p>
        <span className={css.at}>
          {at ? `${at.hours}:${at.minutes}` : "unknown"}
        </span>
        {
          (read) ?
            <Image className={css.readed} src={checkmarkSvg} alt="checkmark" width={16} height={16}></Image>
            : undefined}
      </div>
    </div>
  )
})

export default Message