import { Button, Card, Grid } from "@mui/material";
import { useEffect, useState } from "react";
interface User {
    id: string;
    username: string;
    contact: string;
    email: string;
  }
  
const FingerPrintPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
        setUser(JSON.parse(userInfo)); 
      }
    }, []);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFile(e.target.files[0]); // Set the selected file to state
      }
    };
    const handleSubmit = async () => {
        // Ensure the file and user ID are present
        if (!file) {
          alert('Please select a file first!');
          return;
        }
      
        const userId = user?.id; // Get user ID from the state
        if (!userId) {
          alert('User ID is not available!');
          return;
        }
      
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', userId);
      
        try {
          const response = await fetch('http://127.0.0.1:8000/uploadFingerprint/', {
            method: 'POST',
            body: formData,
          });
          console.log(response)
         
     
          alert("fingerprint stored successfully."); // Show success message
          
        } catch (error) {
          console.error('Error:', error);
        }
      };
    return (
        <>
          <Card sx={{ marginTop: '50px' }}>
            <Grid container spacing={3} sx={{ mb: 5.5 }}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', margin: '25px' }}>
                <input
                  type="file"
                  accept=".bmp" // Restrict file types to Excel
                  onChange={handleFileChange} // Handle file selection
                />
              </Grid>
              <Grid item xs={4} sx={{ margin: '25px 325px' }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit} // Call handleSubmit on button click
                >
                  Upload Fingerprint
                </Button>
              </Grid>
            </Grid>
          </Card>
          
         
        </>
      );
}

export default FingerPrintPage;