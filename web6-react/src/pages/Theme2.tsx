import { useLoaderData } from 'react-router';

const Theme2 = () => {
  const { backgroundColor } = useLoaderData() as { backgroundColor: string };

  return <div style={{ backgroundColor }}>Theme2</div>;
};

export default Theme2;
