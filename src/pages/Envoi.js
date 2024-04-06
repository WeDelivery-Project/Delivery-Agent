import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  IconButton,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// import USERLIST from '../_mock/user';
import { Request } from '../api/config';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'client', label: 'Client', alignRight: false },
  { id: 'nom', label: 'nom', alignRight: false },
  { id: 'wilaya', label: 'Wilaya', alignRight: false },
  { id: 'commune', label: 'Commune', alignRight: false },
  { id: 'adresse', label: 'Adresse', alignRight: false },
  { id: 'infos', label: 'Infos', alignRight: false },
  { id: 'produit', label: 'Produit', alignRight: false },
  { id: 'quantite', label: 'Quantité', alignRight: false },
  { id: 'prix', label: 'Prix', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
  // { id: 'action', label: 'Action', alignRight: false },
];

const LABEL_COLOR = {
  1: 'primary', // Nouvel Envoi
  2: 'primary', // Envoi Déposé
  3: 'secondary', // Envoi En Route
  4: 'secondary', // Envoi En Attente
  5: 'success', // Envoi Livré
  6: 'warning', // Envoi Retour
  7: 'error', // Envoi Annulé
  8: 'warning', // Envoi Récupéré
  9: 'success', // Envoi Encaissé
  10: 'success', // Envoi Payé
};

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query, { etat, wilaya }) {
  let stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  stabilizedThis = stabilizedThis.map((el) => el[0]);

  if (query) {
    return filter(array, (envoi) =>
      Object.values(envoi).some((value) => String(value).toLowerCase().indexOf(String(query).toLowerCase()) !== -1)
    );
  }

  // Filter
  // ------
  // ------
  // ------

  if (etat) {
    stabilizedThis = stabilizedThis.filter((e) => {
      let status =
        e.etats.length > 0 &&
        e.etats.reduce((a, b) => {
          if (!b.date) return a;
          return a.date > b.date ? a : b;
        });
      if (e.etats.length > 0 && !status.date) status = e.etats.length > 0 && e.etats.find((e) => e.etat.code === 1);
      return etat === status.etat._id;
    });
  }

  if (wilaya) {
    stabilizedThis = stabilizedThis.filter((e) => wilaya === e.wilaya._id);
  }

  // Return ----
  return stabilizedThis;
}

const getEtats = async () => {
  const res = await Request.get('/etat');
  return res.data;
};
const getWilayas = async () => {
  const res = await Request.get('/wilaya');
  return res.data;
};

