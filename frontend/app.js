const API_BASE = "http://localhost:8000";
let CURRENT_USER = null;
let TOKEN = localStorage.getItem('token');

function showAuthForm(type) {
  const loginForm = document.getElementById('login-form');
  const regForm = document.getElementById('register-form');
  const btnLogin = document.getElementById('btn-show-login');
  const btnReg = document.getElementById('btn-show-register');

  if (type === 'login') {
    loginForm.classList.remove('hidden');
    regForm.classList.add('hidden');
    btnLogin.classList.add('active');
    btnReg.classList.remove('active');
  } else {
    loginForm.classList.add('hidden');
    regForm.classList.remove('hidden');
    btnLogin.classList.remove('active');
    btnReg.classList.add('active');
  }
}

async function register() {
  const username = document.getElementById('reg-username').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const msg = document.getElementById('reg-msg');
  
  if (!username || !email || !password) {
    msg.innerText = "All fields are required";
    return;
  }

  msg.innerText = "Creating account...";
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    
    if (res.ok) {
      try {
        await res.json(); 
      } catch (e) { }
      
      msg.className = "success-msg";
      msg.innerText = "Account created! Please log in.";
      setTimeout(() => showAuthForm('login'), 1500);
    } else {
      let errorMessage = "Registration failed";
      try {
        const data = await res.json();
        errorMessage = data.message || errorMessage;
      } catch (e) {
        console.error("Non-JSON error response", e);
      }
      throw new Error(errorMessage);
    }
  } catch (err) {
    msg.className = "error-msg";
    msg.innerText = err.message;
  }
}

async function login() {
  const username = document.getElementById('login-username').value;
  const pass = document.getElementById('login-password').value;
  const msg = document.getElementById('login-msg');

  msg.innerText = "Logging in...";
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password: pass })
    });

    const data = await res.json();
    if (res.ok) {
      TOKEN = data.token;
      localStorage.setItem('token', TOKEN);
      localStorage.setItem('username', username);
      initDashboard();
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    msg.innerText = err.message;
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  TOKEN = null;
  location.reload();
}

function initDashboard() {
  if (!TOKEN) return;

  document.getElementById('auth-view').classList.add('hidden');
  document.getElementById('dashboard-view').classList.remove('hidden');
  document.getElementById('welcome-msg').innerText = `Welcome, ${localStorage.getItem('username')}`;

  loadPlaylists();
  loadContent();
}

async function loadPlaylists() {
  const list = document.getElementById('playlist-list');
  const select = document.getElementById('playlist-select');
  
  try {
    const res = await fetch(`${API_BASE}/api/playlists?userId=${localStorage.getItem('username')}`); 
    const data = await res.json();
    
    list.innerHTML = "";
    select.innerHTML = '<option value="">Choose Playlist...</option>';

    if (data.length === 0) {
      list.innerHTML = '<p class="text-center" style="color: var(--text-muted);">No playlists yet.</p>';
    }

    data.forEach(p => {
      const item = document.createElement('div');
      item.className = "list-item";
      item.innerHTML = `<span>🎵 ${p.name}</span> <span style="font-size:0.8rem; opacity:0.6;">${p.userId}</span>`;
      item.onclick = () => loadPlaylistDetails(p.id);
      list.appendChild(item);

      const opt = document.createElement('option');
      opt.value = p.id;
      opt.innerText = p.name;
      select.appendChild(opt);
    });

  } catch (err) {
    console.error(err);
    list.innerHTML = '<p class="error-msg">Failed to load playlists</p>';
  }
}

async function createPlaylist() {
  const name = document.getElementById('new-playlist-name').value;
  if (!name) return;

  await fetch(`${API_BASE}/api/playlists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      name: name,
      userId: localStorage.getItem('username')
    })
  });
  
  document.getElementById('new-playlist-name').value = "";
  loadPlaylists();
}

async function loadContent() {
  const list = document.getElementById('content-list');
  try {
    const res = await fetch(`${API_BASE}/api/content`);
    const data = await res.json();

    list.innerHTML = "";
    if (data.length === 0) {
      list.innerHTML = '<p class="text-center">No tracks available.</p>';
    }

    data.forEach(track => {
      const filename = track.file_path.split(/[\\/]/).pop();
      
      const item = document.createElement('div');
      item.className = "list-item";
      item.innerHTML = `
        <div class="track-info">
          <div class="track-title">${track.title || 'Unknown Title'}</div>
          <div class="track-artist">${track.artist || 'Unknown Artist'}</div>
        </div>
        <button class="btn btn-small" onclick="playTrack('${track.id}', '${filename}', '${track.title}', '${track.artist}')">▶</button>
      `;
      list.appendChild(item);
    });

  } catch (err) {
    list.innerHTML = '<p class="error-msg">Failed to load content</p>';
  }
}

async function uploadTrack() {
  const fileInput = document.getElementById('upload-file');
  const msg = document.getElementById('upload-msg');

  if (fileInput.files.length === 0) return;
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append('file', file);

  msg.className = "";
  msg.innerText = "Uploading...";

  try {
    const res = await fetch(`${API_BASE}/api/content/upload`, {
      method: "POST",
      body: formData 
    });

    if (res.ok) {
      msg.className = "success-msg";
      msg.innerText = "Upload successful!";
      fileInput.value = "";
      loadContent();
    } else {
      throw new Error("Upload failed");
    }
  } catch (err) {
    msg.className = "error-msg";
    msg.innerText = "Upload failed";
  }
}

let currentTrackId = null;

function playTrack(id, filename, title, artist) {
  const player = document.getElementById('player');
  const titleDisplay = document.getElementById('player-title');
  const artistDisplay = document.getElementById('player-artist');

  currentTrackId = id; 
  
  titleDisplay.innerText = title;
  artistDisplay.innerText = artist;

  player.src = `${API_BASE}/api/stream/${filename}?token=${TOKEN}`; 
  player.play();
}

async function addToPlaylist() {
  const playlistId = document.getElementById('playlist-select').value;
  const msg = document.getElementById('playlist-msg');

  if (!playlistId || !currentTrackId) {
    msg.className = "error-msg";
    msg.innerText = "Select a playlist and play a track first";
    return;
  }

  const title = document.getElementById('player-title').innerText;
  const artist = document.getElementById('player-artist').innerText;

  try {
    await fetch(`${API_BASE}/api/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        artist,
        duration: 0
      })
    });
    msg.className = "success-msg";
    msg.innerText = "Added to playlist!";
    setTimeout(() => msg.innerText = "", 2000);
  } catch (err) {
    msg.className = "error-msg";
    msg.innerText = "Failed to add";
  }
}

if (TOKEN) {
  initDashboard();
} else {
  showAuthForm('login');
}
