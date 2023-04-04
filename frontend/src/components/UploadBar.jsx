import React, {
  useState,
} from 'react';

function UploadBar({ onUploadSuccess }) {
  const [fileList, setFileList] = useState(null);

  const handleFileChange = (e) => {
    setFileList(e.target.files);
  };

  const handleUploadClick = () => {
    if (!fileList) {
      return;
    }

    const data = new FormData();
    [...fileList].forEach((file) => {
      data.append('files', file, file.name);
    });

    fetch('/upload_files', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then(() => {
        onUploadSuccess();
      })
      .catch((err) => console.error(err));
  };

  const files = fileList ? [...fileList] : [];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderStyle: 'solid',
    }}
    >
      <input type="file" onChange={handleFileChange} multiple accept="audio/mpeg" />

      <ul>
        {files.map((file) => (
          <li key={file.name}>
            {file.name}
            {' '}
            -
            {' '}
            {file.type}
          </li>
        ))}
      </ul>

      <button onClick={handleUploadClick} type="button">Upload</button>
    </div>
  );
}

export default UploadBar;
