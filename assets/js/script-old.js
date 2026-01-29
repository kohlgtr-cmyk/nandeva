        // Estado da aplicação
        let isAdmin = false;
        let cloudinaryConfig = {
            cloudName: '',
            uploadPreset: ''
        };

        // Carregar dados ao iniciar
        window.addEventListener('DOMContentLoaded', () => {
            loadAllData();
        });

        // Navegação
        function showSection(sectionName) {
            // Esconder todas as seções
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
            
            // Mostrar seção selecionada
            document.getElementById(sectionName).classList.add('active');
            event.target.classList.add('active');
        }

        // Login/Logout
        function login() {
            const password = document.getElementById('adminPassword').value;
            if (password === 'nandeva2025') {
                isAdmin = true;
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('adminPanel').style.display = 'block';
                document.getElementById('configBtn').style.display = 'block';
                document.getElementById('showAdminPanel').style.display = 'block';
                document.getElementById('photoAdminPanel').style.display = 'block';
                document.getElementById('videoAdminPanel').style.display = 'block';
                updateAdminButtons();
            } else {
                alert('Senha incorreta!');
            }
        }

        function logout() {
            isAdmin = false;
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('adminPanel').style.display = 'none';
            document.getElementById('configBtn').style.display = 'none';
            document.getElementById('showAdminPanel').style.display = 'none';
            document.getElementById('photoAdminPanel').style.display = 'none';
            document.getElementById('videoAdminPanel').style.display = 'none';
            document.getElementById('adminPassword').value = '';
            showSection('home');
            updateAdminButtons();
        }

        function updateAdminButtons() {
            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.style.display = isAdmin ? 'block' : 'none';
            });
        }

        // Modal de Configuração
        document.getElementById('configBtn').addEventListener('click', () => {
            document.getElementById('configModal').classList.add('active');
            document.getElementById('cloudName').value = cloudinaryConfig.cloudName;
            document.getElementById('uploadPreset').value = cloudinaryConfig.uploadPreset;
        });

        function closeConfigModal() {
            document.getElementById('configModal').classList.remove('active');
        }

        function saveConfig() {
            cloudinaryConfig.cloudName = document.getElementById('cloudName').value;
            cloudinaryConfig.uploadPreset = document.getElementById('uploadPreset').value;
            localStorage.setItem('nandeva-cloudinary-config', JSON.stringify(cloudinaryConfig));
            
            updateUploadInfo();
            closeConfigModal();
            alert('Configuração salva com sucesso!');
        }

        function updateUploadInfo() {
            const configured = cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset;
            document.getElementById('photoUploadInfo').textContent = configured ? 'Cloudinary configurado ✓' : 'Configure o Cloudinary primeiro (ícone de engrenagem)';
            document.getElementById('videoUploadInfo').textContent = configured ? 'Cloudinary configurado ✓' : 'Configure o Cloudinary primeiro (ícone de engrenagem)';
        }

        // Upload para Cloudinary
        async function uploadToCloudinary(file, resourceType) {
            if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
                alert('Configure o Cloudinary primeiro! Clique no ícone de configurações.');
                return null;
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', cloudinaryConfig.uploadPreset);

            try {
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${resourceType}/upload`,
                    { method: 'POST', body: formData }
                );

                if (!response.ok) throw new Error('Erro no upload');
                const data = await response.json();
                return data.secure_url;
            } catch (error) {
                console.error('Erro no upload:', error);
                alert('Erro ao fazer upload. Verifique as configurações do Cloudinary.');
                return null;
            }
        }

        // Handles de Upload
        async function handlePhotoUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione apenas arquivos de imagem!');
                return;
            }

            document.getElementById('photoUploadText').textContent = 'Enviando...';
            
            const url = await uploadToCloudinary(file, 'image');
            if (url) {
                const photos = getPhotos();
                photos.push({ url, id: Date.now(), filename: file.name });
                savePhotos(photos);
                alert('Foto adicionada com sucesso!');
            }
            
            document.getElementById('photoUploadText').textContent = 'Selecionar Foto';
            event.target.value = '';
        }

        async function handleVideoUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('video/')) {
                alert('Por favor, selecione apenas arquivos de vídeo!');
                return;
            }

            document.getElementById('videoUploadText').textContent = 'Enviando...';
            
            const url = await uploadToCloudinary(file, 'video');
            if (url) {
                const videos = getVideos();
                videos.push({ url, id: Date.now(), filename: file.name });
                saveVideos(videos);
                alert('Vídeo adicionado com sucesso!');
            }
            
            document.getElementById('videoUploadText').textContent = 'Selecionar Vídeo';
            event.target.value = '';
        }

        // Shows
        function addShow() {
            const date = document.getElementById('showDate').value;
            const location = document.getElementById('showLocation').value;
            const venue = document.getElementById('showVenue').value;

            if (!date || !location || !venue) {
                alert('Preencha todos os campos!');
                return;
            }

            const shows = getShows();
            shows.push({ date, location, venue, id: Date.now() });
            shows.sort((a, b) => new Date(a.date) - new Date(b.date));
            saveShows(shows);

            document.getElementById('showDate').value = '';
            document.getElementById('showLocation').value = '';
            document.getElementById('showVenue').value = '';
        }

        function deleteShow(id) {
            if (!window.confirm('Tem certeza que deseja deletar este show?')) return;
            const shows = getShows().filter(s => s.id !== id);
            saveShows(shows);
        }

        function deletePhoto(id) {
            if (!window.confirm('Tem certeza que deseja deletar esta foto?')) return;
            const photos = getPhotos().filter(p => p.id !== id);
            savePhotos(photos);
        }

        function deleteVideo(id) {
            if (!window.confirm('Tem certeza que deseja deletar este vídeo?')) return;
            const videos = getVideos().filter(v => v.id !== id);
            saveVideos(videos);
        }

        // LocalStorage
        function getShows() {
            return JSON.parse(localStorage.getItem('nandeva-shows') || '[]');
        }

        function saveShows(shows) {
            localStorage.setItem('nandeva-shows', JSON.stringify(shows));
            renderShows();
        }

        function getPhotos() {
            return JSON.parse(localStorage.getItem('nandeva-photos') || '[]');
        }

        function savePhotos(photos) {
            localStorage.setItem('nandeva-photos', JSON.stringify(photos));
            renderPhotos();
        }

        function getVideos() {
            return JSON.parse(localStorage.getItem('nandeva-videos') || '[]');
        }

        function saveVideos(videos) {
            localStorage.setItem('nandeva-videos', JSON.stringify(videos));
            renderVideos();
        }

        // Render
        function renderShows() {
            const shows = getShows();
            const container = document.getElementById('showsList');
            
            if (shows.length === 0) {
                container.innerHTML = '<div class="empty-state">Nenhum show agendado no momento. Fique ligado!</div>';
                return;
            }

            container.innerHTML = shows.map(show => `
                <div class="show-card">
                    <div class="show-info">
                        <div>
                            <svg class="icon" style="color:#a78bfa;" viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span style="font-size:1.125rem;font-weight:600;">
                                ${new Date(show.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <div>
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>${show.venue} - ${show.location}</span>
                        </div>
                    </div>
                    <button class="btn-delete" onclick="deleteShow(${show.id})" style="display:${isAdmin ? 'block' : 'none'};">
                        <svg class="icon" viewBox="0 0 24 24" style="width:20px;height:20px;">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `).join('');
        }

        function renderPhotos() {
            const photos = getPhotos();
            const container = document.getElementById('photoGrid');
            
            if (photos.length === 0) {
                container.innerHTML = '<div class="empty-state">Nenhuma foto adicionada ainda.</div>';
                return;
            }

            container.innerHTML = photos.map(photo => `
                <div class="photo-item">
                    <img src="${photo.url}" alt="${photo.filename || 'Nandeva'}">
                    <button class="btn-delete" onclick="deletePhoto(${photo.id})" style="display:${isAdmin ? 'block' : 'none'};">
                        <svg class="icon" viewBox="0 0 24 24" style="width:16px;height:16px;">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `).join('');
        }

        function renderVideos() {
            const videos = getVideos();
            const container = document.getElementById('videoGrid');
            
            if (videos.length === 0) {
                container.innerHTML = '<div class="empty-state">Nenhum vídeo adicionado ainda.</div>';
                return;
            }

            container.innerHTML = videos.map(video => `
                <div class="video-item">
                    <video src="${video.url}" controls></video>
                    <button class="btn-delete" onclick="deleteVideo(${video.id})" style="display:${isAdmin ? 'block' : 'none'};">
                        <svg class="icon" viewBox="0 0 24 24" style="width:16px;height:16px;">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `).join('');
        }

        function loadAllData() {
            // Carregar configuração
            const savedConfig = localStorage.getItem('nandeva-cloudinary-config');
            if (savedConfig) {
                cloudinaryConfig = JSON.parse(savedConfig);
                updateUploadInfo();
            }

            // Renderizar dados
            renderShows();
            renderPhotos();
            renderVideos();
        }