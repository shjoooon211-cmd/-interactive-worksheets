// متغيرات الرسم
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let isDrawing = false;
let currentTool = 'pencil';
let currentColor = '#8B4513';

// تهيئة Canvas
function initializeCanvas() {
    // ضبط حجم الـ Canvas
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth - 4;
    canvas.height = 300;
    
    // ملء الخلفية بلون أبيض
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeCanvas();
    setupCanvasEvents();
    setDateToday();
});

// ضبط التاريخ إلى اليوم
function setDateToday() {
    const dateInput = document.querySelector('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

// إعداد أحداث الـ Canvas
function setupCanvasEvents() {
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // دعم اللمس على الأجهزة المحمولة
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

// معالج بداية الرسم
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// معالج الرسم
function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (currentTool === 'pencil') {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (currentTool === 'eraser') {
        ctx.clearRect(x - 10, y - 10, 20, 20);
    }
}

// معالج نهاية الرسم
function stopDrawing() {
    isDrawing = false;
    ctx.closePath();
}

// معالج اللمس
function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

// تفعيل أداة القلم
function activatePencil() {
    currentTool = 'pencil';
    canvas.style.cursor = 'crosshair';
    updateToolButtons('pencil');
}

// تفعيل أداة الممحاة
function activateEraser() {
    currentTool = 'eraser';
    canvas.style.cursor = 'cell';
    updateToolButtons('eraser');
}

// فتح منتقي الألوان
function openColorPicker() {
    document.getElementById('colorPicker').click();
}

// تحديث لون الرسم
document.addEventListener('DOMContentLoaded', function() {
    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker) {
        colorPicker.addEventListener('change', function(e) {
            currentColor = e.target.value;
            currentTool = 'pencil';
            updateToolButtons('pencil');
        });
    }
});

// تحديث حالة أزرار الأدوات
function updateToolButtons(activeTool) {
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.style.opacity = '1';
        btn.style.transform = 'scale(1)';
    });
    
    if (activeTool === 'pencil') {
        document.querySelector('.pencil-btn').style.opacity = '0.7';
        document.querySelector('.pencil-btn').style.transform = 'scale(1.05)';
    } else if (activeTool === 'eraser') {
        document.querySelector('.eraser-btn').style.opacity = '0.7';
        document.querySelector('.eraser-btn').style.transform = 'scale(1.05)';
    }
}

// مسح الـ Canvas
function clearCanvas() {
    if (confirm('هل تريدين مسح الرسم بالكامل؟')) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// رفع صورة
function uploadImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // مسح الـ Canvas أولاً
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // حساب النسبة للحفاظ على الصورة
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;
            
            // رسم الصورة
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// حفظ العمل
function saveActivity() {
    const studentName = document.querySelector('input[type="text"]').value || 'الطالبة';
    const timestamp = new Date().toLocaleString('ar-SA');
    
    // جمع البيانات
    const activityData = {
        studentName: studentName,
        date: document.querySelector('input[type="date"]').value,
        thoughts: document.querySelector('.thinking-area textarea').value,
        surface: document.querySelector('.reflection-box input[type="text"]').value,
        reason: document.querySelectorAll('.reflection-box textarea')[0].value,
        impact: document.querySelectorAll('.reflection-box textarea')[1].value,
        learning: document.querySelectorAll('.reflection-box textarea')[2].value,
        rating: document.querySelector('input[name="rating"]:checked')?.value || 'لم يتم التقييم',
        timestamp: timestamp
    };
    
    // حفظ في Local Storage
    localStorage.setItem('artActivity_' + studentName + '_' + Date.now(), JSON.stringify(activityData));
    
    // رسالة تأكيد
    alert('✅ تم حفظ عملك بنجاح!\n\nاسم الطالبة: ' + studentName + '\nالوقت: ' + timestamp);
}

// طباعة الورقة
function printActivity() {
    window.print();
}

// إعادة تعيين الكل
function resetAll() {
    if (confirm('هل تريدين إعادة تعيين جميع البيانات؟ (هذا لا يمكن التراجع عنه)')) {
        // مسح النصوص
        document.querySelectorAll('input[type="text"]').forEach(input => {
            if (input.placeholder !== 'أكتبي اسمك هنا') {
                input.value = '';
            }
        });
        
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.value = '';
        });
        
        // مسح الـ Canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // إعادة تعيين التاريخ
        setDateToday();
        
        // إعادة تعيين التقييم
        document.querySelectorAll('input[name="rating"]').forEach(radio => {
            radio.checked = false;
        });
        
        // تمرير التركيز إلى الأعلى
        window.scrollTo(0, 0);
        
        alert('✅ تم إعادة تعيين الورقة بنجاح!');
    }
}

// إضافة تأثيرات عند التركيز على الحقول
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 15px rgba(205, 133, 63, 0.3)';
        });
        
        input.addEventListener('blur', function() {
            this.style.boxShadow = 'none';
        });
    });
});

// حفظ تلقائي كل 5 دقائق
setInterval(function() {
    const studentName = document.querySelector('input[type="text"]').value;
    if (studentName) {
        const autoSaveData = {
            studentName: studentName,
            autoSaved: true,
            timestamp: new Date().toLocaleString('ar-SA')
        };
        localStorage.setItem('autoSave_' + studentName, JSON.stringify(autoSaveData));
    }
}, 300000); // كل 5 دقائق

// معالج تغيير حجم النافذة
window.addEventListener('resize', function() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    initializeCanvas();
    ctx.putImageData(imageData, 0, 0);
});
