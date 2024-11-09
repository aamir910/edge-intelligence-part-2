import React, { useEffect, useState, useCallback } from "react";
import Papa from "papaparse";
import "./Visualize_filteration.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Sidebar from "../Buttons/SIdeBar" ;

import { Spin } from 'antd'; 

import Navbar from "../NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import InputNode from "three/examples/jsm/nodes/core/InputNode.js";

const csvFiles = [

];
const csvFiles2 = [

];

const Visualize_filteration = () => {

  const [loading, setLoading] = useState(true);
  const [entityHeaders, setEntityHeaders] = useState({});
  const [linkHeaders, setLinkHeaders] = useState({});
  const [entityData, setEnitityData] = useState({});
 const [checkedEntities, setCheckedEntities] = useState({});
  const [checkedLinks, setCheckedLinks] = useState({});

  const [checkedEntityNames, setCheckedEntityNames] = useState([]);
  const [checkedLinkNames, setCheckedLinkNames] = useState([]);
  const navigate = useNavigate();
  const [checkedDropdownItems, setCheckedDropdownItems] = useState({});
  const [selectedEntity, setSelectedEntity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [inputData, setInputData] = useState({});

  const [sameType, setsameType] = useState('');
  const [isAscending, setIsAscending] = useState(false);
console.log(checkedDropdownItems , "here from its send to the next page there ")
  const handleUpArrowClick = () => {
    setIsAscending(true);
  };

  const handleDownArrowClick = () => {
    setIsAscending(false);
  };

  // const [SelectEntityNames, setSelectEntityNames] = useState(false);
  // const [SelectLinkNames, setSelectLinkNames] = useState(false);

  useEffect(() => {
    const loadCSV = (filePath) => {
      return new Promise((resolve, reject) => {
        Papa.parse(filePath, {
          download: true,
          header: true,
          complete: (results) => {
            const data = results.data;
            const header = results.meta.fields;
            resolve({ data, header });
          },
          error: (error) => {
            reject(error);
          },
        });
      });
    };

    const loadAllCSVs = async () => {
      try {
        const entityHeaderPromises = csvFiles2.map((file) => loadCSV(file));
        const linkHeaderPromises = csvFiles.map((file) => loadCSV(file));
        console.log(entityHeaderPromises, "entityHeaderPromises  ");
        const entityResults = await Promise.all(entityHeaderPromises);
        const linkResults = await Promise.all(linkHeaderPromises);
        console.log(entityResults, "entityResults");
        const entityHeadersArray = entityResults.map((result) => result.header);
        const linkHeadersArray = linkResults.map((result) => result.header);
        const entityDataArray = entityResults.map((result) => result.data);

        const newEntityHeaders = {};
        csvFiles2.forEach((file, index) => {
          newEntityHeaders[file] = entityHeadersArray[index];
        });

        const newLinkHeaders = {};
        csvFiles.forEach((file, index) => {
          newLinkHeaders[file] = linkHeadersArray[index];
        });
console.log(newLinkHeaders ,newLinkHeaders ,"newLinkHeaders")
        // setEntityHeaders(newEntityHeaders);
        // setLinkHeaders(newLinkHeaders);
        // setEnitityData(entityDataArray);

        console.log(newEntityHeaders, entityDataArray, "newEntityHeaders");

        const entityResponse = await fetch(
          "https://entertainmentbuz.com/EDGE_INTELLIGENCE/get_nodes_edges_csv.php?type=entity-files"
        );
        const linkResponse = await fetch(
          "https://entertainmentbuz.com/EDGE_INTELLIGENCE/get_nodes_edges_csv.php?type=link-files"
        );

        const url = 'https://entertainmentbuz.com/EDGE_INTELLIGENCE/get_type_equality.php?check=check';

        // Fetch the result from the PHP script
        fetch(url)
            .then(response => response.text()) // Get the response as text
            .then(data => {
                // Save the result to state
               console.log(data ,"here is the response of the data there  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
               setsameType(data) ; 
           
              })
            .catch(error => {
                console.error('Error fetching c sdadasdasdasdasdasd as das das das asdas data:', error);
            });
       
        // const typeReturn = await fetch("https://entertainmentbuz.com/EDGE_INTELLIGENCE/get_type_equality.php?check=check");

    




// console.log(typeReturn , "typeReturn typeReturn typeReturn typeReturn")
        if (!entityResponse.ok || !linkResponse.ok) {
          throw new Error("Failed to fetch files from the backend");
        }

        // Read and log the response body
        const entityBody = await entityResponse.text(); // Read the body as text
        const linkBody = await linkResponse.text(); // Read the body as text

        // Parse the responses as JSON
        const entityFiles2 = JSON.parse(entityBody);
        const linkFiles2 = JSON.parse(linkBody);

        console.log("Entity response body:", entityFiles2);
        console.log("Link response body:", linkFiles2);

        const newEntityHeaders2 = {};

        let entityDataArray2 = [];

        entityFiles2.forEach((file) => {
          newEntityHeaders2[file.fileName] = file.header;
        });

        entityFiles2.forEach((file) => {
          if (file.data) {
            entityDataArray2.push(file.data);
          }
        });

        console.log(newEntityHeaders2, entityDataArray2, "newEntityHeaders2");

        setLinkHeaders(linkFiles2);

        setEntityHeaders(newEntityHeaders2);
        setEnitityData(entityDataArray2);
        setLoading(false);
        // setEntityHeaders(newEntityHeaders);
        // setEnitityData(entityDataArray);

      } catch (error) {
        console.error("Error loading CSV files:", error);
      }
    };

    loadAllCSVs();
  }, []);

  const [uniqueData, setUniqueData] = useState([]);

  useEffect(() => {
    // Function to extract unique values from an array of objects for all keys

    const getUniqueValues = (array) => {
      const uniqueValues = {};

      array.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (!uniqueValues[key]) {
            uniqueValues[key] = new Set();
          }
          if (item[key]) {
            uniqueValues[key].add(item[key]);
          }
        });
      });

      // Convert sets to arrays
      Object.keys(uniqueValues).forEach((key) => {
        uniqueValues[key] = Array.from(uniqueValues[key]);
      });

      return uniqueValues;
    };

    if (entityData.length > 0) {
      // Loop through each array in entityData
      const result = entityData.map((subArray) => getUniqueValues(subArray));
      console.log( entityData,result ,'result of the uniquedata here ')
      setUniqueData(result);




      
    }
  }, [entityData]);

  const getEntityName = (filePath) => {
    // Check if the filePath ends with ".csv"
    if (filePath.endsWith('.csv')) {
        // Remove the ".csv" extension and return the filename
        return filePath.slice(0, -4);
    }
    // Return the original filePath if it doesn't end with ".csv"
    return filePath;
};

