// متغيرات عامة
let draggedElement = null;
let draggedFrom = null;

// تهيئة الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeDragAndDrop();
    setupDropZones();
    setupMixedShapes();
});

// تهيئة السحب والإفلات
function initializeDragAndDrop() {
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach(shape => {
        shape.addEventListener('dragstart', handleDragStart);
        shape.addEventListener('dragend', handleDragEnd);
    });
}

// معالج بداية السحب
function handleDragStart(e) {
    draggedElement = this;
    draggedFrom = this.parentElement;
    this.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

// معالج نهاية السحب
function handleDragEnd(e) {
    this.style.opacity = '1';
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
}

// إعداد مناطق الإفلات
function setupDropZones() {
    const dropZones = document.querySelectorAll('.drop-zone');
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });
}

// معالج السحب فوق المنطقة
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

// معالج ترك السحب من المنطقة
function handleDragLeave(e) {
    if (e.target === this) {
        this.classList.remove('drag-over');
    }
}

// معالج الإفلات
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    this.classList.remove('drag-over');
    
    if (!draggedElement) return;
    
    const shapeType = draggedElement.getAttribute('data-shape');
    const zoneId = this.getAttribute('id');
    
    // التحقق من التصنيف الصحيح
    const isCorrect = 
        (shapeType === 'circle' && zoneId === 'circlesZone') ||
        (shapeType === 'triangle' && zoneId === 'trianglesZone');
    
    if (isCorrect) {
        // نقل الشكل إلى المنطقة الصحيحة
        this.appendChild(draggedElement);
        showSuccessAnimation(draggedElement);
        checkCompletion();
    } else {
        // تأثير الخطأ
        showErrorAnimation(draggedElement);
    }
    
    draggedElement = null;
    draggedFrom = null;
}

// تأثير النجاح
function showSuccessAnimation(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'popIn 0.3s ease';
    }, 10);
    
    // صوت النجاح (محاكاة)
    playSuccessSound();
}

// تأثير الخطأ
function showErrorAnimation(element) {
    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        element.style.animation = 'none';
    }, 500);
}

// تأثير الاهتزاز
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// صوت النجاح (محاكاة)
function playSuccessSound() {
    // يمكن إضافة صوت حقيقي هنا
    console.log('✓ صحيح!');
}

// إعداد الأشكال المختلطة
function setupMixedShapes() {
    const mixedShapes = document.querySelectorAll('.mixed-shapes-container .shape');
    mixedShapes.forEach(shape => {
        shape.addEventListener('dragstart', handleDragStart);
        shape.addEventListener('dragend', handleDragEnd);
    });
}

// التحقق من اكتمال التصنيف
function checkCompletion() {
    const circlesZone = document.getElementById('circlesZone');
    const trianglesZone = document.getElementById('trianglesZone');
    const mixedContainer = document.querySelector('.mixed-shapes-container');
    
    // التحقق من وجود أشكال في المناطق الصحيحة
    const circlesCount = circlesZone.querySelectorAll('.shape').length;
    const trianglesCount = trianglesZone.querySelectorAll('.shape').length;
    const mixedCount = mixedContainer.querySelectorAll('.shape').length;
    
    // إذا تم تصنيف جميع الأشكال
    if (mixedCount === 0 && (circlesCount > 0 || trianglesCount > 0)) {
        showCompletionMessage();
    }
}

// عرض رسالة الاكتمال
function showCompletionMessage() {
    // يمكن إضافة رسالة احتفالية هنا
    console.log('🎉 أحسنتِ! تم التصنيف بنجاح!');
}

// إضافة عنصر زخرفة
function addDecoration(type) {
    const canvas = document.getElementById('decorationCanvas');
    const decorationItem = document.createElement('div');
    decorationItem.className = 'decoration-item';
    
    if (type === 'circle') {
        const circles = ['🔵', '🔴', '🟡', '🟢', '🟠'];
        decorationItem.textContent = circles[Math.floor(Math.random() * circles.length)];
    } else if (type === 'triangle') {
        const triangles = ['🔺', '🔻', '📍'];
        decorationItem.textContent = triangles[Math.floor(Math.random() * triangles.length)];
    }
    
    canvas.appendChild(decorationItem);
}

// مسح الزخارف
function clearDecorations() {
    const canvas = document.getElementById('decorationCanvas');
    canvas.innerHTML = '';
}

// إعادة تعيين الكل
function resetAll() {
    // إعادة تعيين التصنيف
    const allShapes = document.querySelectorAll('.shape');
    const mixedContainer = document.querySelector('.mixed-shapes-container');
    
    allShapes.forEach(shape => {
        if (!shape.closest('.mixed-shapes-container')) {
            mixedContainer.appendChild(shape);
        }
    });
    
    // إعادة تهيئة الأحداث
    initializeDragAndDrop();
    setupMixedShapes();
    
    // مسح الزخارف
    clearDecorations();
    
    // تمرير التركيز إلى الأعلى
    window.scrollTo(0, 0);
}

// إضافة تأثيرات إضافية عند التفاعل
document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

// تحسين التجربة على الأجهزة اللمسية
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('shape')) {
            e.target.style.opacity = '0.7';
        }
    });
    
    document.addEventListener('touchend', function(e) {
        if (e.target.classList.contains('shape')) {
            e.target.style.opacity = '1';
        }
    });
}
