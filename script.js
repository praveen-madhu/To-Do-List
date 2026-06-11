let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  let filter = 'all';
  let nextId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

  function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function render() {
    const list = document.getElementById('taskList');
    const filtered = tasks.filter(t =>
      filter === 'all' ? true : filter === 'done' ? t.done : !t.done
    );
    const remaining = tasks.filter(t => !t.done).length;
    const done = tasks.filter(t => t.done).length;

    document.getElementById('subtitle').textContent =
      tasks.length === 0 ? 'Add your first task above!' :
      remaining === 0 ? 'All done! 🎉' :
      remaining === 1 ? '1 task remaining' : `${remaining} tasks remaining`;

    const footer = document.getElementById('footer');
    footer.style.display = tasks.length > 0 ? 'flex' : 'none';
    document.getElementById('footerCount').textContent = `${done} completed`;

    if (filtered.length === 0) {
      list.innerHTML = `<div class="empty">${
        filter === 'done' ? 'No completed tasks yet' :
        filter === 'active' ? 'No active tasks' :
        'No tasks yet — add one above!'
      }</div>`;
      return;
    }

    list.innerHTML = filtered.map(t => `
      <div class="task-item ${t.done ? 'done' : ''}">
        <button class="check-btn" onclick="toggle(${t.id})" title="${t.done ? 'Mark incomplete' : 'Mark complete'}">
          ${t.done ? '✓' : ''}
        </button>
        <span class="task-text">${escHtml(t.text)}</span>
        <button class="del-btn" onclick="del(${t.id})" title="Delete task">✕</button>
      </div>
    `).join('');
  }

  function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    tasks.unshift({ id: nextId++, text, done: false });
    input.value = '';
    filter = 'all';
    document.querySelectorAll('.filter-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    save();
    render();
    input.focus();
  }

  function toggle(id) {
    const t = tasks.find(t => t.id === id);
    if (t) t.done = !t.done;
    save();
    render();
  }

  function del(id) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  }

  function setFilter(f, btn) {
    filter = f;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  }

  function clearDone() {
    tasks = tasks.filter(t => !t.done);
    save();
    render();
  }

  document.getElementById('taskInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });

  render();