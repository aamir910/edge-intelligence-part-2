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
      // Fetch entity (node) files
      const entityResponse = await fetch('https://213.21.189.116/EDGE_INTELLIGENCE/get_nodes_edges_csv.php?type=entity-files');
      
      // Fetch link (edge) files
      const linkResponse = await fetch('https://213.21.189.116/EDGE_INTELLIGENCE/get_nodes_edges_csv.php?type=link-files');
      
      if (!entityResponse.ok || !linkResponse.ok) {
        throw new Error("Failed to fetch files from the backend");
      }
      
      const entityFiles = await entityResponse.json(); // Expecting an array of entity file paths
      const linkFiles = await linkResponse.json(); // Expecting an array of link file paths
  
      // Fetch and parse the CSV content
      const entityHeaderPromises = entityFiles.map((file) => loadCSV(file)); // Assuming loadCSV function exists
      const linkHeaderPromises = linkFiles.map((file) => loadCSV(file)); // Assuming loadCSV function exists
  
      const entityResults = await Promise.all(entityHeaderPromises);
      const linkResults = await Promise.all(linkHeaderPromises);
  
      const entityHeadersArray = entityResults.map((result) => result.header);
      const linkHeadersArray = linkResults.map((result) => result.header);
      const entityDataArray = entityResults.map((result) => result.data);
  
      // Organize headers by file name
      const newEntityHeaders = {};
      entityFiles.forEach((file, index) => {
        newEntityHeaders[file] = entityHeadersArray[index];
      });
  
      const newLinkHeaders = {};
      linkFiles.forEach((file, index) => {
        newLinkHeaders[file] = linkHeadersArray[index];
      });
  
      // Set the state with new headers and data
      setEntityHeaders(newEntityHeaders);
      setLinkHeaders(newLinkHeaders);
      setEnitityData(entityDataArray);
  
    } catch (error) {
      console.error("Error loading CSV files:", error);
    }
  };
  

  loadAllCSVs();
}, []);






// part 2 

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
      // Fetch entity (node) files
      const entityResponse = await fetch('https://213.21.189.116/EDGE_INTELLIGENCE/get_nodes_edges_csv.php?type=entity-files');
      
      // Fetch link (edge) files
      const linkResponse = await fetch('https://213.21.189.116/EDGE_INTELLIGENCE/get_nodes_edges_csv.php?type=link-files');
      
      if (!entityResponse.ok || !linkResponse.ok) {
        throw new Error("Failed to fetch files from the backend");
      }
      const entityBody = await entityResponse.text(); // Read the body as text
      const linkBody = await linkResponse.text(); // Read the body as text
      
      // Parse the responses as JSON
      const entityFiles = JSON.parse(entityBody);
      const linkFiles = JSON.parse(linkBody);
      
          console.log("Entity response body:", entityFiles);
          console.log("Link response body:", linkFiles);

      // console.log(entityResponse ,linkResponse , "entityResponse")
      // const entityFiles = await entityResponse.json(); // Expecting an array of entity file paths
      // const linkFiles = await linkResponse.json(); // Expecting an array of link file paths
  
      // Fetch and parse the CSV content
      // const entityHeaderPromises = entityFiles.map((file) => loadCSV(file)); // Assuming loadCSV function exists
      // const linkHeaderPromises = linkFiles.map((file) => loadCSV(file)); // Assuming loadCSV function exists
  
      // const entityResults = await Promise.all(entityHeaderPromises);
      // const linkResults = await Promise.all(linkHeaderPromises);
  // console.log(entityResults ,linkResults ,"linkResults" )

      const entityHeadersArray = entityFiles.map((result) => result.file_name);
      const linkHeadersArray = linkFiles.map((result) => result.file_name);
      const entityDataArray = entityFiles.map((result) => result.data);
  console.log(entityHeadersArray ,linkHeadersArray , entityDataArray ,"entityDataArray" )
      // Organize headers by file name
      // const newEntityHeaders = {};
      // entityFiles.forEach((file, index) => {
      //   newEntityHeaders[file] = entityHeadersArray[index];
      // });
  
      // const newLinkHeaders = {};
      // linkFiles.forEach((file, index) => {
      //   newLinkHeaders[file] = linkHeadersArray[index];
      // });
  
      // Set the state with new headers and data
      setEntityHeaders(entityHeadersArray);
      setLinkHeaders(linkHeadersArray);
      setEnitityData(entityDataArray);
      
  
    } catch (error) {
      console.error("Error loading CSV files:", error);
    }
  };
  

  loadAllCSVs();
}, []);