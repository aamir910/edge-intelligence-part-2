import React, { useRef, useEffect, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
import { Spin } from "antd";
import Papa from "papaparse";
import * as THREE from "three";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./NavBar/NavBar";
const predefinedColors = [
  "white",
  "lightblue",
  "orange",
  "cyan",
  "lime",
  "black",
];

import { useLocation } from "react-router-dom";
const customerImage = "customer.png"; // Replace with the actual path to the customer image

const ForceGraph2DComponent = () => {
  const location = useLocation();

  // Check if location.state exists before accessing its properties
  const checkedEntityNames = location.state?.checkedEntityNames || [];
  const checkedLinkNames = location.state?.checkedLinkNames || [];

  const checkedDropdownItems = location.state?.checkedDropdownItems || [];

  const SingleCheckCustomer = location.state?.inputData || [];

  const isAscending = location.state?.isAscending || false;
  console.log(checkedLinkNames , "checkedDropdownItems")
  const fgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  const getRepeatingNodes = (nodes) => {
    const seenIds = new Set();
    const repeatingNodes = [];

    nodes.forEach((node) => {
      if (seenIds.has(node.id)) {
        repeatingNodes.push(node);
      } else {
        seenIds.add(node.id);
      }
    });

    return repeatingNodes;
  };
  const repeatingNodes = getRepeatingNodes(graphData.nodes);

  if (repeatingNodes.length > 0) {
    console.log("Repeating nodes:", repeatingNodes);
  } else {
    console.log("All nodes are unique.");
  }

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  });
  const [colorPicker, setColorPicker] = useState({
    visible: false,
    x: 0,
    y: 0,
    type: "",
  });


  // const [nodeColors, setNodeColors] = useState({
  //   N_CUSTOMER1: "white",
  //   N_PARTNUMBER1: "lightblue",
  //   N_PURCHORDER1: "orange",
  //   N_SELLORDER1: "cyan",
  //   N_SUPPLIER1: "lime",
  // });


  // const [linkColors, setLinkColors] = useState({
  //   E_BOM1: "white",
  //   E_ORDERCUST1: "lightblue",
  //   E_ORDERSUPP1: "orange",
  //   E_PNSELLORD1: "cyan",
  //   E_PNSUPPORD1: "lime",
  // });

  const assignColors = (keys, colors) => {
    return keys.reduce((acc, key, index) => {
      acc[key] = colors[index % colors.length];  // Cycle through colors if keys exceed the array length
      return acc;
    }, {});
  };
  
  // Set initial colors for node and link keys
  const [nodeColors, setNodeColors] = useState({});
  const [linkColors, setLinkColors] = useState({});
  
  useEffect(() => {
    // Assign colors to node keys
    console.log(checkedEntityNames ,"checkedEntityNames")
    const newNodeColors = assignColors(checkedEntityNames, predefinedColors);
    setNodeColors(newNodeColors);
  
    // Assign colors to link keys
    const newLinkColors = assignColors(checkedLinkNames, predefinedColors);
    setLinkColors(newLinkColors);
  }, [checkedEntityNames, checkedLinkNames]);
  
  console.log('Node Colors:', nodeColors);
  console.log('Link Colors:', linkColors);


  const [selectedLinkType, setSelectedLinkType] = useState("");
  const [excludedTypes, setExcludedTypes] = useState([]);

  let keyValuesArray = [];

  // Iterate through the main keys
  for (let mainKey in checkedDropdownItems) {
    // Iterate through the sub-keys and add them to the array
    for (let subKey in checkedDropdownItems[mainKey]) {
      keyValuesArray.push({
        key: subKey,
        values: checkedDropdownItems[mainKey][subKey],
      });
    }
  }
