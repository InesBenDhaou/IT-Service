import axios from "axios";

const baseUrl = 'https://helpdesk.anyinit.com/api';
//const baseUrl = "http://localhost:3000/api";

export const post = async (url, data, config) => {
  const result = await axios.post(baseUrl + url, data, config);
  return result.data;
};

export const postLogout = async (url, data, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(baseUrl + url, data, config);
    return response.status;
  } catch (error) {
    throw error;
  }
};

export const postData = async (url, data, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(baseUrl + url, data, config);
    return response.status;
  } catch (error) {
    throw error;
  }
};

export const postComponent = async (url,data, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    const response = await axios.post(baseUrl + url, data, config);
    return response.status;
  } catch (error) {
    throw error;
  }
};

export const postFormData = async (url, data, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' // This is important for FormData
      },
    };

    const response = await axios.post(baseUrl + url, data, config);
    return response.status;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (url, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(baseUrl + url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserImg = async (url, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "arraybuffer",
    };
    const response = await axios.get(baseUrl + url, config);
    const blob = new Blob([response.data], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
  } catch (error) {
    throw error;
  }
};

export const getComponentImg = async (url, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "arraybuffer",
    };
    const response = await axios.get(baseUrl + url, config);
    const blob = new Blob([response.data], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
  } catch (error) {
    throw error;
  }
};

export const getImg = async (url, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'arraybuffer', // Use arraybuffer to handle binary data
    };
    
    const response = await axios.get(baseUrl + url, config);

    // Determine the MIME type from the response headers
    const contentType = response.headers['content-type'] || 'image/jpeg'; // Default to 'image/jpeg' if not specified

    return URL.createObjectURL(
      new Blob([response.data], { type: contentType })
    );
  } catch (error) {
    throw error;
  }
};

export const get = async (url, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const result = await axios.get(baseUrl + url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getOne = async (url, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const result = await axios.get(baseUrl + url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getConnectedUser = async (url, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const result = await axios.get(baseUrl + url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getUserEmail = async (url, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const result = await axios.get(baseUrl + url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getEmailsByDepart = async (url, department, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        department: department,
      },
    };
    const result = await axios.get(baseUrl + url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getOriginalNames = async (uniqueNames, token) => {
  try {
    const queryParams = uniqueNames.join(',');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        uniqueNames: queryParams,
      },
    };
    const result = await axios.get(`${baseUrl}/files/filesnames`, config);
    return result.data;
  } catch (error) {
    console.error('Error fetching original names:', error);
    throw error; 
  }
};

export const downloadFile = async (originalfilename,resturl, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', 
    };

    const response = await axios.get(baseUrl + resturl, config);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = originalfilename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

export const consultFile = async (resturl, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // Fetch the file as a blob
    };

    const response = await axios.get(baseUrl + resturl, config);

    // Create a URL for the blob and open it in a new tab
    const url = window.URL.createObjectURL(response.data);
    window.open(url, '_blank');
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error consulting file:', error);
    throw error;
  }
};



export const del = async (url, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const result = await axios.delete(baseUrl + url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const update = async (url, data, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const result = await axios.put(baseUrl + url, data, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const updateFormData = async (url, data, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' 
      },
    };

    const response = await axios.put(baseUrl + url, data, config);
    return response.status;
  } catch (error) {
    throw error;
  }
};

export const uploadProfileImg = async (url, formData, token) => {
  const response = await axios.post(baseUrl + url, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProfileImg = async (url, data, token) => {
  const response = await axios.put(baseUrl + url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const patch = async (url, data, token) => {
  const response = await axios.patch(baseUrl + url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};