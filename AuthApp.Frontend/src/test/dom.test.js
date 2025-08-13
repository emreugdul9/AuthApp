describe('DOM Tests', () => {
  test('can create and append elements', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello World';
    document.body.appendChild(div);
    
    expect(document.body.children.length).toBeGreaterThan(0);
    expect(div.textContent).toBe('Hello World');
    
    document.body.removeChild(div);
  });

  test('can set and get element attributes', () => {
    const button = document.createElement('button');
    button.setAttribute('id', 'test-button');
    button.setAttribute('class', 'btn btn-primary');
    
    expect(button.getAttribute('id')).toBe('test-button');
    expect(button.getAttribute('class')).toBe('btn btn-primary');
  });

  test('can query elements by selector', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <h1 id="title">Test Title</h1>
      <p class="content">Test content</p>
    `;
    document.body.appendChild(container);
    
    const title = document.querySelector('#title');
    const content = document.querySelector('.content');
    
    expect(title).not.toBeNull();
    expect(title.textContent).toBe('Test Title');
    expect(content).not.toBeNull();
    expect(content.textContent).toBe('Test content');
    
    // Cleanup
    document.body.removeChild(container);
  });

  test('can handle click events', () => {
    const button = document.createElement('button');
    let clicked = false;
    
    button.addEventListener('click', () => {
      clicked = true;
    });
    
    // Simulate click
    button.click();
    
    expect(clicked).toBe(true);
  });
});
