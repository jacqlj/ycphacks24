import { GameEvent } from '../util/structs';
import style from './News.module.css';

export default function News(props: { eventPool: GameEvent[]; speechText?: string }) {
  const speech_bubble = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="333.1425px"
      height="247px"
      viewBox="0 0 444.19 247"
      xmlSpace="preserve"
      className={style.bubble}
    >
      <defs />
      <path
        className="st0"
        d="M0,36l53.19,8.94v-6.68C53.19,17.13,70.32,0,91.45,0h314.49c21.13,0,38.25,17.13,38.25,38.25v170.49 c0,21.13-17.13,38.25-38.25,38.25H91.45c-21.13,0-38.25-17.13-38.25-38.25V73.77L0,36z"
      />
    </svg>
  );

  return (
    <div className={style.container}>
      <div className={style.bubbleContainer} style={{ visibility: props.speechText ? 'visible' : 'hidden' }}>
        {speech_bubble}
        <div className={style.bubbleText}>
          <div>{props.speechText ?? ''}</div>
        </div>
      </div>
      <div className={style.bottomContainer}>
        <div className={style.bottom}>
          <div className={style.logo}>
            <img src="https://cdn.discordapp.com/attachments/1301048665598726224/1302544014053998632/image.png?ex=67288025&is=67272ea5&hm=4dd927f2b3ba44674c8435d2a90aa6e0dae5238dadc80e6a519a0c64fe7733c2&"></img>
          </div>
          <div className={style.ticker_wrap}>
            <div className={style.ticker}>
              {props.eventPool.map((ev) => (
                <div key={ev.id} className={style.ticker__item}>
                  {ev.ticker_text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
