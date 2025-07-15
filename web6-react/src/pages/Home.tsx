import { Outlet } from 'react-router';
import Speech from '../components/Speech';

const Home = () => {
  return (
    <div>
      <Speech />
      <Outlet />
    </div>
  );
};

export default Home;
