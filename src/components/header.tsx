/* eslint-disable react/react-in-jsx-scope, react/prop-types */
export const CommonHeader: React.FC<{ headerName: string }> = ({ headerName }) => {
  return (
    <>
      <h3 className="my-4 text-2xl font-normal">{headerName}</h3>
      <hr className="mb-4" />
    </>
  );
};