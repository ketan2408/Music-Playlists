// Get elements
const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currTime = document.getElementById('currTime');
const durTime = document.getElementById('durTime');
const volumeSlider = document.getElementById('volume');
const audio = document.getElementById('audio');
const playlist = document.getElementById('playlist');
const addMusicBtn = document.getElementById('add-music-btn');
const deleteMusicBtn = document.getElementById('delete-music-btn');

// Initial music list
let songs = [
  { title: 'Tum Prem Hoo', artist: 'Arijit Singh', file: 'Tum Prem Hoo.mp3' },
  { title: 'Deva Deva God', artist: 'Shreya Ghoshal', file: 'Deva Deva God.mp3' },
  { title: 'Ram Siya Ram', artist: 'Udit Narayan', file: 'Ram Siya Ram.mp3' },
  // Add more songs here...
];

let songIndex = 0;

// Load song
function loadSong(song) {
  audio.src = `music/${song.file}`;
  document.getElementById('title').textContent = `${song.title} - ${song.artist}`;
}

// Populate playlist
function populatePlaylist() {
  playlist.innerHTML = ''; // Clear the existing playlist
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = `${song.title} - ${song.artist}`;
    li.dataset.index = index; // Store index for later use
    li.addEventListener('click', () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      playSong();
    });
    playlist.appendChild(li);
  });
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  updateTimeDisplay();
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

// Update time display
function updateTimeDisplay() {
  const { duration, currentTime } = audio;
  let min = Math.floor(currentTime / 60);
  min = min < 10 ? '0' + min : min;
  let sec = Math.floor(currentTime % 60);
  sec = sec < 10 ? '0' + sec : sec;
  currTime.innerHTML = `${min}:${sec}`;
  
  let min_d = Math.floor(duration / 60);
  min_d = min_d < 10 ? '0' + min_d : min_d;
  let sec_d = Math.floor(duration % 60);
  sec_d = sec_d < 10 ? '0' + sec_d : sec_d;
  durTime.innerHTML = `${min_d}:${sec_d}`;
}

// Update volume of the audio element based on the slider's value
function updateVolume() {
  audio.volume = volumeSlider.value;
}

// Play song
function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');
  audio.play();
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');
  audio.pause();
}

// Previous song
function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

// Next song
function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}

// Add music
function addMusic() {
  const title = prompt('Enter the song title:');
  const artist = prompt('Enter the artist name:');
  const file = prompt('Enter the filename (with extension):');

  if (title && artist && file) {
    songs.push({ title, artist, file });
    populatePlaylist();
    if (songs.length === 1) {
      // If it's the first song, load and play it immediately
      songIndex = 0;
      loadSong(songs[songIndex]);
      playSong();
    }
  }
}

// Delete music
function deleteMusic() {
  const indexToDelete = parseInt(prompt('Enter the index of the song to delete (starting from 0):'), 10);

  if (!isNaN(indexToDelete) && indexToDelete >= 0 && indexToDelete < songs.length) {
    songs.splice(indexToDelete, 1);
    if (songIndex === indexToDelete) {
      // If the deleted song was playing, load the next song
      songIndex = songIndex >= songs.length ? songs.length - 1 : songIndex;
      loadSong(songs[songIndex]);
      playSong();
    }
    populatePlaylist();
  }
}

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

progressContainer.addEventListener('click', setProgress);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong); // Play next song when current song ends

volumeSlider.addEventListener('input', updateVolume);

// Add functionality for add and delete buttons
addMusicBtn.addEventListener('click', addMusic);
deleteMusicBtn.addEventListener('click', deleteMusic);

// Initialize
populatePlaylist();
loadSong(songs[songIndex]);
