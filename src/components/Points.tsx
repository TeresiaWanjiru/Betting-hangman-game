import style from './Keyboard.module.css';

type pointsProps = {
  points: number;
};

const Points = ({ points }: pointsProps) => {
  return <div className={style.pointsContainer}>Points: {points}</div>;
};

export default Points;
