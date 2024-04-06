// ----------------------------------------------------------------------
const livreur = localStorage.getItem('livreur') ? JSON.parse(localStorage.getItem('livreur')) : null;

const account = {
  displayName: livreur ? `${livreur.firstname} ${livreur.lastname}` : '',
  email: livreur ? livreur.email : '',
  photoURL: '/assets/images/avatars/avatar_default.jpg',
};

export default account;
