import { Button, Container, FormControl, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Request } from '../api/config';

export default function UpdateRole() {
  const [livreur, setLivreur] = useState({ firstname: '', lastname: '', phonenumber: '' });
  const idLivreur = localStorage.getItem('livreur') ? JSON.parse(localStorage.getItem('livreur'))._id : null;
  const navigate = useNavigate();
  useEffect(() => {
    if (!idLivreur) {
      alert('Erreur innatendu!');
    } else {
      Request(`/livreur/find/${idLivreur}`)
        .then((res) => setLivreur(res.data))
        .catch(() => alert('Erreur innatendu!'));
    }
  }, [idLivreur]);

  const handleSubmit = async () => {
    try {
      await Request.put(`/livreur/${idLivreur}`, {
        firstname: livreur.firstname,
        lastname: livreur.lastname,
        phonenumber: livreur.phonenumber,
      });
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container sx={{ width: '60%' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Update Profile
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <TextField
              label="Firstname"
              variant="outlined"
              value={livreur?.firstname}
              onChange={(event) => {
                setLivreur({ ...livreur, firstname: event.target.value });
              }}
              name="firstname"
              type="text"
              fullWidth
              required
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <TextField
              label="Lastname"
              variant="outlined"
              value={livreur?.lastname}
              onChange={(event) => {
                setLivreur({ ...livreur, lastname: event.target.value });
              }}
              name="lastname"
              type="text"
              fullWidth
              required
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <TextField
              label="Phone Number"
              variant="outlined"
              value={livreur?.phonenumber}
              onChange={(event) => {
                setLivreur({ ...livreur, phonenumber: event.target.value });
              }}
              name="phonenumber"
              type="text"
              fullWidth
              required
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            size="large"
            fullWidth
            onClick={() => {
              handleSubmit();
            }}
            style={{ marginTop: 16 }}
          >
            Update Profile
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
