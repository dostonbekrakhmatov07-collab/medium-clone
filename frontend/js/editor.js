let coverImageUrl = '';

async function uploadCover(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('cover-preview');
      preview.src = e.target.result;
      preview.style.display = 'block';
      document.getElementById('cover-upload').style.display = 'none';
    }
    reader.readAsDataURL(file);

    // Загружаем на сервер
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      coverImageUrl = data.url;
    } catch (err) {
      alert('Ошибка загрузки фото!');
    }
  }
}

async function publish() {
  const title = document.querySelector('.editor-title').innerText;
  const body = document.querySelector('.editor-body').innerText;
  const token = localStorage.getItem('token');

  if (!title || !body) {
    alert('Заполните заголовок и текст!');
    return;
  }

  if (!token) {
    alert('Сначала войдите в аккаунт!');
    window.location.href = 'auth.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token
      },
      body: JSON.stringify({ title, content: body, cover_image: coverImageUrl })
    });

    const data = await response.json();

    if (data.id) {
      alert('Статья опубликована! 🎉');
      window.location.href = 'feed.html';
    } else {
      alert(data.error);
    }
  } catch (err) {
    alert('Ошибка сервера!');
  }
}