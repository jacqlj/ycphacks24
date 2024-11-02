import style from './StatDisplay.module.css';

function StatDisplay({}) {
  return (
    <>
      <div className={style.container}>
        <div className={style.top}>JAN 01.2024 10:24AM</div>
        <div className={style.bottomcontainer}>
          <div className={style.bottom}>
            <div className={style.capitaltext}>CAPITAL</div>
            <div className={style.moneytext}>$4.5 mil</div>
          </div>
          <div className={style.bottom}>
            <div className={style.capitaltext}>PORTFOLIO</div>
            <div className={style.moneytext}>$3.75 mil</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StatDisplay;
