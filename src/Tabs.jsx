const getTabsTableArr = (tabs = {}) => {
    const arr = [];
    Object.keys(tabs).forEach((tab) => {
      const { result, headers } = tabs[tab];
      const rows = [];
      const headerRow = headers?.map((header) => header.title);
      rows.push(headerRow);
      if (Array.isArray(result)) {
        result.forEach(({ row }) => {
          if (row) {
            const valRow = row?.map((col) => col.value);
            rows.push(valRow);
          }
          return;
        });
      }
      if (rows.length !== 0) {
        arr.push({ title: tab, table: rows });
      }
    });
    return arr;
  };
  
  export default getTabsTableArr;
  