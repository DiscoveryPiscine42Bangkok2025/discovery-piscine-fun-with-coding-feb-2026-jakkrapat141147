// ดึงกล่องรายการมาไว้ในตัวแปร
const list = document.getElementById('ft_list');

// 1. ฟังก์ชันสร้าง To Do ใหม่
function newTodo() {
    let text = prompt("Enter your new TO DO:");
    
    // ถ้ามีการพิมพ์ข้อความ (ไม่กด Cancel และไม่เป็นค่าว่าง)
    if (text && text.trim() !== "") {
        addTodoToDOM(text);
        saveCookies(); // บันทึกทุกครั้งที่เพิ่ม
    }
}

// 2. ฟังก์ชันเพิ่มรายการลงในหน้าเว็บ (DOM)
function addTodoToDOM(text) {
    let div = document.createElement('div');
    div.className = 'todo-item';
    div.innerHTML = text;
    
    // ใส่ Event คลิกเพื่อลบ
    div.onclick = function() {
        if (confirm("Do you want to remove this TO DO?")) {
            div.remove();
            saveCookies(); // บันทึกทุกครั้งที่ลบ
        }
    };

    // แทรกไว้ "บนสุด" (prepend)
    list.prepend(div);
}

// 3. ฟังก์ชันบันทึกข้อมูลลง Cookie
function saveCookies() {
    let todos = [];
    let items = document.querySelectorAll('.todo-item');
    
    // วนลูปเก็บข้อความจากทุกรายการ
    // (ต้องวนแบบย้อนกลับ เพราะเราใช้ prepend ดึงมามันจะเรียงใหม่-เก่า แต่เราอยากเก็บลำดับเดิม)
    for (let i = items.length - 1; i >= 0; i--) {
        todos.push(items[i].innerHTML);
    }
    
    // แปลงเป็น JSON string
    let jsonString = JSON.stringify(todos);
    
    // บันทึกลง Cookie (ชื่อ 'ft_list', หมดอายุใน 7 วัน)
    let d = new Date();
    d.setTime(d.getTime() + (7*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    
    // Cookie ต้องระบุ path=/ เพื่อให้เข้าถึงได้ทั่วถึง
    document.cookie = "ft_list=" + encodeURIComponent(jsonString) + ";" + expires + ";path=/";
}

// 4. ฟังก์ชันโหลดข้อมูลจาก Cookie เมื่อเปิดหน้าเว็บ
window.onload = function() {
    let name = "ft_list=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        // ถ้าเจอ Cookie ที่ชื่อ ft_list
        if (c.indexOf(name) == 0) {
            let jsonString = c.substring(name.length, c.length);
            try {
                let todos = JSON.parse(jsonString);
                // วนลูปสร้างรายการกลับคืนมา
                for (let j = 0; j < todos.length; j++) {
                    addTodoToDOM(todos[j]);
                }
            } catch (e) {
                console.log("No valid todos found");
            }
            return;
        }
    }
};