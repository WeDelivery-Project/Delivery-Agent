import { Helmet } from 'react-helmet-async';
// @mui
import { useEffect, useState } from 'react';
import { Grid, Container, Typography } from '@mui/material';
// sections
import { AppWidgetSummary } from '../sections/@dashboard/app';

import { Request } from '../api/config';
// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [envoi, setEnvoi] = useState([]);

  // const [envoiCount, setEnvoiCount] = useState();
  // const [envoisDeposeCount, setEnvoisDeposeCount] = useState();
  // const [envoisEnRouteCount, setEnvoisEnRouteCount] = useState();
  // const [envoisEnAttenteCount, setEnvoisEnAttenteCount] = useState();
  // const [envoisLivreCount, setEnvoisLivreCount] = useState();
  // const [envoisRetourCount, setEnvoisRetourCount] = useState();

  const getEnvois = async () => {
    try {
      const res = await Request.get('/envoi/by-livreur');
      setEnvoi(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEnvois();
  }, []);

  // useEffect(() => {
  //   Promise.all([getEnvois(), getEtats()])
  //     .then(([envoisRes, etatsRes]) => {
  //       const envois = envoisRes.data;
  //       const etats = etatsRes.data;

  //       const envoisDeposeCount = envois.filter((envoi) => {
  //         const lastEtat = envoi.etats[envoi.etats.length - 1];
  //         const etat = etats.find((e) => e._id === lastEtat.etat);
  //         return etat && etat.nom === 'Déposé';
  //       }).length;

  //       const envoisEnRouteCount = envois.filter((envoi) => {
  //         const lastEtat = envoi.etats[envoi.etats.length - 1];
  //         const etat = etats.find((e) => e._id === lastEtat.etat);
  //         return etat && etat.nom === 'En Route';
  //       }).length;

  //       const envoisEnAttenteCount = envois.filter((envoi) => {
  //         const lastEtat = envoi.etats[envoi.etats.length - 1];
  //         const etat = etats.find((e) => e._id === lastEtat.etat);
  //         return etat && etat.nom === 'En Attente';
  //       }).length;

  //       const envoisLivreCount = envois.filter((envoi) => {
  //         const lastEtat = envoi.etats[envoi.etats.length - 1];
  //         const etat = etats.find((e) => e._id === lastEtat.etat);
  //         return etat && etat.nom === 'Livrée';
  //       }).length;

  //       const envoisRetourCount = envois.filter((envoi) => {
  //         const lastEtat = envoi.etats[envoi.etats.length - 1];
  //         const etat = etats.find((e) => e._id === lastEtat.etat);
  //         return etat && etat.nom === 'Retour';
  //       }).length;

  //       setEnvoiCount(envois.length);

  //       setLoading(false);
  //     })
  //     .catch((err) => console.error(err));
  // }, []);

  // Define count of Envois for each Etat

  // const envoicount = envoi ? envoi.length : 0;
  // const adminCount = admin ? admin.length : 0;
  // const clientCount = client ? client.length : 0;
  // const livreurCount = livreur ? livreur.length : 0;
  // const userCount = adminCount + clientCount + livreurCount;
  // const ramassageCount = ramassage ? ramassage.length : 0;

  // code : func who return count of etat
  const etatCount = (code) => {
    const e = envoi.filter((e) => {
      let status =
        e.etats?.length > 0 &&
        e.etats.reduce((a, b) => {
          if (!b.date) return a;
          return a.date > b.date ? a : b;
        });

      if (e.etats.length > 0 && !status.date) status = e.etats.length > 0 && e.etats.find((e) => e.etat.code === 1);
      return status.etat.code === code;
    });
    return e.length || '0';
  };

  return (
    <>
      <Helmet>
        <title> Admin BackOffice </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back to your back office
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              color="warning"
              title="Total Shipments"
              total={envoi.length || '0'}
              icon={'streamline:shipping-box-1-box-package-label-delivery-shipment-shipping'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Nouvels Envois" total={etatCount(1)} icon={'mdi:package-delivered'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Envois Déposés" total={etatCount(2)} icon={'mdi:package-delivered'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Envois En Route" total={etatCount(3)} icon={'twemoji:delivery-truck'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Envois En Attente" total={etatCount(4)} icon={'material-symbols:pending'} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Envois Livrés"
              total={etatCount(5)}
              icon={'mdi:package-variant-closed-delivered'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Envois Retour" total={etatCount(6)} icon={'tabler:truck-return'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Envoi Annulé" total={etatCount(7)} icon={'tabler:truck-return'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Envoi Récuperé" total={etatCount(8)} icon={'tabler:truck-return'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Envoi Encaissé" total={etatCount(9)} icon={'tabler:truck-return'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Envoi Payé" total={etatCount(10)} icon={'tabler:truck-return'} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