console.log(checkedDropdownItems , "checkedDropdownItems") ;
  const nCustomer = checkedDropdownItems["N_CUSTOMER1"] || {};
  const nPartNumber = checkedDropdownItems["N_PARTNUMBER1"] || {};
  const nPurchOrder = checkedDropdownItems["N_PURCHORDER1"] || {};
  const nSellOrder = checkedDropdownItems["N_SELLORDER1"] || {};
  const nSupplier = checkedDropdownItems["N_SUPPLIER1"] || {};

  function filterByNCustomer(data) {
    const filteredData = data.filter((item) => {
      const matchesCustomer =
        SingleCheckCustomer.N_CUSTOMER === undefined ||
        SingleCheckCustomer.N_CUSTOMER === item.Entity_1 ||
        SingleCheckCustomer.N_CUSTOMER === item.Entity_2 ||
        SingleCheckCustomer.N_CUSTOMER === "";
      const matchesCountry =
        !item.COUNTRY ||
        nCustomer.COUNTRY === undefined ||
        nCustomer.COUNTRY.includes(item.COUNTRY) ||
        item.COUNTRY === "";
      const matchesMarket =
        !item.MARKET ||
        nCustomer.MARKET === undefined ||
        nCustomer.MARKET.includes(item.MARKET) ||
        item.MARKET === "";
      const matchesArea =
        !item.AREA ||
        nCustomer.AREA === undefined ||
        nCustomer.AREA.includes(item.AREA) ||
        item.AREA === "";
      const matchesZone =
        !item.ZONE ||
        nCustomer.ZONE === undefined ||
        nCustomer.ZONE.includes(item.ZONE) ||
        item.ZONE === "";

      if (!matchesCountry && item.COUNTRY !== "")
        Remove_nodes.push(item.Entity_1);
      if (!matchesMarket && item.MARKET !== "")
        Remove_nodes.push(item.Entity_1);
      if (!matchesArea && item.AREA !== "") Remove_nodes.push(item.Entity_1);
      if (!matchesZone && item.ZONE !== "") Remove_nodes.push(item.Entity_1);

      if (!matchesCountry && item.COUNTRY !== "")
        Remove_nodes.push(item.Entity_2);
      if (!matchesMarket && item.MARKET !== "")
        Remove_nodes.push(item.Entity_2);
      if (!matchesArea && item.AREA !== "") Remove_nodes.push(item.Entity_2);
      if (!matchesZone && item.ZONE !== "") Remove_nodes.push(item.Entity_2);

      return (
        matchesCustomer &&
        matchesCountry &&
        matchesMarket &&
        matchesArea &&
        matchesZone
      );
    });

    // Adding unique entities to the new array in item.entity
    // Remove_nodes = [...new Set(Remove_nodes)]; // Remove duplicates

    return filteredData;
  }

  function filterByN_PARTNUMBER(data) {
    const filteredData = data.filter((item) => {
      const matchesCustomer =
        SingleCheckCustomer.N_CUSTOMER === undefined ||
        SingleCheckCustomer.N_CUSTOMER === item.Entity_1 ||
        SingleCheckCustomer.N_CUSTOMER === item.Entity_2 ||
        SingleCheckCustomer.N_CUSTOMER === "";

      const matchesClass =
        !item.CLASS ||
        nPartNumber.CLASS === undefined ||
        nPartNumber.CLASS.includes(item.CLASS) ||
        item.CLASS === "";
      const matchesMOB =
        !item.MOB ||
        nPartNumber.MOB === undefined ||
        nPartNumber.MOB.includes(item.MOB) ||
        item.MOB === "";
      const matchesUM =
        !item.UM ||
        nPartNumber.UM === undefined ||
        nPartNumber.UM.includes(item.UM) ||
        item.UM === "";
      const matchesDept =
        !item.DEPT ||
        nPartNumber.DEPT === undefined ||
        nPartNumber.DEPT.includes(item.DEPT) ||
        item.DEPT === "";
      const matchesWOCE =
        !item.WOCE ||
        nPartNumber.WOCE === undefined ||
        nPartNumber.WOCE.includes(item.WOCE) ||
        item.WOCE === "";
      const matchesBOMLEV =
        !item.BOMLEV ||
        nPartNumber.BOMLEV === undefined ||
        nPartNumber.BOMLEV.includes(item.BOMLEV) ||
        item.BOMLEV === "";
      const matchesFAMILY =
        !item.FAMILY ||
        nPartNumber.FAMILY === undefined ||
        nPartNumber.FAMILY.includes(item.FAMILY) ||
        item.FAMILY === "";

      if (!matchesClass && item.CLASS !== "")
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      if (!matchesMOB && item.MOB !== "")
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      if (!matchesUM && item.UM !== "")
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      if (!matchesDept && item.DEPT !== "")
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      if (!matchesWOCE && item.WOCE !== "")
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      if (!matchesBOMLEV && item.BOMLEV !== "")
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      if (!matchesFAMILY && item.FAMILY !== "")
        Remove_nodes.push(item.Entity_1, item.Entity_2);

      return (
        matchesCustomer &&
        matchesClass &&
        matchesMOB &&
        matchesUM &&
        matchesDept &&
        matchesWOCE &&
        matchesBOMLEV &&
        matchesFAMILY
      );
    });

    // Optionally, remove duplicates from Remove_nodes
    // Remove_nodes = [...new Set(Remove_nodes)];

    return filteredData;
  }
  const processCSV = (data) => {
    const nodesMap = {};

  
    // const links = data.slice(0, 50).map((row) => {

    const links = data.map((row) => {
      const { Entity_1, Entity_2, Entity_Type_1, Entity_Type_2, Edge_Type } =
        row;

      if (!nodesMap[Entity_1]) {
        nodesMap[Entity_1] = { id: Entity_1, group: Entity_Type_1 };
      }
      if (!nodesMap[Entity_2]) {
        nodesMap[Entity_2] = { id: Entity_2, group: Entity_Type_2 };
      }

      return { source: Entity_1, target: Entity_2, type: Edge_Type };
    });

    const nodes = Object.values(nodesMap);
    setGraphData({ nodes, links });
  };

  function filterByN_PurchOrder(data) {
    const filteredData = data.filter((item) => {
      const matchesPurchOrderType =
        !item.PURCH_ORDER_TYPE ||
        nPurchOrder.PURCH_ORDER_TYPE === undefined ||
        nPurchOrder.PURCH_ORDER_TYPE.includes(item.PURCH_ORDER_TYPE) ||
        item.PURCH_ORDER_TYPE === "";

      // Add entities to Remove_nodes if they don't match criteria
      if (!matchesPurchOrderType && item.PURCH_ORDER_TYPE !== "") {
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      }

      return matchesPurchOrderType;
    });

    return filteredData;
  }

  let Remove_nodes = [];
  function filterByN_Sellorder(data) {
    const filteredData = data.filter((item) => {
      const matchesSellOrderType =
        !item.SELL_ORDER_TYPE ||
        nSellOrder.SELL_ORDER_TYPE === undefined ||
        nSellOrder.SELL_ORDER_TYPE.includes(item.SELL_ORDER_TYPE) ||
        item.SELL_ORDER_TYPE === "";

      // Add entities to Remove_nodes if they don't match criteria
      if (!matchesSellOrderType && item.SELL_ORDER_TYPE !== "") {
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      }

      return matchesSellOrderType;
    });

    return filteredData;
  }

  function filterByN_SUPPLIER(data) {
    const filteredData = data.filter((item) => {
      const matchesSupplierCountry =
        !item.COUNTRY_SUPPLIER ||
        nSupplier.COUNTRY === undefined ||
        nSupplier.COUNTRY.includes(item.COUNTRY_SUPPLIER) ||
        item.COUNTRY_SUPPLIER === "";

      // Add entities to Remove_nodes if they don't match criteria
      if (!matchesSupplierCountry && item.COUNTRY_SUPPLIER !== "") {
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      }

      return matchesSupplierCountry;
    });

    return filteredData;
  }

  let removeNodes3 = [];

  function filterAndUpdateNodes(data, removeNodes) {
    let removeNodes2 = [];
    const filteredRows = data.filter((row) => {
      const { Entity_1, Entity_2 } = row;

      if (removeNodes.includes(Entity_1) || removeNodes.includes(Entity_2)) {
        removeNodes2.push(Entity_1, Entity_2);
        removeNodes3.push(Entity_1, Entity_2);

        return false; // Exclude this row
      }

      return true; // Include this row
    });

    return { filteredRows, removeNodes2, removeNodes3 };
  }

  let allnodes = [];

  function filterAndUpdateNodes_input(data, addnodestemp) {
    let addnodes2 = [];

    const filteredRows = data.filter((row, key) => {
      const { Entity_1, Entity_2 } = row;

      if (addnodestemp.includes(Entity_2)) {
        if (
          row.Entity_Type_1 === "N_PARTNUMBER" &&
          row.Entity_Type_2 === "N_PARTNUMBER"
        ) {
     

          
          // if (addnodestemp.includes(Entity_1)) {
          //   if (Entity_1 > Entity_2) {
          //     addnodes2.push(Entity_1);
          //     return true; // Include this row
          //   } else {
          //     return false;
          //   }
          // }


          if (isAscending) {
          if (addnodestemp.includes(Entity_2)) {
              if (Entity_1 < Entity_2) {
                addnodes2.push(Entity_1);
                return true; // Include this row
              } else {
                return false;
              }
            }
          } else {

          if (addnodestemp.includes(Entity_1)) {
            if (Entity_1 > Entity_2) {
              addnodes2.push(Entity_1);
              return true; // Include this row
            } else {
              return false;
            }
          }
   
          }

        }
        else {
          addnodes2.push(Entity_1);
          return true; // Include this row
        }
      }

      // change will be there
      if (addnodestemp.includes(Entity_1)) {
       
  
    if (Object.keys(SingleCheckCustomer)[0] !== "N_SUPPLIER") {
          if (
            row.Entity_Type_1 === "N_PURCHORDER" &&
            row.Entity_Type_2 === "N_PARTNUMBER"
          ) {
            return false;
          }
          if (
            row.Entity_Type_1 === "N_SUPPLIER" &&
            row.Entity_Type_2 === "N_PURCHORDER"
          ) {
            return false;
          }
        }


        
        if (

          row.Entity_Type_1  ===  row.Entity_Type_2
          // row.Entity_Type_1 === "N_PARTNUMBER" &&
          // row.Entity_Type_2 === "N_PARTNUMBER"
        ) {
          
          if (isAscending) {
            // downward 
            if (Entity_1 > Entity_2) {
              addnodes2.push(Entity_2);
              return true; // Include this row
            } else {
              return false;
            }
          } else {

            // upword 
            
            if (Entity_1 < Entity_2) {
              
               if( row.Entity_Type_1 === "N_SELLORDER" && row.Entity_Type_2 !== "N_PARTNUMBER"
               ){
                return false;
               }
                 
              // console.log("check " ,Entity_2 )
              addnodes2.push(Entity_2);
              return true; // Include this row
            } else {
              return false;
            }
          }
        } else {

          addnodes2.push(Entity_2);
          return true; // Include this row
        }
      }

      return false; // Exclude this row
    });
    console.log(filteredRows, "filteredRows");

    allnodes = allnodes.concat(filteredRows);

    return { filteredRows, addnodes2 };
  }

  // here is the code to add the nodes there
  let add_nodes = [];
  function filterByProperty(data, property) {
    const filteredData = data.filter((item) => {
      const matchesProperty =
        SingleCheckCustomer[property] === item.Entity_1 ||
        SingleCheckCustomer[property] === item.Entity_2 ||
        SingleCheckCustomer[property] === undefined;

      if (SingleCheckCustomer[property] === item.Entity_1)
        add_nodes.push(item.Entity_2);
      if (SingleCheckCustomer[property] === item.Entity_2)
        add_nodes.push(item.Entity_1);

      return matchesProperty;
    });

    return filteredData;
  }

  useEffect(() => {

    Papa.parse("https://entertainmentbuz.com//EDGE_INTELLIGENCE/Get_merge_file.php", {
      download: true,
      header: true,
      complete: (result) => {
        console.log(result.data, excludedTypes, "result.data");

        let filteredData = result.data.filter(
          (row) =>
            checkedEntityNames.includes(row.Entity_Type_1) &&
            checkedEntityNames.includes(row.Entity_Type_2) &&
            checkedEntityNames.includes(row.Edge_Type)
        );

        // Arrays to store main keys and sub-keys

        // Iterate through the main keys

        if (
          SingleCheckCustomer.N_CUSTOMER === undefined &&
          SingleCheckCustomer.N_PARTNUMBER === undefined &&
          SingleCheckCustomer.N_PURCHORDER === undefined &&
          SingleCheckCustomer.N_SELLORDER === undefined &&
          SingleCheckCustomer.N_SUPPLIER === undefined
        ) {
          let nCustomer_file_filters = filterByNCustomer(filteredData);

          // Initial filter and update nodes

          let filterFunctionResult = filterAndUpdateNodes(
            nCustomer_file_filters,
            Remove_nodes
          );
          while (filterFunctionResult.removeNodes2.length > 0) {
            filterFunctionResult = filterAndUpdateNodes(
              filterFunctionResult.filteredRows,
              filterFunctionResult.removeNodes3
            );
          }
          let finalFilteredRows = filterFunctionResult.filteredRows;

          // Apply additional filters and update nodes in sequence
          // Filter by N_PARTNUMBER
          Remove_nodes = [];
          let N_PARTNUMBER_filter = filterByN_PARTNUMBER(finalFilteredRows);

          filterFunctionResult = filterAndUpdateNodes(
            N_PARTNUMBER_filter,
            Remove_nodes
          );

          while (filterFunctionResult.removeNodes2.length > 0) {
            filterFunctionResult = filterAndUpdateNodes(
              filterFunctionResult.filteredRows,
              filterFunctionResult.removeNodes3
            );
          }

          finalFilteredRows = filterFunctionResult.filteredRows;

          // Filter by N_PurchOrder
          Remove_nodes = [];
          let filteredData_PurchOrder = filterByN_PurchOrder(finalFilteredRows);
          filterFunctionResult = filterAndUpdateNodes(
            filteredData_PurchOrder,
            Remove_nodes
          );

          while (filterFunctionResult.removeNodes2.length > 0) {
            filterFunctionResult = filterAndUpdateNodes(
              filterFunctionResult.filteredRows,
              filterFunctionResult.removeNodes3
            );
          }

          finalFilteredRows = filterFunctionResult.filteredRows;

          // Filter by N_Sellorder
          Remove_nodes = [];
          let nSellOrder_file_filter = filterByN_Sellorder(finalFilteredRows);
          filterFunctionResult = filterAndUpdateNodes(
            nSellOrder_file_filter,
            Remove_nodes
          );

          while (filterFunctionResult.removeNodes2.length > 0) {
            filterFunctionResult = filterAndUpdateNodes(
              filterFunctionResult.filteredRows,
              filterFunctionResult.removeNodes3
            );
          }

          finalFilteredRows = filterFunctionResult.filteredRows;

          // Filter by N_SUPPLIER
          Remove_nodes = [];
          let manSupplier_file_filter = filterByN_SUPPLIER(finalFilteredRows);
          filterFunctionResult = filterAndUpdateNodes(
            manSupplier_file_filter,
            Remove_nodes
          );

          while (filterFunctionResult.removeNodes2.length > 0) {
            filterFunctionResult = filterAndUpdateNodes(
              filterFunctionResult.filteredRows,
              filterFunctionResult.removeNodes3
            );
          }

          finalFilteredRows = filterFunctionResult.filteredRows;

          processCSV(finalFilteredRows);
        } else {
          if (SingleCheckCustomer.N_CUSTOMER !== undefined) {
            let nCustomer_file_filters = filterByProperty(
              filteredData,
              "N_CUSTOMER"
            );
          } else if (SingleCheckCustomer.N_PARTNUMBER !== undefined) {
            let nCustomer_file_filters = filterByProperty(
              filteredData,
              "N_PARTNUMBER"
            );
          } else if (SingleCheckCustomer.N_PURCHORDER !== undefined) {
            let nCustomer_file_filters = filterByProperty(
              filteredData,
              "N_PURCHORDER"
            );
          } else if (SingleCheckCustomer.N_SELLORDER !== undefined) {
            let nCustomer_file_filters = filterByProperty(
              filteredData,
              "N_SELLORDER"
            );
          } else if (SingleCheckCustomer.N_SUPPLIER !== undefined) {
            let nCustomer_file_filters = filterByProperty(
              filteredData,
              "N_SUPPLIER"
            );
          }
            
           if (Object.keys(SingleCheckCustomer)[0] === "N_PARTNUMBER") 
           {
             add_nodes = [Object.values(SingleCheckCustomer)[0]];
           }
              

          let filterFunctionResult = filterAndUpdateNodes_input(
            filteredData,
            add_nodes
          );
// 1
          filterFunctionResult = filterAndUpdateNodes_input(
            filteredData,
            filterFunctionResult.addnodes2
          );
// 2
          filterFunctionResult = filterAndUpdateNodes_input(
            filteredData,
            filterFunctionResult.addnodes2
          );
// 3
          filterFunctionResult = filterAndUpdateNodes_input(
            filteredData,
            filterFunctionResult.addnodes2
          );
// 4
          filterFunctionResult = filterAndUpdateNodes_input(
            filteredData,
            filterFunctionResult.addnodes2
          );
 // 5
          filterFunctionResult = filterAndUpdateNodes_input(
            filteredData,
            filterFunctionResult.addnodes2
          );
 // 6
          filterFunctionResult = filterAndUpdateNodes_input(
            filteredData,
            filterFunctionResult.addnodes2
          );



          console.log("final fiter data is ", filterFunctionResult, allnodes);
          let finalFilteredRows = filterFunctionResult.filteredRows;
          console.log("allnodes", allnodes);
          processCSV(allnodes);
        }
      },
      error: (error) => {
        console.error("Error reading CSV file:", error);
      },
    });
  }, []);

  useEffect(() => {
    const fg = fgRef.current;
    if (fg) {
      fg.d3Force("link").distance((link) => 100); // You can customize the distance
    }
    console.log(graphData ," graphData graphData")
  }, [graphData]);

  const getNodeColor = (node) => nodeColors[node.group] || nodeColors.default;

  const getLinkColor = (link) => linkColors[link.type] || linkColors.default;

  const getNodeShape = (node) => {
    const color = getNodeColor(node);

    switch (node.group) {
      case "N_CUSTOMER":
        return new THREE.Mesh(
          new THREE.SphereGeometry(5),
          new THREE.MeshBasicMaterial({ color })
        );
      case "N_PARTNUMBER":
        return new THREE.Mesh(
          new THREE.ConeGeometry(5, 20, 3),
          new THREE.MeshBasicMaterial({ color })
        );
      case "N_PURCHORDER":
        return new THREE.Mesh(
          new THREE.BoxGeometry(10, 10, 10),
          new THREE.MeshBasicMaterial({ color })
        );
      case "N_SELLORDER":
        return new THREE.Mesh(
          new THREE.BoxGeometry(10, 5, 5),
          new THREE.MeshBasicMaterial({ color })
        );
      case "N_SUPPLIER":
        return new THREE.Mesh(
          new THREE.CylinderGeometry(5, 5, 5, 40),
          new THREE.MeshBasicMaterial({ color })
        );
      default:
        return new THREE.Mesh(
          new THREE.SphereGeometry(5),
          new THREE.MeshBasicMaterial({ color })
        );
    }
  };

  const renderLegend = () => (
    <>
      <Navbar image="newedgeintelligence.png" color="white" />
      <div className="legend">
        <ul>
          <div class="container">
            <div class="row">
              <div class="col-6">
                <h4>Nodes</h4>
              </div>
              <div class="col-6 text-end">
                <button class="btn btn-primary" onClick={applyFilters}>
                  Filter
                </button>
              </div>
            </div>
          </div>
          {Object.keys(nodeColors).map(
            (type) =>
              checkedEntityNames.includes(type) && (
                <li key={type}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      className="checkbox1"
                      type="checkbox"
                      checked={
                        !excludedTypes.includes(type) &&
                        checkedEntityNames.includes(type)
                      }
                      onChange={() => handleCheckboxChange(type)}
                    />
                    <svg
                      width="20"
                      height="20"
                      onClick={(e) =>
                        handleLegendClick(type, e.clientX, e.clientY)
                      }>
                      {getNodeShape({ group: type }).geometry.type ===
                        "SphereGeometry" && (
                        <circle cx="10" cy="10" r="8" fill={nodeColors[type]} />
                      )}
                      {getNodeShape({ group: type }).geometry.type ===
                        "ConeGeometry" && (
                        <polygon
                          points="5,0 15,20 5,20"
                          fill={nodeColors[type]}
                        />
                      )}
                      {getNodeShape({ group: type }).geometry.type ===
                        "BoxGeometry" && (
                        <rect
                          x="5"
                          y="5"
                          width="10"
                          height="10"
                          fill={nodeColors[type]}
                        />
                      )}
                      {getNodeShape({ group: type }).geometry.type ===
                        "CylinderGeometry" && (
                        <rect
                          x="5"
                          y="5"
                          width="20"
                          height="10"
                          fill={nodeColors[type]}
                        />
                      )}
                    </svg>
                    <span>{type}</span>
                  </div>
                </li>
              )
          )}
          <h4>Links</h4>
          {Object.keys(linkColors).map(
            (type) =>
              checkedEntityNames.includes(type) && (
                <li key={type}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      className="checkbox1"
                      type="checkbox"
                      checked={
                        !excludedTypes.includes(type) &&
                        checkedEntityNames.includes(type)
                      }
                      onChange={() => handleCheckboxChange(type)}
                    />
                    <svg
                      width="20"
                      height="20"
                      onClick={(e) =>
                        handleLegendClick(type, e.clientX, e.clientY)
                      }>
                      <line
                        x1="0"
                        y1="10"
                        x2="20"
                        y2="10"
                        stroke={linkColors[type]}
                        strokeWidth="6"
                      />
                    </svg>
                    <span>{type}</span>
                  </div>
                </li>
              )
          )}
        </ul>
      </div>
    </>
  );
  const handleCheckboxChange = (type) => {
    setExcludedTypes((prevExcludedTypes) =>
      prevExcludedTypes.includes(type)
        ? prevExcludedTypes.filter((excludedType) => excludedType !== type)
        : [...prevExcludedTypes, type]
    );
  };

  const applyFilters = () => {
    Papa.parse("https://entertainmentbuz.com//EDGE_INTELLIGENCE/Get_merge_file.php", {
      download: true,
      header: true,
      complete: (result) => {
        let filteredData = result.data.filter(
          (row) =>
            checkedEntityNames.includes(row.Entity_Type_1) &&
            checkedEntityNames.includes(row.Entity_Type_1) &&
            checkedEntityNames.includes(row.Edge_Type)
        );

        const filteredData2 = filteredData.filter(
          (row) =>
            !excludedTypes.includes(row.Entity_Type_1) &&
            !excludedTypes.includes(row.Entity_Type_2) &&
            !excludedTypes.includes(row.Edge_Type)
        );

        // Iterate through the main keys

        if (
          SingleCheckCustomer.N_CUSTOMER === undefined &&
          SingleCheckCustomer.N_PARTNUMBER === undefined &&
          SingleCheckCustomer.N_PURCHORDER === undefined &&
          SingleCheckCustomer.N_SELLORDER === undefined &&
          SingleCheckCustomer.N_SUPPLIER === undefined
        ) {
          let nCustomer_file_filters = filterByNCustomer(filteredData2);

          // Initial filter and update nodes

          let filterFunctionResult = filterAndUpdateNodes(
            nCustomer_file_filters,
            Remove_nodes
          );
          while (filterFunctionResult.removeNodes2.length > 0) {
            filterFunctionResult = filterAndUpdateNodes(
              filterFunctionResult.filteredRows,
              filterFunctionResult.removeNodes3
            );
          }
          let finalFilteredRows = filterFunctionResult.filteredRows;

          // Apply additional filters and update nodes in sequence
          // Filter by N_PARTNUMBER
          Remove_nodes = [];
          let N_PARTNUMBER_filter = filterByN_PARTNUMBER(finalFilteredRows);

          filterFunctionResult = filterAndUpdateNodes(
            N_PARTNUMBER_filter,
            Remove_nodes
          );

          while (filterFunctionResult.removeNodes2.length > 0) {
            filterFunctionResult = filterAndUpdateNodes(
              filterFunctionResult.filteredRows,
              filterFunctionResult.removeNodes3
            );
          }

          finalFilteredRows = filterFunctionResult.filteredRows;

          // Filter by N_PurchOrder
          Remove_nodes = [];
          let filteredData_PurchOrder = filterByN_PurchOrder(finalFilteredRows);
          filterFunctionResult = filterAndUpdateNodes(
            filteredData_PurchOrder,
            Remove_nodes
          );

          while (filterFunctionResult.removeNodes2.length > 0) {
            filterFunctionResult = filterAndUpdateNodes(
              filterFunctionResult.filteredRows,
              filterFunctionResult.removeNodes3
            );
          }

          finalFilteredRows = filterFunctionResult.filteredRows;

          // Filter by N_Sellorder
          Remove_nodes = [];
          let nSellOrder_file_filter = filterByN_Sellorder(finalFilteredRows);
          filterFunctionResult = filterAndUpdateNodes(
            nSellOrder_file_filter,
            Remove_nodes
          );

          while (filterFunctionResult.removeNodes2.length > 0) {
            filterFunctionResult = filterAndUpdateNodes(
              filterFunctionResult.filteredRows,
              filterFunctionResult.removeNodes3
            );
          }

          finalFilteredRows = filterFunctionResult.filteredRows;

          // Filter by N_SUPPLIER
          Remove_nodes = [];
          let manSupplier_file_filter = filterByN_SUPPLIER(finalFilteredRows);
          filterFunctionResult = filterAndUpdateNodes(
            manSupplier_file_filter,
            Remove_nodes
          );

          while (filterFunctionResult.removeNodes2.length > 0) {
            filterFunctionResult = filterAndUpdateNodes(
              filterFunctionResult.filteredRows,
              filterFunctionResult.removeNodes3
            );
          }

          finalFilteredRows = filterFunctionResult.filteredRows;
          console.log("allnodes", allnodes);
          processCSV(finalFilteredRows);
        } else {
          if (SingleCheckCustomer.N_CUSTOMER !== undefined) {
            let nCustomer_file_filters = filterByProperty(
              filteredData2,
              "N_CUSTOMER"
            );
          } else if (SingleCheckCustomer.N_PARTNUMBER !== undefined) {
            let nCustomer_file_filters = filterByProperty(
              filteredData2,
              "N_PARTNUMBER"
            );
          } else if (SingleCheckCustomer.N_PURCHORDER !== undefined) {
            let nCustomer_file_filters = filterByProperty(
              filteredData2,
              "N_PURCHORDER"
            );
          } else if (SingleCheckCustomer.N_SELLORDER !== undefined) {
            let nCustomer_file_filters = filterByProperty(
              filteredData2,
              "N_SELLORDER"
            );
          } else if (SingleCheckCustomer.N_SUPPLIER !== undefined) {
            let nCustomer_file_filters = filterByProperty(
              filteredData2,
              "N_SUPPLIER"
            );
          }

          let filterFunctionResult = filterAndUpdateNodes_input(
            filteredData2,
            add_nodes
          );
     // 1
     filterFunctionResult = filterAndUpdateNodes_input(
      filteredData,
      filterFunctionResult.addnodes2
    );
// 2
    filterFunctionResult = filterAndUpdateNodes_input(
      filteredData,
      filterFunctionResult.addnodes2
    );
// 3
    filterFunctionResult = filterAndUpdateNodes_input(
      filteredData,
      filterFunctionResult.addnodes2
    );
// 4
    filterFunctionResult = filterAndUpdateNodes_input(
      filteredData,
      filterFunctionResult.addnodes2
    );
// 5
    filterFunctionResult = filterAndUpdateNodes_input(
      filteredData,
      filterFunctionResult.addnodes2
    );
// 6
    filterFunctionResult = filterAndUpdateNodes_input(
      filteredData,
      filterFunctionResult.addnodes2
    );

         





          let finalFilteredRows = filterFunctionResult.filteredRows;
          console.log("allnodes", allnodes);
          processCSV(allnodes);
        }
      },
      error: (error) => {
        console.error("Error reading CSV file:", error);
      },
    });
  };

  const handleLegendClick = (type, x, y) => {
    setSelectedLinkType(type);
    setColorPicker({ visible: true, x, y, type });
  };

  const handleColorSelect = (color) => {
    if (selectedLinkType in linkColors) {
      setLinkColors({
        ...linkColors,
        [selectedLinkType]: color,
      });
    } else {
      setNodeColors({
        ...nodeColors,
        [colorPicker.type]: color,
      });
    }
    setColorPicker({ visible: false, x: 0, y: 0, type: "" });
    setSelectedLinkType(""); // Reset selected link type
  };

  const handleNodeHover = (node) => {
    if (node) {
      const { x, y, z } = node;
      const canvas = fgRef.current.renderer().domElement;
      const vector = new THREE.Vector3(x, y, z).project(fgRef.current.camera());
      const tooltipX = (vector.x * 0.5 + 0.5) * canvas.width;
      const tooltipY = (-(vector.y * 0.5) + 0.5) * canvas.height;

      setTooltip({
        visible: true,
        x: tooltipX,
        y: tooltipY,
        content: `${node.id} (${node.group})`,
      });
    } else {
      setTooltip({ visible: false, x: 0, y: 0, content: "" });
    }
  };

  return (
    <>
      <div className="container1 ">
        <div className="row graph_legend">
          <div
            className="col-2 legend_main_box"
            style={{ zIndex: 999, marginTop: "55px", background: "black" }}>
            {renderLegend()}
            {colorPicker.visible && (
              <div
                style={{
                  position: "absolute",
                  top: colorPicker.y,
                  left: colorPicker.x,
                  backgroundColor: "black",
                  border: "1px solid white",
                  padding: "10px",
                  zIndex: 1000,
                }}>
                {predefinedColors.map((color) => (
                  <div
                    key={color}
                    style={{
                      backgroundColor: color,
                      width: "20px",
                      height: "20px",
                      margin: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
            )}
            {tooltip.visible && (
              <div
                className="tooltip1"
                style={{
                  position: "absolute",
                  top: tooltip.y,
                  left: tooltip.x,
                  backgroundColor: "white",
                  border: "1px solid black",
                  padding: "5px",
                  pointerEvents: "none",
                  zIndex: 1000,
                }}>
                {tooltip.content}
              </div>
            )}
          </div>

          <div className="col-8">
            <div className="graph-container">
              <ForceGraph3D
                ref={fgRef}
                nodeRelSize={8}
                graphData={graphData}
                nodeLabel={(node) => `${node.id}`}
                nodeAutoColorBy="group"
                backgroundColor="black"
                linkColor={getLinkColor}
                nodeColor={getNodeColor}
                linkWidth={3}
                enableZoomInteraction={true}
                nodeThreeObject={getNodeShape}
                onNodeHover={handleNodeHover}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForceGraph2DComponent;
