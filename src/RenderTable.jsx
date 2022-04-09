import ReactHTMLTableToExcel from "react-html-table-to-excel";

const RenderTable = ({ address, tableList }) => {
  return (
    <>
      {tableList.length !== 0 && (
        <>
          <h1>{address}</h1>
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="download-table-xls-button"
            table="react-table"
            filename="tablexls"
            sheet="tablexls"
            buttonText="Download Details as XLS"
          />
        </>
      )}
      <table id="react-table">
        {tableList.length > 0 &&
          tableList.map(({ title = "", table = [] }) => (
            <tr>
              <td>
                <h2>{title}</h2>
                <table id={title} className="table table-details">
                  {table.map((row, idx) => (
                    <tr key={idx}>
                      {row?.map((col) => (
                        <td key={col}>{col}</td>
                      ))}
                    </tr>
                  ))}
                </table>
              </td>
            </tr>
          ))}
      </table>
    </>
  );
};

export default RenderTable;
