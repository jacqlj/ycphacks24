import style from './StatDisplay.module.css';

function StatDisplay(props: { capital: string; datetime: string; portfolio: string }) {
  return (
    <>
      <div className={style.container}>
        <div className={style.top}>{props.datetime}</div>
        <div className={style.bottomcontainer}>
          <div className={style.bottom}>
            <div className={style.capitaltext}>CAPITAL</div>
            <div className={style.moneytext}>${props.capital}</div>
          </div>
          <div className={style.bottom}>
            <div className={style.capitaltext}>PORTFOLIO</div>
            <div className={style.moneytext}>${props.portfolio}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StatDisplay;
