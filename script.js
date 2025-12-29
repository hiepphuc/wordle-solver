/**
 * @param {string} selector
*/
function $(selector) {
    return document.querySelector(selector);
}

/**
 * @param {string} selector
*/
function $a(selector) {
    return document.querySelectorAll(selector);
}

// Danh sách các từ
let wordList = [];

// Khởi tạo danh sách các từ
init();

// Thêm event click để lắp class correct, present, absent cho phù hợp với các tile
for (const tile of $a('.tile')) {
    tile.addEventListener('click', () => {
        let className = '';
        if (tile.classList.contains('absent')) {
            tile.classList.remove('absent');
            className = 'present';
        }
        else if (tile.classList.contains('present')) {
            tile.classList.remove('present');
            className = 'correct';
        }
        else {
            tile.classList.remove('correct');
            className = 'absent';
        }
        tile.classList.add(className);
    });

    tile.addEventListener('input', () => {
        if (tile.value && tile.nextElementSibling) {
            tile.nextElementSibling.focus();
        }
    });
}

/* Tạo ra cấu trúc dữ liệu của các tile (mảng các tile) khi người dùng bấm nút #solve-btn
và thuật toán lọc từ */
$('#solve-btn').addEventListener('click', () => {
    const tiles = [...$a('.tile')].map( tile => ({
        letter: tile.value.toUpperCase(),
        state: tile.className.slice().replace('tile', '').trim()
    }));

    // Thuật toán lọc từ
    const filteredWordList = wordList.filter((word) => {
        
        return tiles.every(({letter, state}, index) => {
            // Nếu ô trống thì coi như thoả mãn, bỏ qua check
            if (letter === '') return true;
            
            if (state === 'correct' && word[index] === letter) {
                return true;
            }
            else if (state === 'present' && word[index] !== letter && word.includes(letter)) {
                return true;
            }
            else if (state === 'absent' && !word.includes(letter)) {
                return true;
            }
            else {
                return false;
            }
        });
    });
    console.log(`filtered word list: ${filteredWordList}`);

    $('#word-list').innerHTML = '';
    const wordListHtml = filteredWordList.map(word => {
        return `
            <li>${word}</li>
        `
    }).join('');
    $('#word-list').innerHTML = wordListHtml;
});

async function init() {
    const response = await fetch('words.json');
    const words = await response.json();
    wordList = words;
    return wordList;
}

$('#reset-btn').addEventListener('click', () => {
    for (const tile of $a('.tile')) {
        tile.value = '';
        tile.className = 'tile';
    }
    $('#word-list').innerHTML = '';
    /* Thường khi bấm "Làm mới", người dùng sẽ muốn nhập từ tiếp theo ngay lập tức, 
    thêm dòng này vào cuối hàm để con trỏ chuột tự động nhảy về ô đầu tiên */
    $('#tile-0').focus();
})