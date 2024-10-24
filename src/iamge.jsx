import React, { useRef, useEffect, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
import Papa from "papaparse";
import * as THREE from "three";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./NavBar/NavBar";
const predefinedColors = ["white", "lightblue", "orange", "cyan", "lime", "black"];

import { useLocation } from 'react-router-dom';
const customerImage = "customer.png"; // Replace with the actual path to the customer image

const ForceGraph2DComponent = () => {

  const location = useLocation();
  
console.log(location.state ,"location.state")

  // Check if location.state exists before accessing its properties
  const checkedEntityNames = location.state?.checkedEntityNames || [];
  const checkedLinkNames = location.state?.checkedLinkNames || [];
console.log(checkedEntityNames ,checkedLinkNames , '3d force graph' )

  const fgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
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
  //   Customer: "white",
  //   "Part number": "lightblue",
  //   "Purchase order": "orange",
  //   "Sell order": "cyan",
  //   Supply: "lime",
  // });
  // const [linkColors, setLinkColors] = useState({
  //   "E BOM": "white",
  //   "E Order customer": "lightblue",
  //   "E part number supply order": "orange",
  //   "E part number sell order": "cyan",
  //   "E order supply": "lime",
  // });
  const [nodeColors, setNodeColors] = useState({});
  const [linkColors, setLinkColors] = useState({});
  const [nodeShapes, setNodeShapes] = useState({});

  const generateColor = (index) => {
    const colors = ["white", "lightblue", "orange", "cyan", "lime"];
    return colors[index % colors.length];
  };

  const generateShape = (index, color) => {
    const shapes = [
      new THREE.SphereGeometry(5),
      new THREE.ConeGeometry(5, 20, 3),
      new THREE.BoxGeometry(10, 10, 10),
      new THREE.BoxGeometry(10, 5, 5),
      new THREE.CylinderGeometry(5, 5, 5, 40),
    ];
    const geometry = shapes[index % shapes.length];
    return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color }));
  };


  const [selectedLinkType, setSelectedLinkType] = useState("");
  const [excludedTypes, setExcludedTypes] = useState([]);
  const processCSV = (data) => {
    const nodesMap = {};
    
    console.log("excludedTypes" ,excludedTypes)
    const links = data.slice(0, 300).map((row) => {
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

    console.log(links, "here is the links");
  };

  useEffect(() => {
    Papa.parse("/Edges_And_Nodes _new.csv", {
      download: true,
      header: true,
      complete: (result) => {
        
        
        console.log(result.data ,excludedTypes ,  'result.data')


        const entityTypes1 = new Set();
        const edgeTypes = new Set();

        result.data.forEach((row) => {
          entityTypes1.add(row.Entity_Type_1);
          edgeTypes.add(row.Edge_Type);
        });

        const newNodeColors = {};
        const newNodeShapes = {};
        Array.from(entityTypes1).forEach((type, index) => {
          const color = generateColor(index);
          newNodeColors[type] = color;
          newNodeShapes[type] = generateShape(index, color);
        });

        const newLinkColors = {};
        Array.from(edgeTypes).forEach((type, index) => {
          newLinkColors[type] = generateColor(index);
        });

        setNodeColors(newNodeColors);
        setNodeShapes(newNodeShapes);
        setLinkColors(newLinkColors);


        const filteredData = result.data.filter(
          (row) =>
            checkedEntityNames.includes(row.Entity_Type_1) &&  
            checkedEntityNames.includes(row.Entity_Type_2) &&
            checkedEntityNames.includes(row.Edge_Type)
        );
        processCSV(filteredData);
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
  }, [graphData]);

  const getNodeColor = (node) => nodeColors[node.group] || nodeColors.default;

  const getLinkColor = (link) => linkColors[link.type] || linkColors.default;

  // const getNodeShape = (node) => {
  //   const color = getNodeColor(node);

  //   switch (node.group) {
  //     case "Customer":
  //       return new THREE.Mesh(
  //         new THREE.SphereGeometry(5),
  //         new THREE.MeshBasicMaterial({ color })
  //       );
  //     case "Part number":
  //       return new THREE.Mesh(
  //         new THREE.ConeGeometry(5, 20, 3),
  //         new THREE.MeshBasicMaterial({ color })
  //       );
  //     case "Purchase order":
  //       return new THREE.Mesh(
  //         new THREE.BoxGeometry(10, 10, 10),
  //         new THREE.MeshBasicMaterial({ color })
  //       );
  //     case "Sell order":
  //       return new THREE.Mesh(
  //         new THREE.BoxGeometry(10, 5, 5),
  //         new THREE.MeshBasicMaterial({ color })
  //       );
  //     case "Supply":
  //       return new THREE.Mesh(
  //         new THREE.CylinderGeometry(5, 5, 5, 40),
  //         new THREE.MeshBasicMaterial({ color })
  //       );
  //     default:
  //       return new THREE.Mesh(
  //         new THREE.SphereGeometry(5),
  //         new THREE.MeshBasicMaterial({ color })
  //       );
  //   }
  // };

  const getNodeShape = (node) => {
    const shape = nodeShapes[node.group];
    return shape ? shape : new THREE.Mesh(
      new THREE.SphereGeometry(5),
      new THREE.MeshBasicMaterial({ color: nodeColors[node.group] || "defaultNodeColor" })
    );
  };

  const renderLegend = () => (
    <>
   
   <Navbar image = "edge_white_text.png" color="black"/>
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
        {Object.keys(nodeColors).map((type) => (
  checkedEntityNames.includes(type) && (
    <li key={type}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          className="checkbox1"
          type="checkbox"
          checked={!excludedTypes.includes(type) && checkedEntityNames.includes(type)}
          onChange={() => handleCheckboxChange(type)}
        />
        <svg
          width="20"
          height="20"
          onClick={(e) => handleLegendClick(type, e.clientX, e.clientY)}
        >
          {getNodeShape({ group: type }).geometry.type === "SphereGeometry" && (
            <circle cx="10" cy="10" r="8" fill={nodeColors[type]} />
          )}
          {getNodeShape({ group: type }).geometry.type === "ConeGeometry" && (
            <polygon points="5,0 15,20 5,20" fill={nodeColors[type]} />
          )}
          {getNodeShape({ group: type }).geometry.type === "BoxGeometry" && (
            <rect x="5" y="5" width="10" height="10" fill={nodeColors[type]} />
          )}
          {getNodeShape({ group: type }).geometry.type === "CylinderGeometry" && (
            <rect x="5" y="5" width="20" height="10" fill={nodeColors[type]} />
          )}
        </svg>
        <span>{type}</span>
      </div>
    </li>
  )
))}
        <h4>Links</h4>
        {Object.keys(linkColors).map((type) => (
  checkedEntityNames.includes(type) && (
    <li key={type}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          className="checkbox1"
          type="checkbox"
          checked={!excludedTypes.includes(type) && checkedEntityNames.includes(type)}
          onChange={() => handleCheckboxChange(type)}
        />
        <svg
          width="20"
          height="20"
          onClick={(e) => handleLegendClick(type, e.clientX, e.clientY)}
        >
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
))}
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
    Papa.parse("/Edges_And_Nodes _new.csv", {
      download: true,
      header: true,
      complete: (result) => {


        let filteredData = result.data.filter(
          (row) =>
            checkedEntityNames.includes(row.Entity_Type_1) &&  
            checkedEntityNames.includes(row.Entity_Type_2) &&
            checkedEntityNames.includes(row.Edge_Type)
        );

        


        const filteredData2 = filteredData.filter(
          (row) =>
            !excludedTypes.includes(row.Entity_Type_1) &&
            !excludedTypes.includes(row.Entity_Type_2) &&
            !excludedTypes.includes(row.Edge_Type)
        );
        processCSV(filteredData2);
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
      <div className="col-2 legend_main_box" style={{zIndex: 999, marginTop: '55px' , background:'black'}} >
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
