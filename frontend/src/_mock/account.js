// ----------------------------------------------------------------------

const mapping = {
  'null': 'null',
  '0': 'Staff',
  '1': 'Branch manager',
  '2': 'Administrator',
  '3': 'Super administrator'
}


const account = () => {
  if (JSON.parse(localStorage.getItem('user'))) {
    return {
      displayName: JSON.parse(localStorage.getItem('user')).username,
      roleLevel: mapping[(JSON.parse(localStorage.getItem('user')).roleLevel)],
      photoURL: '/assets/images/avatars/avatar_default.jpg',
    }
  }
  return {
    displayName: 'null',
    roleLevel: 'null',
    photoURL: '/assets/images/avatars/avatar_default.jpg',
  }
};

export default account;