const getLinkName = (filePath) => {
    // Check if the filePath ends with ".csv"
    if (filePath.endsWith('.csv')) {
        // Remove the ".csv" extension and return the filename
        return filePath.slice(0, -4);
    }
    // Return the original filePath if it doesn't end with ".csv"
    return filePath;
};

  const handleEntityCheckboxChange = (filePath, headerIndex) => {
    setCheckedEntities((prevState) => ({
      ...prevState,
      [filePath]: headerIndex,
    }));
  };

  const handleLinkCheckboxChange = (filePath) => {
    setCheckedLinks((prevState) => ({
      ...prevState,
      [filePath]: !prevState[filePath],
    }));
  };
  function flattenArrays(data) {
    const result = {};

    for (const section of Object.values(data)) {
        if (typeof section === "object" && section !== null) {
            for (const [key, value] of Object.entries(section)) {
                // Check if the value is an array and has values
                if (Array.isArray(value) && value.length > 0) {
                    result[key] = value;
                }
            }
        }
    }

    return result;
}
let arrays 
  const handleEntityData = (filePath, header, item) => {
    const entityName = getEntityName(filePath);

    // Get the current state of the dropdown items for the specific entity and header
    const currentItems = checkedDropdownItems[entityName]?.[header] || [];
    // Determine if the item should be added or removed
    const newItems = currentItems.includes(item)
    ? currentItems.filter((i) => i !== item)
    : [...currentItems, item];




    // Create the updated checked items structure, including the customerId
    const newCheckedItems = {
      ...checkedDropdownItems,
      [entityName]: {
        ...checkedDropdownItems[entityName],
        [header]: newItems, // Add or update the customerId
      },
    };
    
   
       arrays = flattenArrays(newCheckedItems)
      console.log(arrays , "arrays are there ")
      setCheckedDropdownItems((prevState) => {
        const updatedState = { ...prevState };
    
        // Loop through each key in `arrays` to merge values into `prevState`
        for (const key in arrays) {
            if (Array.isArray(arrays[key])) {
                // Combine existing items in the state with new ones from `arrays`, removing duplicates
                updatedState[key] = [
                    ...(updatedState[key] || []),
                    ...arrays[key].filter(item => !(updatedState[key] || []).includes(item))
                ];
            } else {
                // In case of non-array values, just set them (if required in your case)
                updatedState[key] = arrays[key];
            }
        }
        return updatedState;
    });

    if (!checkedEntityNames.includes(entityName)) {
      setCheckedEntityNames([...checkedEntityNames, entityName]);
    }
  };

  const handleEntityData_main = (filePath) => {
    const entityName = getEntityName(filePath);
    if (checkedEntityNames.includes(entityName)) {
      // If entity is already checked, uncheck it
      setCheckedEntityNames(
        checkedEntityNames.filter((name) => name !== entityName)
      );
    } else {
      // If entity is not checked, check it
      setCheckedEntityNames([...checkedEntityNames, entityName]);
    }
  };

  const handleLinkData = (filePath) => {
    const linkName = getLinkName(filePath);

    // Toggle checkedLinkNames
    setCheckedLinkNames((prevNames) => {
      if (prevNames.includes(linkName)) {
        // If the link is already checked, remove it
        return prevNames.filter((name) => name !== linkName);
      } else {
        // If the link is not checked, add it
        return [...prevNames, linkName];
      }
    });

    // Toggle checkedEntityNames
    // setCheckedEntityNames((prevNames) => {
    //   if (prevNames.includes(linkName)) {
    //     // If the entity is already checked, remove it
    //     return prevNames.filter((name) => name !== linkName);
    //   } else {
    //     // If the entity is not checked, add it
    //     return [...prevNames, linkName];
    //   }
    // });
  };

  // const handleInputData = () => {
  //   if (selectedEntity) {
  //     const upperCaseInputValue = inputValue.toUpperCase();
  //     setInputData({ [selectedEntity]: upperCaseInputValue }); // Save selectedEntity as key and inputValue as value
  //   }
  // };
  const handleInputData = useCallback(() => {
    const upperCaseInputValue = inputValue.toUpperCase();
    setInputData({ [selectedEntity]: upperCaseInputValue }); // Save selectedEntity as key and inputValue as value
    console.log("inputData", inputData);
  }, [selectedEntity, inputValue]);

  useEffect(() => {
    handleInputData();
  }, [handleInputData]);

  const handleSelectChange = (e) => {
    const entity = e.target.value;
    setSelectedEntity(entity);
  };

  const handleInputChange = (e) => {
    const value = e.target.value || "";
    setInputValue(value);
  };

  // Using useEffect to handle data updates after state changes
  // useEffect(() => {
  //   handleInputData();

  // console.log("inputData" , inputData) ;
  // }, [selectedEntity, inputValue]);

  const [showTable1, setShowTable1] = useState(true);

  const handleToggle = (table) => {
    setShowTable1(table === "table1");
  };

  return (
    <>
      <Navbar image="newedgeintelligence.png" color="white" />

      {loading ? (
        <Spin size="large" style={{ textAlign: 'center', padding: '50px' , display:"flex" ,justifyContent:"center" , alignItems:"center"}} />
      ) : (
      
        <div className="table_class  col-10"   style={{
    // background: "red",
    height: "89vh", // Fill the entire viewport height
    // position: "fixed", // Make it fixed
    width: "100%", // Fill the entire viewport width
    // overflowY: "auto", // Allow vertical scrolling if content overflows
  }}>
            <h1> Filters</h1>
            <div>
              <button
                className="custom-button"
                onClick={() => handleToggle("table1")}>
                Filter by entity
              </button>
              <button
                className="custom-button"
                onClick={() => handleToggle("table2")}>
                Filter by id
              </button>
            </div>
  <div style={{display:"flex" ,flexDirection:"row"}}>
            <div className="col-7">
              <div className="table-container">
                <div className="table-section1">
                  <h3 className="entity_class">ENTITY</h3>
                  <div className="table-wrapper" style={{ height: "80%" }}>
                    {showTable1 ? (
                      <table className="table2">
                        <thead>
                          <tr>
                            <th>NAME</th>
                            <th>TYPE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(entityHeaders).map(
                            ([filePath, headers], index) =>
                              headers.map((header, headerIndex) => {
                                if (uniqueData.length !== 0) {
                                  // console.log(
                                  //   "uniqueData uniqueData",
                                  //   uniqueData
                                  // );

                                  if (uniqueData[index][header].length < 150) {
                                    return (
                                      <tr key={`${index}-${headerIndex}`}>
                                        <td>
                                          {headerIndex === 0 ? (
                                            <>
                                              <input
                                                className="inputcheck"
                                                type="checkbox"
                                                onChange={() =>
                                                  handleEntityData_main(
                                                    filePath
                                                  )
                                                }
                                                checked={checkedEntityNames.includes(
                                                  getEntityName(filePath)
                                                )}
                                                value={getEntityName(filePath)}
                                              />
                                              {getEntityName(filePath)}
                                            </>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td>
                                          <div className="dropdown">
                                            <button className="dropbtn">
                                              {header}
                                            </button>
                                            <div className="dropdown-content">
                                              {uniqueData[index][header].map(
                                                (item, itemIndex) => (
                                                  <label key={itemIndex}>
                                                    <input
                                                      className="inputcheck"
                                                      type="checkbox"
                                                      value={item}
                                                      onChange={() => {
                                                        handleEntityData(
                                                          filePath,
                                                          header,
                                                          item
                                                        );
                                                      }}
                                                      checked={
                                                        checkedDropdownItems[
                                                          getEntityName(
                                                            filePath
                                                          )
                                                        ]?.[header]?.[item]
                                                      }
                                                    />
                                                    {item}
                                                  </label>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  }
                                }
                                return null;
                              })
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <table className="table2">
                        <thead>
                          <tr>
                            <th>NAME</th>
                            {/* <th>TYPE</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className="custom-entity-container">
                                <div className="custom-entity-dropdown">
                                  <select
                                    onChange={handleSelectChange}
                                    value={selectedEntity}>
                                    <option value="" disabled>
                                      Select an entity
                                    </option>
                                    {Object.entries(entityHeaders).map(
                                      ([filePath]) => {
                                        if (uniqueData.length !== 0) {
                                          return (
                                            <option
                                              key={filePath}
                                              value={getEntityName(filePath)}>
                                              {getEntityName(filePath)}
                                            </option>
                                          );
                                        }
                                        return null;
                                      }
                                    )}
                                  </select>
                                  <input
                                    type="text"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    placeholder="ENTER ID"
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>

                          {Object.entries(entityHeaders).map(
                            ([filePath, headers], index) => {
                               if (uniqueData.length !== 0) {
                                const entityName = getEntityName(filePath);
                                return (
                                  <tr key={index}>
                                    <td>
                                      <div className="checkbox-label-container">
                                        <input
                                          className="inputcheck"
                                          type="checkbox"
                                          onChange={() =>
                                            handleEntityData_main(filePath)
                                          }
                                          checked={checkedEntityNames.includes(
                                            entityName
                                          )}
                                          value={entityName}
                                        />
                                        <span className="entity-text">
                                          {entityName}
                                          {entityName === sameType  && (
                                            <>
                                              <button
                                                className={`arrow-button ${
                                                  !isAscending ? "active" : ""
                                                }`}
                                                onClick={handleDownArrowClick}>
                                                &darr;
                                              </button>
                                              <button
                                                className={`arrow-button ${
                                                  isAscending ? "active" : ""
                                                }`}
                                                onClick={handleUpArrowClick}>
                                                &uarr;
                                              </button>
                                            </>
                                          )}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }
                              return null;
                            }
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="table-container">
                <div className="table-section2">
                  <h3 className="entity_class">LINK</h3>
                  <div className="table-wrapper">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>NAME</th>
                        </tr>
                      </thead>
                      <tbody>
  {linkHeaders && linkHeaders.length > 0 ? (
    linkHeaders.map((filePath, index) => (
      <tr key={index}>
        <td>
          <input
            type="checkbox"
            onChange={() => handleLinkData(filePath)}
            checked={checkedLinkNames.includes(getLinkName(filePath))}
            value={getLinkName(filePath)}
          />{" "}
          {getLinkName(filePath)}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td>No files available</td>
    </tr>
  )}
</tbody>

                    </table>
                    <button
                      style={{ background: "#2a5594", color: "white" }}
                      onClick={() => {
                        if (false) {
                          alert("Please select the file first");
                        } else {
                          navigate("/3d_graph", {
                            state: {
                              checkedEntityNames,
                              checkedLinkNames,
                              checkedDropdownItems,
                              inputData,
                              isAscending, arrays
                            },
                          }); // You can adjust the delay time if necessary
                        }
                      }}>
                      VISUALIZE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
      
      )}
    




     
      
    </>
  );
};

export default Visualize_filteration;
