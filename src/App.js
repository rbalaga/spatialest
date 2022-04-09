import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {
  Container,
  Spinner,
  Col,
  Input,
  Row,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { useState } from "react";
import getTabsTableArr from "./Tabs";
import getBuildingDetails from "./BuildingDetails";
import RenderTable from "./RenderTable";
export default function App() {
  const [address, setAddress] = useState("");
  const [addressInfo, setAddressInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [multiAddresses, setMultiAddresses] = useState([]);
  const getParcelDetails = async (id) => {
    setLoading("Address found. Please wait while we fetch details...");
    try {
      const addDetails = await axios.post("/api/propertycard", {
        parcelid: id,
        card: "",
        year: "",
      });
      const { parcel } = addDetails.data;
      setAddressInfo(parcel);
    } catch (error) {
      setAddressInfo({});
    }
    setLoading(false);
  };
  const handleAddressChange = async (addr) => {
    setLoading("Searching for addresses...");
    const response = await axios.post("/api/search", {
      filters: {
        term: addr,
        page: 1,
        category: "addresses",
      },
      page: 1,
      limit: 21,
    });
    const { id, found, searchResults } = response.data;
    if (Array.isArray(searchResults)) {
      setLoading(false);
      setMultiAddresses(searchResults);
      setAddressInfo({});
      return;
    }
    if (found && id) {
      await getParcelDetails(id);
    }
  };
  // const handleKeyPress = (event) =>
  const handleClick = async () => {
    setMultiAddresses([]);
    if (!address) {
      return;
    }
    await handleAddressChange(address);
  };
  const renderAddressList = () => (
    <ListGroup>
      {multiAddresses.map((add) => (
        <ListGroupItem
          action
          tag="button"
          key={add.UniqParcelIdentifier}
          onClick={async () => {
            setMultiAddresses([]);
            setAddress(add.addresses);
            await getParcelDetails(add.UniqParcelIdentifier);
          }}
        >
          {add.addresses}
        </ListGroupItem>
      ))}
    </ListGroup>
  );
  const { keyinfo, assessment, tabs, buildings } = addressInfo;
  const keyInfoTable = getKeyInfoTable("Overview", keyinfo);
  const tabsTables = getTabsTableArr(tabs);
  const buildingTables = getBuildingDetails(buildings || {});
  const tableList = [];
  keyinfo && tableList.push(keyInfoTable);
  if (Array.isArray(assessment) && assessment.length) {
    const assessmentTable = getAssessmentTable(assessment);
    tableList.push(assessmentTable);
  }
  tabsTables && tableList.push(...tabsTables);
  buildingTables && tableList.push(...buildingTables);
  return (
    <div className="App">
      <Container>
        <Row style={{ padding: "10px 0" }}>
          <Col md="8">
            <Input
              value={address}
              type="text"
              onChange={({ currentTarget }) => setAddress(currentTarget.value)}
              onKeyUp={(e) => e.key === "Enter" && handleClick()}
            />
          </Col>
          <Col md="3">
            <Button onClick={handleClick} style={{ width: "100%" }}>
              Fetch details
            </Button>
          </Col>
        </Row>
        {loading ? (
          <>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p>{loading}</p>
          </>
        ) : Array.isArray(multiAddresses) && multiAddresses.length ? (
          renderAddressList()
        ) : (
          <RenderTable address={address} tableList={tableList} />
        )}
      </Container>
    </div>
  );
}

const getAssessmentTable = (assessment = []) => {
  const listArr = {};
  assessment.forEach((item) => {
    if (listArr[item.printcolumn]) {
      listArr[item.printcolumn].push(item);
    } else {
      listArr[item.printcolumn] = [item];
    }
  });
  const table = [];
  listArr[1].forEach((i, idx) => {
    const row = Object.keys(listArr).map((j) =>
      listArr[j][idx].title ? listArr[j][idx].title : listArr[j][idx].value
    );
    table.push(row);
  });
  return { title: "Market assessment details", table };
};

const getKeyInfoTable = (title = "", keyinfo) => {
  const table = [];
  keyinfo &&
    keyinfo.forEach((info) => {
      const { title, value } = info;
      if (title && value) {
        table.push([title, value]);
      }
    });
  return { title, table };
};
