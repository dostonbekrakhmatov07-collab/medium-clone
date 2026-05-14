const postsContainer = document.getElementById('posts-container');

async function loadPosts() {
  try {
    const response = await fetch('http://localhost:5000/api/posts');
    const posts = await response.json();

    if (posts.length === 0) {
      postsContainer.innerHTML = '<p style="color:#888;padding:24px;">Пока нет статей. Напишите первую!</p>';
      return;
    }

    postsContainer.innerHTML = '';
    posts.forEach(post => {
      postsContainer.innerHTML += `
        <div class="post-card">
          <div class="post-info">
            <div class="post-author">
              <span>${post.username}</span>
            </div>
            <div class="post-title">
              <a href="article.html?id=${post.id}" style="text-decoration:none;color:inherit;">${post.title}</a>
            </div>
            <div class="post-subtitle">${post.content.substring(0, 100)}...</div>
            <div class="post-meta">${new Date(post.created_at).toLocaleDateString('ru-RU')}</div>
          </div>
        </div>
      `;
    });
  } catch (err) {
    postsContainer.innerHTML = '<p style="color:red;">Ошибка загрузки постов!</p>';
  }
}

loadPosts();