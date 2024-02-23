import style from './Keyboard.module.css';

type PointsProps = {
  points: number;
};

const Points = ({ points }: PointsProps) => {
  return <div className={style.pointsContainer}>Points: {points}</div>;
};

export default Points;
