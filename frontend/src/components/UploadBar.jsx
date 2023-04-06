import React, {
  useState,
} from 'react';
import { IoCloudUpload } from 'react-icons/io5';
import axios from 'axios';

function UploadBar({ onUploadSuccess }) {
  const [fileList, setFileList] = useState(null);

  const handleFileChange = (e) => {
    setFileList(e.target.files);
  };

  const handleUploadClick = async () => {
    if (!fileList) {
      return;
    }

    const data = new FormData();
    [...fileList].forEach((file) => {
      data.append('files', file, file.name);
    });

    try {
      await axios.post('/api/upload', data);
      onUploadSuccess();
    } catch (error) {
      console.log(error);
    }
  };

  const files = fileList ? [...fileList] : [];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}
    >
      <label htmlFor="upload" className="custom-file-upload">
        <input
          id="upload"
          type="file"
          onChange={handleFileChange}
          multiple
          accept="audio/mpeg, audio/wav"
        />
        <IoCloudUpload size={24} color="gray" />
      </label>
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            {file.name}
          </li>
        ))}
      </ul>
      {
        fileList ? <button onClick={handleUploadClick} type="button">Upload</button> : null
      }

    </div>
  );
}

export default UploadBar;