export default function Ramassage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  // modal edit etat
  const [openEditEtat, setOpenEditEtat] = useState(false);
  const [selectedValueEditEtat, setSelectedValueEditEtat] = useState('');
  const handleClickOpen = () => {
    setOpenEditEtat(true);
  };
  const handleClose = (value) => {
    setOpenEditEtat(false);
    setSelectedValueEditEtat(value);
    console.log(value);
  };

  const [envoi, setEnvoi] = useState([]);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = envoi.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // Filtrage etat / Wilaya
  const [wilayas, setWilayas] = useState([]);
  const [etatsList, setEtatList] = useState([]);
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const [filters, setFilters] = useState({ etat: '', wilaya: '' });

  const handleCloseModalModalFilter = () => {
    setOpenModalFilter(false);
  };

  const handleOpenModalFilter = async () => {
    setOpenModalFilter(true);
    try {
      if (!etatsList?.length > 0) {
        const e = await getEtats();
        setEtatList(e);
      }

      if (!wilayas?.length > 0) {
        const w = await getWilayas();
        setWilayas(w);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeFilterForm = (event) => {
    const { name, value } = event.target;
    const newFilter = { ...filters };
    newFilter[name] = value;
    setFilters({ ...newFilter });
  };

  const handleRestaureFilter = () => {
    setFilters({ etat: '', wilaya: '' });
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - envoi.length) : 0;

  const filteredUsers = applySortFilter(envoi, getComparator(order, orderBy), filterName, filters);

  const isNotFound = !filteredUsers.length && !!filterName;

  // My Modifs ----

  const getEnvoi = async () => {
    try {
      const res = await Request.get(`/envoi/by-livreur`);
      setEnvoi(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEnvoi();
  }, []);

  const deleteSelected = async () => {
    try {
      console.log(selected);
      await Request.post('/envoi/delete', selected);
      await getEnvoi();
      setSelected([]);
    } catch (error) {
      console.log(error);
    }
  };

  const cancelEnvoi = async (id) => {
    await Request.put(`/envoi/cancel/${id}`);
    getEnvoi();
  };

  const confirmEnvoi = async (id) => {
    await Request.put(`/envoi/confirm/${id}`);
    getEnvoi();
  };

  return (
    <>
      <Helmet>
        <title> Envoi </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Envoi
          </Typography>
          {/* <Link to="/dashboard/envoi/create">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              nouvel envoi
            </Button>
          </Link> */}
        </Stack>

        <Card>
          {/* Filter here */}
          <UserListToolbar
            deleteSelected={deleteSelected}
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            handleOpenModalFilter={handleOpenModalFilter}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={envoi.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, wilaya, commune, address, infos, client, name, etats, prixtotal, produit, quantite } =
                      row;
                    const selectedUser = selected.indexOf(_id) !== -1;

                    let status =
                      etats?.length > 0 &&
                      etats.reduce((a, b) => {
                        if (!b.date) return a;
                        return a.date > b.date ? a : b;
                      });

                    if (etats.length > 0 && !status.date)
                      status = etats.length > 0 && etats.find((e) => e.etat.code === 1);

                    return (
                      wilaya && (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, _id)} />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {`${client.firstname} ${client.lastname}`}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{name}</TableCell>

                          <TableCell align="left">{wilaya.name}</TableCell>

                          <TableCell align="left">{commune.name}</TableCell>

                          <TableCell align="left">{address}</TableCell>

                          <TableCell align="left">{infos}</TableCell>

                          <TableCell align="left">{produit}</TableCell>

                          <TableCell align="left">{quantite}</TableCell>

                          <TableCell align="left">{prixtotal}&nbsp;Da</TableCell>

                          <TableCell align="left">
                            <Label color={LABEL_COLOR[status.etat.code] || 'success'}>{status.etat.name}</Label>
                          </TableCell>

                          <TableCell align="right">
                            <IconButton
                              disabled={![2, 3, 4].includes(status.etat.code)}
                              sx={{ color: '##FF0000', '&:hover': { bgcolor: '##FF0000', color: '#FF0000' } }}
                              onClick={() => {
                                if (window.confirm("Annuler l'envoi ?")) {
                                  cancelEnvoi(_id);
                                }
                              }}
                            >
                              <Iconify icon="ant-design:close" width={20} height={20} stroke="red" />
                            </IconButton>

                            <IconButton
                              disabled={![2, 3, 4].includes(status.etat.code)}
                              sx={{ color: '#4CAF50', '&:hover': { bgcolor: '#4CAF50', color: '#fff' } }}
                              onClick={() => {
                                if (window.confirm("Confirmer l'envoi?")) {
                                  confirmEnvoi(_id);
                                }
                              }}
                            >
                              <Iconify icon="ant-design:check" width={20} height={20} stroke="red" />
                            </IconButton>
                          </TableCell>

                          {/* <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell> */}
                        </TableRow>
                      )
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={envoi.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Link to="/test">
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Modifier
          </Link>
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Supprimer
        </MenuItem>
      </Popover>
      {/* <SimpleDialog onClose={handleClose} selectedValue={selectedValueEditEtat} open={openEditEtat} /> */}

      <Dialog open={openModalFilter} onClose={handleCloseModalModalFilter}>
        <DialogTitle>Filtrage des envois</DialogTitle>
        <DialogContent>
          <DialogContentText>Veuillez appliquez les modification, puis appuyez sur Valider</DialogContentText>
          <Container disableGutters sx={{ width: '100%', mt: 5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="etatlabel" sx={{ mb: 1 }}>
                    Etat
                  </InputLabel>
                  <Select
                    labelId="etat"
                    id="etatfilter"
                    value={filters.etat}
                    label="Etat"
                    name="etat"
                    onChange={handleChangeFilterForm}
                  >
                    <MenuItem sx={{ color: 'gray' }} key={0} value={''}>
                      Aucune selection
                    </MenuItem>
                    {etatsList?.map((s) => (
                      <MenuItem key={s._id} value={s._id}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="wilaya" sx={{ mb: 1 }}>
                    Wilaya
                  </InputLabel>
                  <Select
                    labelId="wilaya"
                    id="wilaya"
                    name="wilaya"
                    value={filters.wilaya}
                    label="Wilaya"
                    onChange={handleChangeFilterForm}
                  >
                    <MenuItem sx={{ color: 'gray' }} key={0} value={''}>
                      Aucune selection
                    </MenuItem>
                    {wilayas?.map((s) => (
                      <MenuItem key={s._id} value={s._id}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRestaureFilter}>Restaurer</Button>
          <Button onClick={handleCloseModalModalFilter}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
