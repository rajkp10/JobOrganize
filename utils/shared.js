var fieldCount = 0;
var directoryData = {
  directory: "",
  type: "",
};

const incrementFieldCount = () => fieldCount++;
const setDirectoryData = (newDirectoryData) =>
  (directoryData = {
    ...directoryData,
    directory: newDirectoryData.directory,
    type: newDirectoryData.type,
  });

export { fieldCount, incrementFieldCount, directoryData, setDirectoryData };
