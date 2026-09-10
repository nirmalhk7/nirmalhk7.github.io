/* eslint-disable react/react-in-jsx-scope, react/prop-types */
export const CommonHeader: React.FC<{ headerName: string }> = ({ headerName }) => {
  return (
    <>
      <h3 className="mb-2">{headerName}</h3>
      <hr className="mb-4" />
    </>
  );
};
