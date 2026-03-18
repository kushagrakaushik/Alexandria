const trendingBooks = [
    {
        title: "Crooked Kingdom",
        author: "Leigh Bardugo",
        cover: "Archive/Books/Crooked Kingdom Leigh Bardugo.jpeg"
    },
    {
        title: "Six of Crows",
        author: "Leigh Bardugo",
        cover: "Archive/Books/Six of Crows by Leigh Bardugo.jpeg"
    },
    {
        title: "Red Rising",
        author: "Pierce Brown",
        cover: "Archive/Books/Red Rising by Pierce Brown.jpeg"
    },
    {
        title: "The Well of Ascension",
        author: "Brandon Sanderson",
        cover: "Archive/Books/The Well of Ascension Brandon Sanderson.jpeg"
    },
    {
        title: "The Priory of the Orange Tree",
        author: "Samantha Shannon",
        cover: "Archive/Books/The Priory of the Orange Tree.jpeg"
    },
    {
        title: "Harry Potter & Half-Blood Prince",
        author: "J.K. Rowling",
        cover: "Archive/Books/Harry Potter Half-Blood Prince.jpeg"
    },
    {
        title: "The House in the Cerulean Sea",
        author: "TJ Klune",
        cover: "Archive/Books/The House in the Cerulean Sea.jpeg"
    },
    {
        title: "The Scorch Trials",
        author: "James Dashner",
        cover: "Archive/Books/The Scorch Trials Maze Runner 2.jpeg"
    },
    {
        title: "Percy Jackson",
        author: "Rick Riordan",
        cover: "Archive/Books/Percy Jackson.jpeg"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const trendingContainer = document.getElementById('trendingBooks');
    
    // Render Trending Books
    trendingBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <img src="${book.cover}" alt="${book.title}">
            <div class="info">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
            </div>
        `;
        trendingContainer.appendChild(bookCard);
    });

    // Navigation Active State
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Simple 3D Card Effect for Hero
    const heroCard = document.querySelector('.hero-visual');
    if(heroCard) {
        heroCard.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            // heroCard.querySelector('.book-cover-3d img').style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
        
        heroCard.addEventListener('mouseleave', () => {
            // heroCard.querySelector('.book-cover-3d img').style.transform = `rotateY(-15deg) rotateX(5deg)`;
        });
    }
});