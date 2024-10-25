import React, { useEffect, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import Papa from "papaparse";
import { Card, Popover } from "antd";
import { ChromePicker } from "react-color";
import * as THREE from "three";

const Force3D = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [legendData, setLegendData] = useState({ nodes: [], links: [] });
  const [colors, setColors] = useState({});
  const shapes = ["circle", "square", "triangle", "star", "diamond"];
  const initialColors = ["#1e90ff", "#32cd32", "#ff69b4", "#ff8c00", "#8a2be2"];

  useEffect(() => {
    Papa.parse(
      "https://entertainmentbuz.com//EDGE_INTELLIGENCE/Get_merge_file.php",
      {
        download: true,
        header: true,
        complete: (result) => {
          const data = result.data.slice(5500, 6000);

          const nodes = [];
          const links = [];
          const uniqueEntityTypes = new Set();
          const uniqueEdgeTypes = new Set();

          data.forEach((item) => {
            nodes.push({ id: item.Entity_1, group: item.Entity_Type_1 });
            nodes.push({ id: item.Entity_2, group: item.Entity_Type_2 });
            links.push({
              source: item.Entity_1,
              target: item.Entity_2,
              type: item.Edge_Type,
            });
            uniqueEntityTypes.add(item.Entity_Type_1);
            uniqueEntityTypes.add(item.Entity_Type_2);
            uniqueEdgeTypes.add(item.Edge_Type);
          });

          const uniqueNodes = Array.from(
            new Map(nodes.map((node) => [node.id, node])).values()
          );
          setGraphData({ nodes: uniqueNodes, links });
          setLegendData({
            nodes: Array.from(uniqueEntityTypes),
            links: Array.from(uniqueEdgeTypes),
          });

          // Initialize colors based on unique entity types
          const initialColorMap = {};
          Array.from(uniqueEntityTypes).forEach(
            (group, idx) => (initialColorMap[group] = initialColors[idx % initialColors.length])
          );
          Array.from(uniqueEdgeTypes).forEach(
            (type, idx) => (initialColorMap[type] = "#888888") // Default gray for links
          );
          setColors(initialColorMap);
        },
        error: (error) => {
          console.error("Error reading CSV file:", error);
        },
      }
    );
  }, []);

  const getShapeForNode = (group) => {
    const index = legendData.nodes.indexOf(group) % shapes.length;
    return shapes[index];
  };

  const handleColorChange = (groupOrType, color) => {
    setColors((prevColors) => ({ ...prevColors, [groupOrType]: color.hex }));
  };

  const renderLegend = () => (
    <div>
      <p><strong>Node Types:</strong></p>
      {legendData.nodes.map((group, idx) => (
        <Popover
          key={idx}
          content={
            <ChromePicker
              color={colors[group]}
              onChange={(color) => handleColorChange(group, color)}
            />
          }
          trigger="click"
        >
          <p style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <span
              style={{
                width: 12,
                height: 12,
                display: "inline-block",
                backgroundColor: colors[group],
                marginRight: 8,
                shapeOutside: getShapeForNode(group),
              }}
            />
            {group}: {getShapeForNode(group)}
          </p>
        </Popover>
      ))}
      <p><strong>Link Types:</strong></p>
      {legendData.links.map((type, idx) => (
        <Popover
          key={idx}
          content={
            <ChromePicker
              color={colors[type]}
              onChange={(color) => handleColorChange(type, color)}
            />
          }
          trigger="click"
        >
          <p style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <span
              style={{
                width: "100%",
                height: 2,
                display: "inline-block",
                backgroundColor: colors[type],
                marginRight: 8,
              }}
            />
            {type}
          </p>
        </Popover>
      ))}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#1a1a1a",
        color: "#f0f0f0",
        padding: 20,
        minHeight: "100vh",
      }}
    >
      <Card
        title="Legend"
        style={{
          width: "15vw",
          marginBottom: 20,
          backgroundColor: "black",
          color: "#f0f0f0",
        }}
      >
        {renderLegend()}
      </Card>

      <Card
        title="3D Force Network Graph"
        style={{
          width: "80vw",
          height: "90vh",
          backgroundColor: "black",
          color: "#f0f0f0",
        }}
      >
        <div style={{ width: "100%", height: "75vh", overflow: "hidden" }}>
          <ForceGraph3D
            graphData={graphData}
            backgroundColor="#000000"
            nodeAutoColorBy="group"
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.005}
            nodeLabel={(node) => `${node.id} (${node.group})`}
            linkLabel={(link) => link.type}
            linkWidth={1.5}
            linkColor={(link) => colors[link.type] || "#888888"}
            nodeThreeObject={(node) => {
              const color = colors[node.group] || "#1e90ff";
              const shape = getShapeForNode(node.group);
              let object;

              switch (shape) {
                case "circle":
                  object = new THREE.Mesh(
                    new THREE.SphereGeometry(5),
                    new THREE.MeshBasicMaterial({ color })
                  );
                  break;
                case "square":
                  object = new THREE.Mesh(
                    new THREE.BoxGeometry(6, 6, 6),
                    new THREE.MeshBasicMaterial({ color })
                  );
                  break;
                case "triangle":
                  const triangleShape = new THREE.Shape();
                  triangleShape.moveTo(0, -5);
                  triangleShape.lineTo(5, 5);
                  triangleShape.lineTo(-5, 5);
                  triangleShape.lineTo(0, -5);
                  const triangleGeometry = new THREE.ShapeGeometry(triangleShape);
                  object = new THREE.Mesh(
                    triangleGeometry,
                    new THREE.MeshBasicMaterial({ color })
                  );
                  break;
                case "star":
                  object = new THREE.Mesh(
                    new THREE.DodecahedronGeometry(5),
                    new THREE.MeshBasicMaterial({ color })
                  );
                  break;
                case "diamond":
                  object = new THREE.Mesh(
                    new THREE.OctahedronGeometry(5),
                    new THREE.MeshBasicMaterial({ color })
                  );
                  break;
                default:
                  object = new THREE.Mesh(
                    new THREE.SphereGeometry(5),
                    new THREE.MeshBasicMaterial({ color })
                  );
              }
              return object;
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default Force3D;
