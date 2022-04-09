const getBuildingDetails = (buildings = {}) => {
    const { residential, commercial } = buildings;
    const tableArr = [];
    const prepareTable = (title = "", building) => {
      const table = [];
      building.forEach((house) => {
        const { display, value } = house;
        display.forEach((row) => {
          table.push([row.title, row.value]);
        });
        value.forEach((row) => {
          table.push([row.title, row.value]);
        });
      });
      return { title, table };
    };
  
    if (residential)
      tableArr.push(prepareTable("Residential Building Details", residential));
    if (commercial)
      tableArr.push(prepareTable("Commercial Building Details", commercial));
    return tableArr;
  };
  
  export default getBuildingDetails;
  