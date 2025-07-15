import { useLoaderData } from 'react-router';

const Theme1 = () => {
  const { backgroundColor } = useLoaderData() as { backgroundColor: string };

  return <div style={{ backgroundColor }}>Theme1</div>;
};

export default Theme1;
