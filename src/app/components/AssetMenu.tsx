import style from './AssetMenu.module.css';

export default function AssetMenu() {
  return (
    <>
      <div className={style.mode}>
        <span className={style.buy}>Buy</span>
        <span>&times;10</span>
        <span>&times;100</span>
        <span>&times;1000</span>
        <span className={style.sell}>Sell</span>
        <span>&times;10</span>
        <span>&times;100</span>
        <span>&times;1000</span>
      </div>
      <div className={style.menu}>
        <div className={style.category}>
          <i className="bi bi-plus-lg"></i>
          <span>COMMODITIES</span>
        </div>
        <div className={`${style.category} ${style.open}`}>
          <i className="bi bi-dash-lg"></i>
          <span>STOCKS</span>
        </div>
        <div className={style.category}>
          <i className="bi bi-plus-lg"></i>
          <span>CRYPTO</span>
        </div>
      </div>
    </>
  );
}
