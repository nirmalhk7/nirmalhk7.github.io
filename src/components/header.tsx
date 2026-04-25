/* eslint-disable react/react-in-jsx-scope, react/prop-types */
export const CommonHeader: React.FC<{ headerName: string }> = ({ headerName }) => {
  return (
    <>
      <h5 className="mb-2">{headerName}</h5>
      <hr className="mb-4" />
    </>
  );
};