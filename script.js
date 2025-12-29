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

let wordList = []; // Danh sách từ hiện tại (sẽ bị teo nhỏ dần sau mỗi lần lọc)
let allWords = []; // Kho lưu trữ gốc (để dùng khi Reset)

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

    tile.addEventListener('keydown', (event) => {
        // ^...$: Đảm bảo chỉ có đúng 1 ký tự
        // a-zA-Z: Chấp nhận cả chữ thường và chữ hoa
        if (event.key.match(/^[a-zA-Z]$/)) {
            tile.value = '';
        }

    });
}

/* Tạo ra cấu trúc dữ liệu của các tile (mảng các tile) khi người dùng bấm nút #solve-btn
và thuật toán lọc từ */
$('#solve-btn').addEventListener('click', () => {
    // 1. Lấy dữ liệu từ 5 ô hiện tại
    const tiles = [...$a('.tile')].map( tile => ({
        letter: tile.value.toUpperCase(),
        state: tile.className.slice().replace('tile', '').trim()
    }));

    // 2. Lọc trực tiếp trên biến wordList (kế thừa kết quả từ lần trước)
    // gán ngược lại kết quả vào wordList
    wordList = wordList.filter((word) => {
        return tiles.every(({letter, state}, index) => {
            if (letter === '') return true; // Bỏ qua ô trống
            
            if (state === 'correct') {
                return word[index] === letter;
            }
            else if (state === 'present') {
                return word.includes(letter) && word[index] !== letter;
            }
            else if (state === 'absent') {
                // Logic cơ bản: Từ không được chứa chữ này
                // (Nâng cao: Nếu chữ này đã xuất hiện ở dạng correct/present chỗ khác thì logic sẽ phức tạp hơn chút, 
                // nhưng tạm thời ta dùng logic cơ bản này)
                return !word.includes(letter);
            }
            return false;
        });
    });

    console.log(`Còn lại ${wordList.length} từ`);

    // 3. Hiển thị
    $('#word-list').innerHTML = wordList.map(word => `<li>${word}</li>`).join('');
});

async function init() {
    const response = await fetch('words.json');
    const json = await response.json();
    allWords = json;      // Lưu vào kho gốc
    wordList = [...allWords]; // Copy sang danh sách dùng để lọc
}

$('#reset-btn').addEventListener('click', () => {
    // ... code xóa ô cũ của bạn giữ nguyên ...
    for (const tile of $a('.tile')) {
        tile.value = '';
        tile.className = 'tile';
    }
    
    // Code thêm mới:
    wordList = [...allWords]; // Khôi phục lại danh sách đầy đủ từ kho gốc
    $('#word-list').innerHTML = ''; // Xóa danh sách gợi ý trên màn hình
    $a('.tile')[0].focus(); // Focus vào ô đầu
});