import { useEffect, useState } from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Modal,
  Box,
  TextField,
} from "@mui/material";

import axios from "axios";

interface BlockChain {
  id: string;
  username: string;
  secretKeyId: string;
  previous_hash: string;
  nonce: string;
  tag: string;
  current_hash: string;
  private_key: string;
  userId: string;
  created_at: string;
}
interface UserLogs {
  userId: string;
  geoData:string;
  deviceInfo:string;
  created_at:string

}
const BlockChainData = () => {
  const [blockchainData, setBlockchainData] = useState<BlockChain[]>([]);
  const [UserLogsData, setUserLogsData] = useState<UserLogs[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedBlock, setSelectedBlock] = useState<BlockChain | null>(null);
  const [file, setFile] = useState<File | null>(null);
  
  const [otp, setOtp] = useState<string>("");
  const [openModalWithOtp, setOpenModalWithOtp] = useState<boolean>(false);
  const [openModalWithoutOtp, setOpenModalWithoutOtp] = useState<boolean>(false);
  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(event.target.value);
  };
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");




  useEffect(() => {
    if (!userInfo?.id) {
      setError("User ID not found.");
      setLoading(false);
      
      return;
    }
  
    const fetchBlockchainData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/getBlocks/?user_id=${userInfo.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Network response was not ok: ${response.status} - ${errorText}`);
          throw new Error(`Error: ${response.status} - ${errorText}`);
        }
  
        const data = await response.json();
        setBlockchainData(data.blockchain_data || []);
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
        setBlockchainData([]);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchUserLogsData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/getUserData/?user_id=${userInfo.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Network response was not ok: ${response.status} - ${errorText}`);
          throw new Error(`Error: ${response.status} - ${errorText}`);
        }
  
        const data = await response.json();
        setUserLogsData(data.blockchain_data || []);
        
        // Log user logs to console
        console.log("User Logs Data:", data.blockchain_data);
      } catch (error) {
        console.error("Error fetching user logs data:", error);
        setUserLogsData([]);
      }
    };
  
    fetchBlockchainData();
    fetchUserLogsData();
  }, [userInfo.id]);
  
  const handleRetrieveFileClick = (block: BlockChain) => {
    setSelectedBlock(block);
    const currentTime = new Date().toISOString();

    // Get device info
    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    };
  
    // Get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const geoData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
  
          // Compare with stored logs using Gemini AI
          const response = await checkWithGemini(geoData, deviceInfo, currentTime, UserLogsData);
          if (Array.isArray(response) && response.length > 0) {
            const { modality, tokenCount } = response[0];
            
            // Example condition to open modal (modify as per requirement)
            if (modality === "TEXT" && tokenCount > 0) {
             
            }
          }
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
   
  };
  const checkWithGemini = async (geoData: any, deviceInfo: any, currentTime: string, userLogsData: any) => {
    console.log(userLogsData)
    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC7XGmYHpvN43nx3vg6gR2EPnRrvG8qxYo",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Analyze the following user login context and determine if the login matches previous logs.
                                    If there is a mismatch, explain the reason (e.g., different device, location, or time).
                                    
                                    **Current Context**: 
                                    - Location: ${JSON.stringify(geoData)}
                                    - Device: ${JSON.stringify(deviceInfo)}
                                    - Timestamp: ${currentTime}

                                    **Previous User Logs**:
                                    ${JSON.stringify(userLogsData)}
                                    
                                    Respond with a JSON object: 
                                    {
                                      "matchFound": true/false,
                                      "reason": "Mismatch due to device/location/time"
                                    }
                                    `,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        const result = await response.json();
        console.log("Gemini API Response:", result);
      
        const matchFound = result?.candidates?.[0]?.content?.parts?.[0]?.text?.includes("true");
        const reason = result?.candidates?.[0]?.content?.parts?.[0]?.text || "Unknown reason";
        console.log(reason);
        if (matchFound) {
          setOpenModalWithoutOtp(true);
          setOpenModalWithOtp(false);
      } else {
        const response = await fetch(
          `http://127.0.0.1:8000/send_otp/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {  
            setOpenModal(true);
        } else {
            console.warn("OTP sending failed. Response:", response);
        }
          setOpenModalWithOtp(true);
          setOpenModalWithoutOtp(false);
          console.warn("⚠️ User context mismatch detected!");
          console.warn(`Reason: ${reason}`);
      }
      
    } catch (error) {
        console.error("❌ Error calling Gemini API:", error);
    }
};

  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  const handleCheckAuthorized = async () => {
    if (!file || !selectedBlock) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file", file);
    formData.append("otp", otp);
    formData.append("user_id", userInfo.id);
    formData.append("selectedBlockId", selectedBlock.id);

    try {
      const response = await fetch("http://127.0.0.1:8000/reterivalCheck/", {
        method: "POST",
        body: formData,
      });
    
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Network response was not ok: ${response.status} - ${errorText}`);
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }
    
      
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("text/csv")) {
        // Handle file download
        response.blob().then((blob) => {
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.setAttribute('download', 'decrypted_data.csv');
          document.body.appendChild(link);
          link.click();
          link.remove();
        }).catch(error => console.error('Error downloading the CSV:', error));
      } else {
        // Handle JSON response for unauthorized user or other messages
        const data = await response.json();
        console.log(data.message);
        alert(data.message);
      }
    
    } catch (error) {
      console.error("Error uploading fingerprint:", error);
      alert("There was an error uploading the file. Please try again.");
    } finally {
      setOpenModal(false); // Close modal after authorization check
      setFile(null); // Reset file input
    }
  };

  const handleCheckAuthorizedWithoutOTP = async () => {
    if (!file || !selectedBlock) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file", file);

    formData.append("user_id", userInfo.id);
    formData.append("selectedBlockId", selectedBlock.id);

    try {
      const response = await fetch("http://127.0.0.1:8000/reterivalCheckwithoutOTP/", {
        method: "POST",
        body: formData,
      });
    
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Network response was not ok: ${response.status} - ${errorText}`);
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }
    
      
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("text/csv")) {
        // Handle file download
        response.blob().then((blob) => {
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.setAttribute('download', 'decrypted_data.csv');
          document.body.appendChild(link);
          link.click();
          link.remove();
        }).catch(error => console.error('Error downloading the CSV:', error));
      } else {
        // Handle JSON response for unauthorized user or other messages
        const data = await response.json();
        console.log(data.message);
        alert(data.message);
      }
    
    } catch (error) {
      console.error("Error uploading fingerprint:", error);
      alert("There was an error uploading the file. Please try again.");
    } finally {
      setOpenModal(false); // Close modal after authorization check
      setFile(null); // Reset file input
    }
  };
  return (
    <Card sx={{ marginTop: "50px", padding: "20px" }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : blockchainData.length === 0 ? (
        <Typography variant="h6">No Files are uploaded</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="blockchain data table">
            <TableHead>
              <TableRow>
             
                <TableCell align="right">Block Id</TableCell>
                <TableCell align="right">Previous Hash</TableCell>
                <TableCell align="right">Current Hash</TableCell>
                <TableCell align="right">Created At</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blockchainData.map((block) => (
                <TableRow key={block.id}>
                 
                  <TableCell align="right">{block.secretKeyId}</TableCell>
                  <TableCell align="right">{block.previous_hash}</TableCell>
                  <TableCell align="right">{block.current_hash}</TableCell>
                  <TableCell align="right">
                    {new Date(block.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleRetrieveFileClick(block)}
                    >
                      Retrieve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

{/* Modal for Upload (Without OTP) */}
<Modal open={openModalWithoutOtp} onClose={() => setOpenModalWithoutOtp(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
    }}
  >
    <Typography variant="h6" gutterBottom>
      Kindly upload your fingerprint
    </Typography>
    <TextField
      fullWidth
      type="file"
      onChange={handleFileChange}
      sx={{ mb: 2 }}
    />
    <Button
      fullWidth
      variant="contained"
      color="primary"
      onClick={handleCheckAuthorizedWithoutOTP}
      disabled={!file}
    >
      Check Authorized
    </Button>
  </Box>
</Modal>

{/* Modal for Upload (With OTP) */}
<Modal open={openModalWithOtp} onClose={() => setOpenModalWithOtp(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
    }}
  >
    <Typography variant="h6" gutterBottom>
      Kindly upload your fingerprint
    </Typography>
    <TextField
      fullWidth
      type="file"
      onChange={handleFileChange}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Enter OTP"
      variant="outlined"
      fullWidth
      value={otp}
      onChange={handleOtpChange}
      sx={{ marginTop: 2 }}
    />
    <Button
      fullWidth
      variant="contained"
      color="primary"
      onClick={handleCheckAuthorized}
      disabled={!file || !otp}
    >
      Check Authorized
    </Button>
  </Box>
</Modal>

    </Card>
  );
};

export default BlockChainData;
