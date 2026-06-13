const API_URL = CONFIG.API_URL;

let acceptances = [];
let blessings = [];

const acceptanceTable =
  document.getElementById('acceptanceTable');

const blessingTable =
  document.getElementById('blessingTable');

const acceptanceCount =
  document.getElementById('acceptanceCount');

const blessingCount =
  document.getElementById('blessingCount');

/* -------------------------
   Load Acceptances
------------------------- */

async function loadAcceptances() {

  try {

    const response =
      await fetch(`${API_URL}/acceptances`);

    const result =
      await response.json();

    acceptances = result.data || [];

    acceptanceCount.textContent =
      acceptances.length;

    renderAcceptances(acceptances);

  } catch(err) {

    console.error(err);

  }

}

/* -------------------------
   Load Blessings
------------------------- */

async function loadBlessings() {

  try {

    const response =
      await fetch(`${API_URL}/blessings`);

    const result =
      await response.json();

    blessings = result.data || [];

    blessingCount.textContent =
      blessings.length;

    renderBlessings(blessings);

  } catch(err) {

    console.error(err);

  }

}

/* -------------------------
   Render Acceptances
------------------------- */

function renderAcceptances(data) {

  acceptanceTable.innerHTML = '';

  data.forEach(item => {

    acceptanceTable.innerHTML += `
      <tr>
        <td>${item.fullName}</td>
        <td>${item.email}</td>
        <td>${item.message || '-'}</td>
        <td>
          ${new Date(item.createdAt)
            .toLocaleString()}
        </td>

        <td>
          <button
            class="btn btn-sm btn-danger"
            onclick="deleteAcceptance('${item._id}')"
          >
            Delete
          </button>
        </td>
      </tr>
    `;
  });

}

/* -------------------------
   Render Blessings
------------------------- */

function renderBlessings(data) {

  blessingTable.innerHTML = '';

  data.forEach(item => {

    blessingTable.innerHTML += `
      <tr>

        <td>${item.icon}</td>

        <td>${item.name}</td>

        <td>${item.message}</td>

        <td>
          ${new Date(item.createdAt)
            .toLocaleString()}
        </td>

        <td>
          <button
            class="btn btn-sm btn-danger"
            onclick="deleteBlessing('${item._id}')"
          >
            Delete
          </button>
        </td>

      </tr>
    `;
  });

}

/* -------------------------
   Delete Acceptance
------------------------- */

async function deleteAcceptance(id) {

  if (
    !confirm(
      'Delete this acceptance?'
    )
  ) return;

  await fetch(
    `${API_URL}/acceptances/${id}`,
    {
      method: 'DELETE'
    }
  );

  loadAcceptances();

}

/* -------------------------
   Delete Blessing
------------------------- */

async function deleteBlessing(id) {

  if (
    !confirm(
      'Delete this blessing?'
    )
  ) return;

  await fetch(
    `${API_URL}/blessings/${id}`,
    {
      method: 'DELETE'
    }
  );

  loadBlessings();

}

/* -------------------------
   Search Acceptances
------------------------- */

document
  .getElementById('acceptanceSearch')
  .addEventListener('input', e => {

    const value =
      e.target.value.toLowerCase();

    const filtered =
      acceptances.filter(item =>
        item.fullName
          .toLowerCase()
          .includes(value)
        ||
        item.email
          .toLowerCase()
          .includes(value)
      );

    renderAcceptances(filtered);

});

/* -------------------------
   Search Blessings
------------------------- */

document
  .getElementById('blessingSearch')
  .addEventListener('input', e => {

    const value =
      e.target.value.toLowerCase();

    const filtered =
      blessings.filter(item =>
        item.name
          .toLowerCase()
          .includes(value)
        ||
        item.message
          .toLowerCase()
          .includes(value)
      );

    renderBlessings(filtered);

});

/* -------------------------
   Export CSV
------------------------- */

document
  .getElementById('exportBtn')
  .addEventListener('click', () => {

    let csv =
      'Name,Email,Message,Date\n';

    acceptances.forEach(item => {

      csv += `"${item.fullName}","${item.email}","${item.message || ''}","${item.createdAt}"\n`;

    });

    const blob =
      new Blob([csv], {
        type: 'text/csv'
      });

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement('a');

    a.href = url;

    a.download =
      'ola-acceptances.csv';

    a.click();

    URL.revokeObjectURL(url);

});

/* -------------------------
   Refresh
------------------------- */

document
  .getElementById('refreshBtn')
  .addEventListener('click', () => {

    initialize();

});

/* -------------------------
   Init
------------------------- */

async function initialize() {

  await Promise.all([
    loadAcceptances(),
    loadBlessings()
  ]);

}

initialize();