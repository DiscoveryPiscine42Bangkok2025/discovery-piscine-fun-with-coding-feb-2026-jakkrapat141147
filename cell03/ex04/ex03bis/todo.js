$(document).ready(function() {
    
    // โหลด Cookie เมื่อเปิดหน้าเว็บ
    loadCookies();

    // 1. ปุ่ม New (กดเพื่อเพิ่ม)
    $('#newBtn').click(function() {
        var text = prompt("Enter new TO DO:");
        if (text && text.trim() !== "") {
            addTodo(text);
            saveCookies();
        }
    });

    // 2. คลิกที่รายการเพื่อลบ (Event Delegation)
    // ใช้ .on('click', '.todo-item', ...) เพื่อให้ดักจับ element ที่เพิ่งสร้างใหม่ได้ด้วย
    $('#ft_list').on('click', '.todo-item', function() {
        if (confirm("Do you want to remove this item?")) {
            $(this).remove(); // ลบตัวเองทิ้งง่ายๆ เลย
            saveCookies();    // บันทึกใหม่
        }
    });

    // ฟังก์ชันเพิ่มรายการลงหน้าเว็บ (prepend = แทรกบนสุด)
    function addTodo(text) {
        // สร้าง div แล้วใส่ text แล้วแทรกลงไปเลย บรรทัดเดียวจบ
        $('#ft_list').prepend($('<div class="todo-item"></div>').text(text));
    }

    // ฟังก์ชันบันทึก Cookie
    function saveCookies() {
        var todos = [];
        // วนลูป items ทั้งหมดเพื่อเก็บข้อความ
        $('.todo-item').each(function() {
            // ใช้ unshift เพื่อให้ลำดับถูกต้องตอนบันทึก (เพราะเราอ่านจากบนลงล่าง)
            todos.unshift($(this).text());
        });

        // ตั้งค่า Cookie
        var jsonString = JSON.stringify(todos);
        var d = new Date();
        d.setTime(d.getTime() + (7*24*60*60*1000)); // 7 วัน
        document.cookie = "ft_list=" + encodeURIComponent(jsonString) + ";expires=" + d.toUTCString() + ";path=/";
    }

    // ฟังก์ชันอ่าน Cookie
    function loadCookies() {
        var name = "ft_list=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) {
                var jsonString = c.substring(name.length, c.length);
                try {
                    var todos = JSON.parse(jsonString);
                    // วนลูปสร้างกลับคืนมา
                    todos.forEach(function(msg) {
                        addTodo(msg);
                    });
                } catch(e) {}
            }
        }
    }
});